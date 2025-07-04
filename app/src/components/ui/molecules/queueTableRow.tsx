import { Play, Trash2 } from "lucide-react"
import { Button } from "../atoms/button"
import { Checkbox } from "../atoms/checkbox"
import { TableCell, TableRow } from "../molecules/table"

interface QueuedUrl {
    id: string
    url: string
}

interface QueueTableRowProps {
    url: QueuedUrl
    selected: boolean
    onSelect: (checked: boolean) => void
    onRun: () => void
    onDelete: () => void
}

export const QueueTableRow = ({
    url,
    selected,
    onSelect,
    onRun,
    onDelete,
}: QueueTableRowProps) => (
    <TableRow>
        <TableCell>
            <Checkbox checked={selected} onCheckedChange={onSelect} />
        </TableCell>
        <TableCell className="font-mono text-sm max-w-xs truncate">{url.url}</TableCell>
        <TableCell className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={onRun}>
                <Play className="h-3 w-3 mr-1" /> Run
            </Button>
            <Button size="sm" variant="destructive" onClick={onDelete}>
                <Trash2 className="h-3 w-3" />
            </Button>
        </TableCell>
    </TableRow>
)
