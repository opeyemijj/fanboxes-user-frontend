// utils/uploadToSpaces.js
import AWS from "aws-sdk";

// Configure AWS SDK
const spaceEndpoint = new AWS.Endpoint("nyc3.digitaloceanspaces.com");
const s3 = new AWS.S3({
  endpoint: spaceEndpoint,
  accessKeyId: process.env.NEXT_PUBLIC_DO_SPACES_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_DO_SPACES_SECRET,
  region: "nyc3",
});

/**
 * Delete file from DigitalOcean Spaces
 * @param {string} fileKey - The key of the file to delete
 * @returns {Promise<boolean>}
 */
export const deleteFromSpaces = async (fileKey) => {
  try {
    if (!fileKey) {
      console.warn("No file key provided for deletion");
      return false;
    }

    await s3
      .deleteObject({
        Bucket: process.env.NEXT_PUBLIC_DO_SPACES_BUCKET,
        Key: fileKey,
      })
      .promise();

    console.log("Successfully deleted file:", fileKey);
    return true;
  } catch (error) {
    console.error("Error deleting file from Spaces:", error);
    // Don't throw error for deletion failures - we don't want to block uploads
    return false;
  }
};

/**
 * Extract file key from DigitalOcean Spaces URL
 * @param {string} url - The full URL of the file
 * @returns {string} - The file key
 */
export const extractFileKeyFromUrl = (url) => {
  if (!url) return null;

  try {
    const urlObj = new URL(url);
    // Remove leading slash from pathname
    return urlObj.pathname.substring(1);
  } catch (error) {
    console.error("Error extracting file key from URL:", error);
    return null;
  }
};

/**
 * Upload file to DigitalOcean Spaces with progress tracking
 * @param {File} file - The file to upload
 * @param {string} folder - Folder path (default: 'profile-pictures')
 * @param {Function} onProgress - Optional upload progress callback
 * @returns {Promise<{ _id: string, url: string, blurDataURL: string }>}
 */
export const uploadToSpaces = async (
  file,
  folder = "profile-pictures",
  onProgress = null
) => {
  try {
    // Validate file
    if (!file || !(file instanceof File)) {
      throw new Error("Invalid file provided");
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error("File size must be less than 5MB");
    }

    // Generate unique file key
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileKey = `${folder}/${timestamp}-${randomString}-${sanitizedName}`;

    const uploadParams = {
      Bucket: process.env.NEXT_PUBLIC_DO_SPACES_BUCKET,
      Key: fileKey,
      Body: file,
      ACL: "public-read",
      ContentType: file.type,
      CacheControl: "max-age=31536000", // Cache for 1 year
    };

    if (onProgress) {
      // For progress tracking, we need to use the managed upload
      const upload = s3.upload(uploadParams);

      upload.on("httpUploadProgress", (progress) => {
        const percent = Math.round((progress.loaded * 100) / progress.total);
        onProgress(percent);
      });

      const data = await upload.promise();

      return {
        _id: fileKey,
        url: data.Location,
        blurDataURL: data.Location, // Using same URL for blurDataURL for now
      };
    } else {
      // Without progress tracking, use simpler promise-based upload
      const data = await s3.upload(uploadParams).promise();

      return {
        _id: fileKey,
        url: data.Location,
        blurDataURL: data.Location,
      };
    }
  } catch (error) {
    console.error("Error uploading to DigitalOcean Spaces:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Replace user profile picture - uploads new image and deletes old one
 * @param {File} newFile - The new image file
 * @param {Object} currentUser - Current user object with existing cover
 * @param {Function} onProgress - Optional upload progress callback
 * @returns {Promise<{ _id: string, url: string, blurDataURL: string }>}
 */
export const replaceProfilePicture = async (
  newFile,
  currentUser,
  onProgress = null
) => {
  try {
    // Upload new image
    const uploadResult = await uploadToSpaces(
      newFile,
      "profile-pictures",
      onProgress
    );

    // Delete old profile picture if it exists and is from DigitalOcean Spaces
    if (currentUser?.cover?.url) {
      const oldFileKey = extractFileKeyFromUrl(currentUser.cover.url);
      if (oldFileKey && oldFileKey.startsWith("profile-pictures/")) {
        // Don't await deletion - we can do it in background
        deleteFromSpaces(oldFileKey).catch((error) => {
          console.warn("Failed to delete old profile picture:", error);
        });
      }
    }

    return uploadResult;
  } catch (error) {
    console.error("Error replacing profile picture:", error);
    throw error;
  }
};

export default uploadToSpaces;
