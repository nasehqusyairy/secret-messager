import { Button } from "~/components/ui/button";
import { Image as ImageIcon } from "lucide-react";
import { useFilePreviewer } from "./providers/file-previewer";

export function ImageUploadButton({ name = "image" }: { name?: string }) {
    const { handleFileChange, inputRef } = useFilePreviewer();

    return (
        <>
            <Button
                type="button"
                size="icon"
                onClick={() => inputRef.current?.click()}
            >
                <ImageIcon />
            </Button>
            <input
                multiple
                type="file"
                name={name}
                ref={inputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

        </>
    );
}
