import { Checkbox } from "../atoms/checkbox"
import { QueueTableRow } from "../molecules/queueTableRow"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../molecules/table"

interface QueuedUrl {
    id: string
    url: string
}

interface QueueTableProps {
    urls: QueuedUrl[]
    selectedUrls: string[]
    onSelectUrl: (id: string, checked: boolean) => void
    onSelectAll: (checked: boolean) => void
    onRun: (id: string) => void
    onDelete: (id: string) => void
}

export const QueueTable = ({
    urls,
    selectedUrls,
    onSelectUrl,
    onSelectAll,
    onRun,
    onDelete,
}: QueueTableProps) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-12">
                    <Checkbox
                        checked={selectedUrls.length === urls.length && urls.length > 0}
                        onCheckedChange={onSelectAll}
                    />
                </TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {urls.map((url) => (
                <QueueTableRow
                    key={url.id}
                    url={url}
                    selected={selectedUrls.includes(url.id)}
                    onSelect={(checked) => onSelectUrl(url.id, checked)}
                    onRun={() => onRun(url.id)}
                    onDelete={() => onDelete(url.id)}
                />
            ))}
        </TableBody>
    </Table>
)
