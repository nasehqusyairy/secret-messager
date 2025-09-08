import { Card, CardContent, CardFooter } from "~/components/ui/card";
import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import type { Message } from "~/models/message";
import { useFilePreviewer } from "~/components/providers/file-previewer";
import PasswordDialog from "~/components/password-dialog";
import ImagePreviews from "~/components/image-previews";
import ChatboxForm from "~/components/chatbox-form";
import type { DailyMessages } from "~/models/daily-message";
import DailyChatSection from "~/components/daily-chat-section";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Secret Messager" },
    { name: "description", content: "Welcome to Secret Messager!" },
  ];
}

export default function Home({ }: Route.ComponentProps) {

  const { clearFiles } = useFilePreviewer();

  const [sender, setSender] = useState("");
  const [msgs, setMsgs] = useState<number>(0);
  const [daily, setDaily] = useState<DailyMessages[]>([]);
  const [err, setErr] = useState<string>("");

  const dialogOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    if (typeof name === "string" && (name.trim().toLowerCase() === 'naseh' || name.trim().toLowerCase() === 'lala')) {
      localStorage.setItem("sender", name ? name.toString() : "");
      setSender(name.trim());
    } else {
      setErr("Invalid password");
    }
  }

  const messagerOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formel = e.currentTarget
    setTimeout(() => {
      formel.reset();
      clearFiles();
    }, 100);
  }

  useEffect(() => {
    localStorage.getItem("sender") && setSender(localStorage.getItem("sender") || "");

    const interval = setInterval(async () => {
      const res = await fetch("/api/messages");
      const { messages } = (await res.json()) as { messages: Message[] };

      if (msgs !== messages.length) {

        // kelompokkan berdasarkan tanggal dan { date,messages:[] }
        const groupedMessages = messages.reduce((acc, curr) => {
          const date = new Date(curr.created_at).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = { date, messages: [] };
          }
          acc[date].messages.push(curr);
          return acc;
        }, {} as Record<string, { date: string; messages: Message[] }>);

        setMsgs(messages.length);
        setDaily(Object.values(groupedMessages));
      }
    }, 1000);

    const container = document.getElementById("message-container")!
    container.scrollTop = container.scrollHeight

    return () => clearInterval(interval);
  }, [msgs]);

  return (
    <main className="flex justify-center items-center bg-muted py-12 w-full min-h-[100vh]">

      <PasswordDialog sender={sender} err={err} dialogOnSubmit={dialogOnSubmit} />

      <Card className="w-full md:w-6/12">

        <CardContent className="h-[60vh] overflow-y-auto" id="message-container">
          <DailyChatSection sender={sender} daily={daily} />
        </CardContent>

        <CardFooter className="block border-t">
          <ImagePreviews />
          <ChatboxForm sender={sender} messagerOnSubmit={messagerOnSubmit} />
        </CardFooter>

      </Card>
    </main>
  );
}
