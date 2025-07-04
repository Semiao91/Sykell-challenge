import type { UrlAnalysis } from "@/interfaces/url"
import { Checkbox } from "../atoms/checkbox"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../molecules/table"
import { UrlTableRow } from "../molecules/urlTableRow"

interface UrlTableProps {
    urls: UrlAnalysis[]
    selectedUrls: string[]
    onSelectUrl: (id: string, checked: boolean) => void
    onSelectAll: (checked: boolean) => void
    onView: (url: UrlAnalysis) => void
    onDelete: (id: string) => void
}

export const UrlTable = ({
    urls,
    selectedUrls,
    onSelectUrl,
    onSelectAll,
    onView,
    onDelete,
}: UrlTableProps) => (
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
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>HTML Version</TableHead>
                <TableHead>Login Form</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {urls.map(url => (
                <UrlTableRow
                    onDelete={() => onDelete(url.ID)}
                    key={url.ID}
                    url={url}
                    selected={selectedUrls.includes(url.ID)}
                    onSelect={checked => onSelectUrl(url.ID, checked)}
                    onView={() => onView(url)}
                />
            ))}
        </TableBody>
    </Table>
)
