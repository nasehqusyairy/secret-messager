import { fetchMessages, postMessage } from "~/lib/mysql";
import fs from "fs/promises";
import path from "path";
import type { ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const sender = formData.get("sender");
    const msg = formData.get("msg");
    const images = formData.getAll("image"); // ini bisa berupa File

    let imageUrls: string[] = [];

    for (const image of images) {
        if (image instanceof File && image.size > 0) {
            const uploadDir = path.join(process.cwd(), "uploads");
            await fs.mkdir(uploadDir, { recursive: true });

            const fileName = Date.now() + "-" + image.name.replace(/\s+/g, "_");
            const filePath = path.join(uploadDir, fileName);

            // simpan file
            const arrayBuffer = await image.arrayBuffer();
            await fs.writeFile(filePath, Buffer.from(arrayBuffer));

            // simpan URL (misal public path)
            imageUrls.push(`/uploads/${fileName}`);
        }
    }

    //   ubah url gambar menjadi markdown
    const imageMarkdown = imageUrls.map(url => `![image](${url})`).join("\n");

    const message = msg ? (imageMarkdown ? imageMarkdown + "\n" : "") + msg.toString() : imageMarkdown;

    if (typeof sender === "string" && sender.trim() !== "" && typeof message === "string" && message.trim() !== "") {
        postMessage(sender, message ?? "");
    }

    return null;
}


export async function loader() {
    return { messages: await fetchMessages() };
}
