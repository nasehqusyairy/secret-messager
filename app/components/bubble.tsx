import Markdown from "markdown-to-jsx"
import { useEffect, useRef, useState } from "react"
import type { Message } from "~/models/message"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import hljs from 'highlight.js';
import { Button } from "./ui/button";

type BubbleProps = {
    message: Message
    direction?: "left" | "right"
}

type SyntaxHighlightedCodeProps = React.HTMLAttributes<HTMLElement>;

function SyntaxHighlightedCode(props: SyntaxHighlightedCodeProps) {
    const ref = useRef<HTMLElement | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (ref.current && props.className?.includes("lang-") && typeof hljs !== "undefined") {
            hljs.highlightElement(ref.current);
        }
    }, [props.className, props.children]);

    const handleCopy = async () => {
        if (ref.current) {
            const text = ref.current.innerText;
            try {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); // reset status setelah 2 detik
            } catch (err) {
                console.error("Copy failed:", err);
            }
        }
    };

    return (
        <div className="group relative">
            <button
                onClick={handleCopy}
                className="top-2 right-2 absolute bg-gray-700 opacity-0 group-hover:opacity-100 px-2 py-1 rounded text-white text-xs transition cursor-pointer"
            >
                {copied ? "Copied!" : "Copy"}
            </button>
            <code {...props} ref={ref} className={`${props.className} block p-2 rounded`} />
        </div>
    );
}

function ImageDialog(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <img {...props} />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogDescription>
                    <img {...props} />
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ({ message, direction = "right" }: BubbleProps) => {
    return (
        <div className={`relative flex ${direction === 'right' ? 'justify-end' : ''} mb-4 message`}>
            <div className={`top-0 ${direction === 'right' ? '-right-2' : '-left-2'} absolute border-r-8 border-r-transparent border-b-8 ${direction === 'right' ? 'border-b-primary' : 'border-b-secondary'} border-l-8 border-l-transparent w-0 h-0 ${direction === 'right' ? '-rotate-45' : 'rotate-45'}`} />
            <div className={`flex flex-wrap justify-end items-end gap-2 ${direction === 'right' ? 'bg-primary' : 'bg-secondary'} p-2 rounded-lg lg:max-w-8/12 ${direction === 'right' ? 'text-primary-foreground' : 'text-secondary-foreground'}`}>
                {/* <div className="mb-2 font-bold text-xs uppercase">{sender}</div> */}
                <Markdown options={{
                    overrides: {
                        code: SyntaxHighlightedCode,
                        img: ImageDialog
                    },
                }} className="text-sm break-words hyphens-auto">{message.msg}</Markdown>
                <div className="flex justify-end shrink-0">
                    <span className="text-xs">
                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        </div>
    )
}