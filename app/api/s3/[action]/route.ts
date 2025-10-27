import { NextApiRequest, NextApiResponse } from "next";
import { uploadFile, deleteFile, getFileUrl } from "@/app/lib/s3/s3Service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.query;

  console.log("s3 api is called......");
  console.log("action name :",action);

  try {
    if (action === "upload" && req.method === "POST") {
      const { file, key } = req.body;
      const url = await uploadFile(file, key);
      return res.status(200).json({ url });
    }

    if (action === "get" && req.method === "GET") {
      const { key } = req.query;
      const url = await getFileUrl(key as string);
      return res.status(200).json({ url });
    }

    if (action === "delete" && req.method === "DELETE") {
      const { key } = req.query;
      await deleteFile(key as string);
      return res.status(200).json({ message: "File deleted successfully" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
