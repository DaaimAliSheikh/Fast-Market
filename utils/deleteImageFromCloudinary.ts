import { sha1 } from "js-sha1";

// Cloudinary API credentials
const API_KEY = "674423217576732";
const API_SECRET = "jf1vw-QWXppv6qVZK4_qa3ZxS0I";
const CLOUD_NAME = "dxsuaqzb4";
const CLOUDINARY_DESTROY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`;

/**
 * Extracts Cloudinary public_id from secure_url
 */
const extractPublicId = (secureUrl: string): string => {
  const url = new URL(secureUrl);
  const pathSegments = url.pathname.split("/");

  // Find the index of 'upload' to identify the start of the public_id path
  const uploadIndex = pathSegments.findIndex((segment) => segment === "upload");
  if (uploadIndex === -1) {
    throw new Error("Invalid Cloudinary URL: 'upload' segment not found.");
  }

  // The public_id path starts after the 'upload' segment
  const publicIdSegments = pathSegments.slice(uploadIndex + 1);

  // If the first segment starts with 'v' followed by digits, it's a version segment and should be removed
  if (publicIdSegments[0].match(/^v\d+$/)) {
    publicIdSegments.shift();
  }

  // Join the remaining segments to form the public_id
  const publicIdWithExtension = publicIdSegments.join("/");
  const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ""); // Remove file extension

  return publicId;
};

/**
 * Deletes an image from Cloudinary using its secure URL
 */
export const deleteImageFromCloudinary = async (
  secureUrl: string
): Promise<void> => {
  try {
    const publicId = extractPublicId(secureUrl);

    // Create timestamp and signature
    const timestamp = Math.floor(Date.now() / 1000);
    const signatureBase = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
    const signature = sha1(signatureBase);

    // Build form data
    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("api_key", API_KEY);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);

    // Send delete request
    const response = await fetch(CLOUDINARY_DESTROY_URL, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok && result.result === "ok") {
      console.log(`✅ Successfully deleted ${publicId} from Cloudinary.`);
    } else {
      console.error("❌ Cloudinary deletion failed:", result);
      throw new Error(result.error?.message || "Failed to delete image.");
    }
  } catch (error) {
    console.error("❌ Error deleting image from Cloudinary:", error);
    throw error;
  }
};
