export function isImageFile(file) {
  if (!file) return false;
  if (file.type && file.type.startsWith("image/")) {
    return true;
  }
  const validExt = /\.(jpe?g|png|gif|bmp|webp)$/i;
  if (validExt.test(file.name)) {
    return true;
  }
  return false;
}
 