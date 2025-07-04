import { useScrape } from "@/hooks/useScrape"
import type { UrlAnalysis } from "@/interfaces/url"
import { Search } from "lucide-react"
import { useState } from "react"
import { Button } from "../atoms/button"
import { Card, CardContent } from "../atoms/card"
import { Input } from "../atoms/input"
import { CardBody } from "../molecules/cardContent"
import { CardHeading } from "../molecules/cardHeadder"
import { Header } from "../molecules/headder"
import { DashboardSkeleton } from "../organisms/dashboardSkeleton"
import { QueueTable } from "../organisms/queueTable"
import { UrlDetails } from "../organisms/urlDetails"
import { UrlTable } from "../organisms/urlTable"

interface QueuedUrl {
    id: string
    url: string
}

export const DashboardTemplate = () => {
    const [newUrl, setNewUrl] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUrl, setSelectedUrl] = useState<UrlAnalysis | null>(null)

    const { urlsData, handleScrape, urlsLoading, deleteUrl } = useScrape()
    const [selectedUrls, setSelectedUrls] = useState<string[]>([])

    const [queuedUrls, setQueuedUrls] = useState<QueuedUrl[]>([])
    const [selectedQueuedIds, setSelectedQueuedIds] = useState<string[]>([])


    // Skeleton
    if (urlsLoading) return <DashboardSkeleton />

    // Show details view
    if (selectedUrl) {
        return <UrlDetails selectedUrl={selectedUrl} onBack={() => setSelectedUrl(null)} />
    }

    console.log(urlsData)
    const addUrl = () => {
        if (!newUrl.trim()) return
        const id = crypto.randomUUID()
        setQueuedUrls([...queuedUrls, { id, url: newUrl.trim() }])
        setNewUrl("")
    }

    const handleDeleteSelected = () => {
        setQueuedUrls(queuedUrls.filter((u) => !selectedQueuedIds.includes(u.id)))
        setSelectedQueuedIds([])
        setSelectedUrls([])
    }

    const handleRun = (id: string) => {
        const urlEntry = queuedUrls.find((u) => u.id === id)
        if (!urlEntry) return
        handleScrape({ url: urlEntry.url })
        setQueuedUrls(queuedUrls.filter((u) => u.id !== id))
        setSelectedQueuedIds(selectedQueuedIds.filter((sid) => sid !== id))
    }

    const handleDelete = (id: string) => {
        setQueuedUrls(queuedUrls.filter((u) => u.id !== id))
        setSelectedQueuedIds(selectedQueuedIds.filter((sid) => sid !== id))
        console.log("Deleting URL with ID:", id)
        deleteUrl(id.toString())
    }

    const handleSelectQueuedUrl = (id: string, checked: boolean) => {
        setSelectedQueuedIds(checked ? [...selectedQueuedIds, id] : selectedQueuedIds.filter((sid) => sid !== id))
    }

    const handleSelectAllQueued = (checked: boolean) => {
        setSelectedQueuedIds(checked ? queuedUrls.map((u) => u.id) : [])
    }

    const filteredUrls = urlsData.filter(
        (url: UrlAnalysis) =>
            url.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
            url.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSelectUrl = (id: string, checked: boolean) => {
        setSelectedUrls(checked ? [...selectedUrls, id] : selectedUrls.filter((sid) => sid !== id))
    }

    const handleSelectAll = (checked: boolean) => {
        setSelectedUrls(checked ? filteredUrls.map((url: UrlAnalysis) => url.ID) : [])
    }



    return (
        <div className="container pt-20 mx-auto p-6">
            <Header className="mb-6" title={"URL Analysis Dashboard"} subTitle={"Manage your website analyses"} />

            <Card className="mb-6">
                <CardHeading title="Add New URL" subTitle="Enter a website URL to analyze" />
                <CardBody newUrl={newUrl} setNewUrl={setNewUrl} addUrl={addUrl} />
            </Card>

            <Card className="mb-6">
                <CardHeading title="URL Analysis Queue" subTitle="Add a URL to the analysis queue..." />
                <CardContent>
                    <div className="border rounded-lg">
                        <QueueTable
                            urls={queuedUrls}
                            selectedUrls={selectedQueuedIds}
                            onSelectUrl={handleSelectQueuedUrl}
                            onSelectAll={handleSelectAllQueued}
                            onRun={handleRun}
                            onDelete={handleDeleteSelected}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeading title="URL Analysis List" subTitle="View and manage your analyzed URLs" />
                <Button variant="outline">Delete URLs</Button>
                <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search URLs or titles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="border rounded-lg">
                        <UrlTable
                            onDelete={handleDelete}
                            urls={!urlsLoading ? filteredUrls : []}
                            selectedUrls={selectedUrls}
                            onSelectUrl={handleSelectUrl}
                            onSelectAll={handleSelectAll}
                            onView={setSelectedUrl}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
