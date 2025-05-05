import * as FileSystem from "expo-file-system";

// Cloudinary credentials
const CLOUD_NAME = "dxsuaqzb4";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
const UPLOAD_PRESET = "unsigned-testing-preset"; // Unsigned upload preset

/**
 * Uploads an image to Cloudinary directly from React Native
 * @param {string} uri - The local URI of the image to upload
 * @returns {Promise<string>} - URL of the uploaded image
 */
export const uploadImageToCloudinary = async (uri: string): Promise<string> => {
  try {
    // Create form data for upload
    const formData = new FormData();

    // Get file info
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error("File does not exist");
    }

    // Get filename and extension
    const fileNameParts = uri.split("/");
    const fileName = fileNameParts[fileNameParts.length - 1];

    // For Expo/React Native, we need to use base64
    // Get the base64 representation of the image
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Create form data for the upload
    formData.append("file", `data:${getFileType(uri)};base64,${base64}`);

    // Add upload preset (for unsigned uploads)
    formData.append("upload_preset", UPLOAD_PRESET);

    // Optional parameters
    formData.append("folder", "product_images");

    console.log("Uploading to Cloudinary URL:", CLOUDINARY_URL);

    // Send the request to Cloudinary
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error(
        "Cloudinary response not OK:",
        response.status,
        response.statusText
      );
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Cloudinary upload successful:", responseData.secure_url);

    // Return the secure URL of the uploaded image
    return responseData.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

/**
 * Determines file type based on the file extension
 * @param {string} uri - File URI
 * @returns {string} - MIME type
 */
const getFileType = (uri: string): string => {
  const extension = uri.split(".").pop()?.toLowerCase() || "";

  switch (extension) {
    case "jpeg":
    case "jpg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "heic":
      return "image/heic";
    default:
      return "image/jpeg"; // Default to JPEG if can't determine
  }
};
