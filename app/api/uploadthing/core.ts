import { createUploadthing, UploadThingError, type FileRouter } from "uploadthing/server";
import { getAdminSession } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
  })
    .middleware(async () => {
      const session = await getAdminSession();

      if (!session) {
        throw new UploadThingError({
          code: "FORBIDDEN",
          message: "Unauthorized",
        });
      }

      return {
        uploadedBy: typeof session.email === "string" ? session.email : "admin",
      };
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete for file:", file.name);
      console.log("File URL:", file.url);
      return { url: file.url, name: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
