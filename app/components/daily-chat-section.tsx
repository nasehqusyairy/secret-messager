import type { DailyMessages } from "~/models/daily-message";
import Bubble from "./bubble"

type DailyChatSectionProps = {
    sender: string;
    daily: DailyMessages[];
}

export default ({ sender, daily }: DailyChatSectionProps) => {
    return (
        <>
            {daily.map((d) => {
                return (
                    <div key={d.date}>
                        <h1 className="mb-4 text-muted-foreground text-sm text-center">{d.date}</h1>
                        {d.messages.map((message) => {
                            if (message.sender.toLowerCase() === sender.toLowerCase()) {
                                return <Bubble message={message} key={message.id} />
                            }
                            return <Bubble message={message} direction="left" key={message.id} />
                        })}
                    </div>
                )
            })}
        </>
    )
}