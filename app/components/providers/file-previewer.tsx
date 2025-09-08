
import React, { createContext, useContext, useState, useRef } from "react";

type FilePreviewerContextType = {
    file: File[] | null;
    previewUrl: string[] | null;
    pickFile: () => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
    removeFile: (index: number) => void;
    clearFiles: () => void;
};

const FilePreviewerContext = createContext<FilePreviewerContextType | undefined>(
    undefined
);

export function FilePreviewerProvider({ children }: { children: React.ReactNode }) {
    const [file, setFile] = useState<File[] | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string[] | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const pickFile = () => {
        inputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ?? null;
        setFile([...selectedFile!]);
        setPreviewUrl(selectedFile ? [...selectedFile].map(el => URL.createObjectURL(el)) : null);
    };

    const removeFile = (index: number) => {
        if (!file) return;

        const newFiles = file.filter((_, i) => i !== index);
        const newPreviews = previewUrl?.filter((_, i) => i !== index) || null;

        setFile(newFiles.length > 0 ? newFiles : null);
        setPreviewUrl(newPreviews);

        // update elemen input
        if (inputRef.current) {
            const dataTransfer = new DataTransfer();
            newFiles.forEach(file => dataTransfer.items.add(file));
            inputRef.current.files = dataTransfer.files;
        }
    };

    const clearFiles = () => {
        setFile(null);
        setPreviewUrl(null);

        // reset elemen input
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <FilePreviewerContext.Provider
            value={{ file, previewUrl, pickFile, handleFileChange, inputRef, removeFile, clearFiles }}
        >
            {children}
        </FilePreviewerContext.Provider>
    );
}

export function useFilePreviewer() {
    const context = useContext(FilePreviewerContext);
    if (!context) {
        throw new Error("useFilePreviewer must be used within an FilePreviewerProvider");
    }
    return context;
}
