import { useFetcher } from "react-router";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ImageUploadButton } from "./upload-image-button";
import { Loader, Send } from "lucide-react";

type ChatboxFormProps = {
    sender: string;
    messagerOnSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default ({ sender, messagerOnSubmit }: ChatboxFormProps) => {
    const fetcher = useFetcher();
    return <fetcher.Form encType="multipart/form-data" method="post" action="/api/messages" className="flex items-center gap-4 w-full" onSubmit={messagerOnSubmit}>
        <input type="hidden" name="sender" value={sender} />
        <Textarea name="msg" placeholder="Type your message..." className="resize-none" />
        <div className="flex gap-2">
            <Button disabled={fetcher.state === "submitting"} type="submit" size={"icon"}>
                {fetcher.state === "submitting" ? <Loader className="animate-spin" /> : <Send />}
            </Button>
            <ImageUploadButton name="image" />
        </div>
    </fetcher.Form>
}