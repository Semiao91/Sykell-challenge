import type { Status } from "@/types/badge"
import { Badge } from "./badge"

export const StatusBadge = ({ status }: { status: Status }) => {
    const colors = {
        queued: "bg-gray-100 text-gray-800",
        running: "bg-blue-100 text-blue-800",
        complete: "bg-green-100 text-green-800",
        error: "bg-red-100 text-red-800",
    }
    return <Badge className={colors[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
}
