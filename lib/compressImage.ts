const MAX_SIZE = 1024 * 1024; // 1MB
const MAX_WIDTH = 1200;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      "image/jpeg",
      quality,
    );
  });
}

export async function compressImage(file: File): Promise<File> {
  // 이미 1MB 이하이고 HEIC가 아니면 그대로 반환
  if (file.size <= MAX_SIZE && !file.type.includes("heic")) {
    return file;
  }

  const img = await loadImage(file);
  const { width, height } = img;

  // 비율 유지하면서 리사이즈
  let newWidth = width;
  let newHeight = height;
  if (width > MAX_WIDTH) {
    newWidth = MAX_WIDTH;
    newHeight = Math.round((height * MAX_WIDTH) / width);
  }

  const canvas = document.createElement("canvas");
  canvas.width = newWidth;
  canvas.height = newHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, newWidth, newHeight);

  // 품질을 낮춰가며 1MB 이하가 될 때까지 압축
  let quality = 0.8;
  let blob = await canvasToBlob(canvas, quality);

  while (blob.size > MAX_SIZE && quality > 0.3) {
    quality -= 0.1;
    blob = await canvasToBlob(canvas, quality);
  }

  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
    type: "image/jpeg",
  });
}
