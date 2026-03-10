const MAX_SIZE = 1024 * 1024; // 1MB
const MAX_WIDTH = 1200;

export async function compressImage(file: File): Promise<File> {
  // 이미 1MB 이하면 그대로 반환
  if (file.size <= MAX_SIZE && !file.type.includes("heic")) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;

  // 비율 유지하면서 리사이즈
  let newWidth = width;
  let newHeight = height;
  if (width > MAX_WIDTH) {
    newWidth = MAX_WIDTH;
    newHeight = Math.round((height * MAX_WIDTH) / width);
  }

  const canvas = new OffscreenCanvas(newWidth, newHeight);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, newWidth, newHeight);
  bitmap.close();

  // 품질을 낮춰가며 1MB 이하가 될 때까지 압축
  let quality = 0.8;
  let blob = await canvas.convertToBlob({ type: "image/jpeg", quality });

  while (blob.size > MAX_SIZE && quality > 0.3) {
    quality -= 0.1;
    blob = await canvas.convertToBlob({ type: "image/jpeg", quality });
  }

  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
    type: "image/jpeg",
  });
}
