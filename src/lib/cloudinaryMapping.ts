import { cld } from './cloudinary';

// Import mapping directly as JSON (Vite will handle this)
import cloudinaryMappingData from './cloudinary-mapping.json';

// Cache the mapping
const cloudinaryMapping: Record<string, string> = cloudinaryMappingData as Record<string, string>;

/**
 * Get Cloudinary URL for an image if it exists in mapping, otherwise return local path
 * @param localPath - Local image path (e.g., "/Blue Diamonds Foto's/IMG_5438.jpg")
 */
export function getCloudinaryImageUrl(localPath: string): string {
  // If it's already an absolute URL (e.g., WooCommerce product images), don't try to map it.
  if (/^(https?:)?\/\//i.test(localPath) || localPath.startsWith("data:") || localPath.startsWith("blob:")) {
    return localPath;
  }

  // Extract filename from path (e.g., "IMG_5438" from "/Blue Diamonds Foto's/IMG_5438.jpg")
  // Handle both "/Blue Diamonds Foto's/IMG_5438.jpg" and "IMG_5438.jpg"
  const filename = localPath.split("/").pop()?.replace(/\.(jpg|jpeg|png|gif|webp)$/i, "") || "";
  
  // Check if we have a Cloudinary mapping for this image
  const cloudinaryPublicId = cloudinaryMapping[filename];
  
  if (cloudinaryPublicId) {
    return cld(cloudinaryPublicId);
  }
  
  // Fallback to local path
  return localPath;
}

/**
 * Initialize Cloudinary mapping (no-op, mapping is loaded synchronously)
 */
export async function initCloudinaryMapping(): Promise<void> {
  // Mapping is already loaded synchronously
}
