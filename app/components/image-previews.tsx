import { X } from "lucide-react"
import { Button } from "./ui/button"
import { useFilePreviewer } from "./providers/file-previewer";


export default () => {
    const { previewUrl, removeFile } = useFilePreviewer();
    return (
        <div className="flex gap-2">
            {previewUrl && previewUrl.map((url, index) => (
                <div className="relative mb-2">
                    <Button type="button" onClick={() => removeFile(index)} className="-top-2 -right-2 absolute rounded-full" size={"xs"} variant={"destructive"}>
                        <X />
                    </Button>
                    <img src={url} alt="Preview" className="rounded-lg h-12" />
                </div>
            ))}
        </div>
    )
}