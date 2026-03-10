"use client";
import type { Expense, Photo } from "@/lib/store/useTravelStore";
import { useLangueStore } from "@/lib/store/useLangueStore";
import { t } from "@/lib/translations";
import type { LangCode } from "@/lib/types";
import {
  ArrowLeft,
  Camera,
  Download,
  MapPin,
  Navigation,
  Trash2,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Bed,
  Package,
  X,
  Loader2,
  ImagePlus,
} from "lucide-react";
import { Camera as CameraIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { compressImage } from "@/lib/compressImage";

const CATEGORY_STYLES: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    bg: string;
    iconColor: string;
  }
> = {
  food: {
    icon: UtensilsCrossed,
    bg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  transport: { icon: Car, bg: "bg-blue-50", iconColor: "text-blue-500" },
  shopping: { icon: ShoppingBag, bg: "bg-pink-50", iconColor: "text-pink-500" },
  accommodation: {
    icon: Bed,
    bg: "bg-violet-50",
    iconColor: "text-violet-500",
  },
  sightseeing: {
    icon: CameraIcon,
    bg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  other: { icon: Package, bg: "bg-slate-50", iconColor: "text-slate-500" },
};

type Props = {
  expense: Expense;
  currencyCode: string;
  onBack: () => void;
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
};

export default function ExpenseDetail({
  expense,
  currencyCode,
  onBack,
  updateExpense,
  deleteExpense,
}: Props) {
  const { language } = useLangueStore();
  const lang = language as LangCode;
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [locationInput, setLocationInput] = useState(expense.location ?? "");
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const style = CATEGORY_STYLES[expense.category] || CATEGORY_STYLES.other;
  const Icon = style.icon;
  const photos = expense.photos ?? [];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const weekdays =
      lang === "ko"
        ? ["일", "월", "화", "수", "목", "금", "토"]
        : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${month}/${day} (${weekdays[d.getDay()]})`;
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user) return;

    setUploading(true);
    try {
      // 1. 이미지 압축 (최대 1MB, 1200px)
      const compressed = await compressImage(file);

      // 2. Presigned URL 발급
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: compressed.name,
          fileType: compressed.type,
        }),
      });
      const { uploadUrl, key, imageUrl } = await res.json();

      // 3. S3에 업로드
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": compressed.type },
        body: compressed,
      });

      // 4. DB 업데이트
      const newPhoto: Photo = { key, url: imageUrl };
      await updateExpense(expense.id, {
        photos: [...photos, newPhoto],
      });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeletePhoto = async (photo: Photo) => {
    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: photo.key }),
      });

      await updateExpense(expense.id, {
        photos: photos.filter((p) => p.key !== photo.key),
      });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateExpense(expense.id, {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGettingLocation(false);
      },
      () => setGettingLocation(false),
      { enableHighAccuracy: true },
    );
  };

  const handleSaveLocation = async () => {
    if (savingLocation) return;
    setSavingLocation(true);
    try {
      await updateExpense(expense.id, { location: locationInput.trim() });
      setIsEditingLocation(false);
    } finally {
      setSavingLocation(false);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;
    if (window.confirm("이 지출을 삭제하시겠습니까?")) {
      setDeleting(true);
      try {
        for (const p of photos) {
          await fetch("/api/upload", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: p.key }),
          });
        }
        await deleteExpense(expense.id);
        onBack();
      } finally {
        setDeleting(false);
      }
    }
  };

  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div className="pb-8">
      {/* Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={async (e) => {
                e.stopPropagation();
                setDownloading(true);
                try {
                  const res = await fetch(
                    `/api/download?key=${encodeURIComponent(lightboxPhoto.key)}`,
                  );
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `photo-${Date.now()}.jpg`;
                  a.click();
                  URL.revokeObjectURL(url);
                } catch (err) {
                  console.error("Download failed:", err);
                } finally {
                  setDownloading(false);
                }
              }}
              disabled={downloading}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
            >
              {downloading ? (
                <Loader2 className="size-6 animate-spin" />
              ) : (
                <Download className="size-6" />
              )}
            </button>
            <button
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
              onClick={() => setLightboxPhoto(null)}
            >
              <X className="size-6" />
            </button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxPhoto.url}
            alt="photo"
            className="max-w-full max-h-full rounded-xl object-contain"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mt-2 mb-4">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-white/70 transition-colors"
        >
          <ArrowLeft className="size-5 text-slate-500" />
        </button>
        <h2 className="font-bold text-slate-800">지출 상세</h2>
      </div>

      {/* Category + Amount */}
      <div className={`${style.bg} rounded-2xl p-5 mb-4 text-center`}>
        <div className={`inline-flex p-3 rounded-full bg-white/60 mb-3`}>
          <Icon className={`size-7 ${style.iconColor}`} />
        </div>
        <p className={`text-sm font-semibold ${style.iconColor} mb-1`}>
          {t(expense.category, lang)}
        </p>
        <p className="text-3xl font-extrabold text-slate-800 tabular-nums">
          {expense.amount.toLocaleString()}
          <span className="text-base font-medium text-slate-400 ml-1.5">
            {currencyCode}
          </span>
        </p>
        <p className="text-sm text-slate-400 mt-2">
          {formatDate(expense.date)}
        </p>
        {expense.memo && (
          <p className="text-sm text-slate-500 mt-1">{expense.memo}</p>
        )}
      </div>

      {/* Location */}
      <div className="bg-white/80 rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="size-4 text-slate-400" />
          <p className="text-sm font-semibold text-slate-600">위치</p>
        </div>

        {isEditingLocation ? (
          <div className="space-y-2">
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="e.g. 시부야, 도쿄"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveLocation}
                disabled={savingLocation}
                className="flex-1 text-sm font-medium text-white bg-slate-700 rounded-xl py-2 hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {savingLocation ? <Loader2 className="size-3.5 animate-spin" /> : "저장"}
              </button>
              <button
                onClick={() => setIsEditingLocation(false)}
                className="flex-1 text-sm font-medium text-slate-500 bg-slate-100 rounded-xl py-2 hover:bg-slate-200 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <div>
            {expense.location ? (
              <p className="text-sm text-slate-700 mb-2">{expense.location}</p>
            ) : (
              <p className="text-xs text-slate-400 mb-2">위치 정보 없음</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setLocationInput(expense.location ?? "");
                  setIsEditingLocation(true);
                }}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 rounded-lg px-3 py-1.5 hover:bg-slate-100 transition-colors"
              >
                <MapPin className="size-3" />
                {expense.location ? "수정" : "위치 추가"}
              </button>
              <button
                onClick={handleGetCurrentLocation}
                disabled={gettingLocation}
                className="flex items-center gap-1.5 text-xs font-medium text-blue-500 bg-blue-50 rounded-lg px-3 py-1.5 hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                {gettingLocation ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Navigation className="size-3" />
                )}
                현재 위치
              </button>
            </div>
          </div>
        )}

        {/* Static Map */}
        {expense.lat && expense.lng && mapsApiKey && (
          <div className="mt-3">
            <Image
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${expense.lat},${expense.lng}&zoom=15&size=600x200&scale=2&markers=color:red|${expense.lat},${expense.lng}&key=${mapsApiKey}`}
              alt="location map"
              width={600}
              height={200}
              className="w-full h-32 object-cover rounded-xl"
            />
          </div>
        )}
      </div>

      {/* Photos */}
      <div className="bg-white/80 rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Camera className="size-4 text-slate-400" />
          <p className="text-sm font-semibold text-slate-600">사진</p>
          <span className="text-xs text-slate-400">{photos.length}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <div key={photo.key} className="relative group aspect-square">
              <Image
                src={photo.url}
                alt="expense photo"
                width={200}
                height={200}
                className="w-full h-full object-cover rounded-xl cursor-pointer"
                onClick={() => setLightboxPhoto(photo)}
              />
              <button
                onClick={() => handleDeletePhoto(photo)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}

          {/* Add photo button */}
          {session?.user && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-500 hover:border-slate-300 transition-colors"
            >
              {uploading ? (
                <Loader2 className="size-6 animate-spin" />
              ) : (
                <ImagePlus className="size-6" />
              )}
              <span className="text-[10px]">추가</span>
            </button>
          )}
        </div>

        {!session?.user && (
          <p className="text-xs text-slate-400 mt-2">
            사진 업로드는 로그인이 필요합니다
          </p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </div>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
      >
        {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
        {deleting ? "삭제 중..." : "지출 삭제"}
      </button>
    </div>
  );
}
