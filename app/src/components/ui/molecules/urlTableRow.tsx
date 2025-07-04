import type { UrlAnalysis } from "@/interfaces/url"
import { ExternalLink, Trash2 } from "lucide-react"
import { Button } from "../atoms/button"
import { Checkbox } from "../atoms/checkbox"
import { StatusBadge } from "../atoms/statusBadge"
import { TableCell, TableRow } from "../molecules/table"

interface UrlTableRowProps {
    url: UrlAnalysis
    selected: boolean
    onSelect: (checked: boolean) => void
    onView: () => void
    onDelete: () => void
}

export const UrlTableRow = ({
    url,
    selected,
    onSelect,
    onView,
    onDelete,
}: UrlTableRowProps) => (
    <TableRow
        className="cursor-pointer hover:bg-muted/50"
        onClick={() => url.status === "complete" && onView()}
    >
        <TableCell>
            <Checkbox checked={selected} onCheckedChange={onSelect} onClick={e => e.stopPropagation()} />
        </TableCell>
        <TableCell className="font-mono text-sm max-w-xs truncate">{url.url}</TableCell>
        <TableCell className="max-w-xs truncate">{url.title || "-"}</TableCell>
        <TableCell>
            <div className="space-y-1">
                <StatusBadge status={url.status} />
            </div>
        </TableCell>
        <TableCell>{url.html_version || "-"}</TableCell>
        <TableCell>{url.has_login_form ? "✓" : "✗"}</TableCell>
        <TableCell>
            <div className="flex gap-1">
                {url.status === "complete" && (
                    <Button className="" size="sm" variant="outline" onClick={e => { e.stopPropagation(); onView(); }}>
                        <ExternalLink className="h-3 w-3" />
                    </Button>
                )}
                <Button size="sm" variant="destructive" onClick={e => { e.stopPropagation(); onDelete(); }}>
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>
        </TableCell>
    </TableRow>
)
