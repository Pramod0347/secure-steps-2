import axios from "axios";

export const useS3 = () => {
  // Function to upload a file to S3
  const uploadFile = async (file: File, key: string): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("key", key);

      const NextUrl = process.env.NEXTAUTH_URL || window.location.origin;

      const { data } = await axios.post(`${NextUrl}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data.url; // URL of the uploaded file
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("File upload failed. Please try again.");
    }
  };

  // Function to get the URL of a file from S3
  const getFileUrl = async (key: string): Promise<string> => {
    try {
      const NextUrl = process.env.NEXTAUTH_URL || window.location.origin;
      const { data } = await axios.get(`${NextUrl}/api/s3/get?key=${encodeURIComponent(key)}`);
      return data.url; // URL of the requested file
    } catch (error) {
      console.error("Error fetching file URL:", error);
      throw new Error("Failed to fetch file URL. Please try again.");
    }
  };

  // Function to delete a file from S3
  const deleteFile = async (key: string): Promise<void> => {
    try {
      const NextUrl = process.env.NEXTAUTH_URL || window.location.origin;
      await axios.delete(`${NextUrl}/api/s3/delete?key=${encodeURIComponent(key)}`);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new Error("File deletion failed. Please try again.");
    }
  };

  return { uploadFile, getFileUrl, deleteFile };
};
