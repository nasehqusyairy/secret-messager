import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"

type PasswordDialogProps = {
    sender: string
    err: string
    dialogOnSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export default ({ sender, err, dialogOnSubmit }: PasswordDialogProps) => {
    return (
        <Dialog open={sender === ""}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Enter your password</DialogTitle>
                </DialogHeader>
                {err && <p className="text-red-500 text-xs">{err}</p>}
                <form onSubmit={dialogOnSubmit} className="flex gap-2">
                    <Input type="password" autoFocus name="name" />
                    <Button>Submit</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}