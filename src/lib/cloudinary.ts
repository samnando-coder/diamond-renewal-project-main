const CLOUD_NAME = "dzqzd0o0a";

/**
 * Generate Cloudinary URL for an image
 * @param publicId - The Cloudinary public_id (e.g., "blue diamonds/IMG_5340")
 * @param options - Optional transformation options
 */
export function cld(publicId: string, options?: { format?: string; quality?: string | number }) {
  const format = options?.format || "f_auto";
  const quality = options?.quality || "q_auto";
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${format},${quality}/${publicId}`;
}

/**
 * Get image URL - uses Cloudinary if mapping exists, otherwise falls back to local path
 * @param localPath - Local image path (e.g., "/Blue Diamonds Foto's/IMG_5438.jpg")
 * @param mapping - Cloudinary mapping object
 */
export function getImageUrl(localPath: string, mapping?: Record<string, string>): string {
  if (!mapping) return localPath;
  
  // Extract filename from path (e.g., "IMG_5438.jpg" from "/Blue Diamonds Foto's/IMG_5438.jpg")
  const filename = localPath.split("/").pop()?.replace(/\.(jpg|jpeg|png)$/i, "") || "";
  
  // Check if we have a Cloudinary mapping for this image
  const cloudinaryPublicId = mapping[filename];
  
  if (cloudinaryPublicId) {
    return cld(cloudinaryPublicId);
  }
  
  // Fallback to local path
  return localPath;
}
