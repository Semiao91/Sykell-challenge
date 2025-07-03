import { Plus } from "lucide-react"
import { Button } from "../atoms/button"
import { CardContent } from "../atoms/card"
import { Input } from "../atoms/input"

interface CardContentProps {
    newUrl: string
    setNewUrl: (url: string) => void
    addUrl: () => void
}


export const CardBody = ({
    newUrl,
    setNewUrl,
    addUrl
}: CardContentProps) => {
    return (
        <CardContent>
            <div className="flex gap-2">
                <Input
                    placeholder="https://example.com"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addUrl()}
                    className="flex-1"
                />
                <Button onClick={addUrl}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add URL
                </Button>
            </div>
        </CardContent>
    )
}