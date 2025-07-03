import { Checkbox } from "@radix-ui/react-checkbox"
import { Progress } from "@radix-ui/react-progress"
import { AlertTriangle, Badge, ExternalLink, Play, Search, Square } from "lucide-react"
import { useState } from "react"
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Button } from "../atoms/button"
import { Card, CardContent, CardTitle } from "../atoms/card"
import { Input } from "../atoms/input"
import { CardBody } from "../molecules/cardContent"
import { CardHeading } from "../molecules/cardHeadder"
import { Header } from "../molecules/headder"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../molecules/table"
import { CardHeader } from "../organisms/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../organisms/chart"
interface UrlAnalysis {
    id: string
    url: string
    title: string
    htmlVersion: string
    status: "queued" | "running" | "completed" | "error"
    progress: number
    internalLinks: number
    externalLinks: number
    brokenLinks: number
    headingCounts: { [key: string]: number }
    hasLoginForm: boolean
    brokenLinkDetails: { url: string; statusCode: number }[]
    analyzedAt?: Date
}

const mockData: UrlAnalysis[] = [
    {
        id: "1",
        url: "https://example.com",
        title: "Example Domain",
        htmlVersion: "HTML5",
        status: "completed",
        progress: 100,
        internalLinks: 15,
        externalLinks: 8,
        brokenLinks: 2,
        headingCounts: { H1: 1, H2: 4, H3: 8, H4: 2 },
        hasLoginForm: false,
        brokenLinkDetails: [
            { url: "https://example.com/broken1", statusCode: 404 },
            { url: "https://example.com/broken2", statusCode: 500 },
        ],
        analyzedAt: new Date(),
    },
    {
        id: "2",
        url: "https://github.com",
        title: "GitHub: Let's build from here",
        htmlVersion: "HTML5",
        status: "running",
        progress: 65,
        internalLinks: 45,
        externalLinks: 12,
        brokenLinks: 0,
        headingCounts: { H1: 2, H2: 6, H3: 12, H4: 5, H5: 3 },
        hasLoginForm: true,
        brokenLinkDetails: [],
    },
    {
        id: "3",
        url: "https://vercel.com",
        title: "Vercel: Build and deploy the best web experiences",
        htmlVersion: "HTML5",
        status: "queued",
        progress: 0,
        internalLinks: 0,
        externalLinks: 0,
        brokenLinks: 0,
        headingCounts: {},
        hasLoginForm: false,
        brokenLinkDetails: [],
    },
]

export const DashboardTemplate = () => {
    const [urls, setUrls] = useState<UrlAnalysis[]>(mockData)
    const [newUrl, setNewUrl] = useState("")
    const [selectedUrls, setSelectedUrls] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUrl, setSelectedUrl] = useState<UrlAnalysis | null>(null)
    console.log("DashboardTemplate rendered with URLs:", urls)
    const addUrl = () => {
        if (newUrl.trim()) {
            const newAnalysis: UrlAnalysis = {
                id: Date.now().toString(),
                url: newUrl.trim(),
                title: "",
                htmlVersion: "",
                status: "queued",
                progress: 0,
                internalLinks: 0,
                externalLinks: 0,
                brokenLinks: 0,
                headingCounts: {},
                hasLoginForm: false,
                brokenLinkDetails: [],
            }
            setUrls([...urls, newAnalysis])
            setNewUrl("")
        }
    }

    const startAnalysis = (id: string) => {
        setUrls(urls.map((url) => (url.id === id ? { ...url, status: "running" as const, progress: 0 } : url)))

        // Simulate progress
        const interval = setInterval(() => {
            setUrls((currentUrls) =>
                currentUrls.map((url) => {
                    if (url.id === id && url.status === "running") {
                        const newProgress = Math.min(url.progress + Math.random() * 20, 100)
                        if (newProgress >= 100) {
                            clearInterval(interval)
                            return {
                                ...url,
                                status: "completed" as const,
                                progress: 100,
                                title: `Analyzed: ${url.url}`,
                                htmlVersion: "HTML5",
                                internalLinks: Math.floor(Math.random() * 50),
                                externalLinks: Math.floor(Math.random() * 20),
                                brokenLinks: Math.floor(Math.random() * 5),
                                headingCounts: {
                                    H1: Math.floor(Math.random() * 3) + 1,
                                    H2: Math.floor(Math.random() * 8) + 2,
                                    H3: Math.floor(Math.random() * 15) + 3,
                                    H4: Math.floor(Math.random() * 10),
                                    H5: Math.floor(Math.random() * 5),
                                    H6: Math.floor(Math.random() * 3),
                                },
                                hasLoginForm: Math.random() > 0.5,
                                analyzedAt: new Date(),
                            }
                        }
                        return { ...url, progress: newProgress }
                    }
                    return url
                }),
            )
        }, 500)
    }

    const stopAnalysis = (id: string) => {
        setUrls(urls.map((url) => (url.id === id ? { ...url, status: "queued" as const, progress: 0 } : url)))
    }

    const deleteSelected = () => {
        setUrls(urls.filter((url) => !selectedUrls.includes(url.id)))
        setSelectedUrls([])
    }

    const rerunSelected = () => {
        selectedUrls.forEach((id) => startAnalysis(id))
        setSelectedUrls([])
    }

    const filteredUrls = urls.filter(
        (url) =>
            url.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
            url.title.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const getStatusBadge = (status: UrlAnalysis["status"]) => {
        const variants = {
            queued: "secondary",
            running: "default",
            completed: "default",
            error: "destructive",
        } as const

        const colors = {
            queued: "bg-gray-100 text-gray-800",
            running: "bg-blue-100 text-blue-800",
            completed: "bg-green-100 text-green-800",
            error: "bg-red-100 text-red-800",
        }

        return <Badge className={colors[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
    }

    const linkData = selectedUrl
        ? [
            { name: "Internal Links", value: selectedUrl.internalLinks, fill: "#3b82f6" },
            { name: "External Links", value: selectedUrl.externalLinks, fill: "#10b981" },
            { name: "Broken Links", value: selectedUrl.brokenLinks, fill: "#ef4444" },
        ]
        : []

    const headingData = selectedUrl
        ? Object.entries(selectedUrl.headingCounts).map(([level, count]) => ({
            level,
            count,
        }))
        : []

    if (selectedUrl) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" onClick={() => setSelectedUrl(null)}>
                        ← Back to Dashboard
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{selectedUrl.title || selectedUrl.url}</h1>
                        <p className="text-muted-foreground">{selectedUrl.url}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">HTML Version</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{selectedUrl.htmlVersion}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{selectedUrl.internalLinks + selectedUrl.externalLinks}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Broken Links</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{selectedUrl.brokenLinks}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Login Form</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{selectedUrl.hasLoginForm ? "✓" : "✗"}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Link Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={{
                                    internal: { label: "Internal Links", color: "#3b82f6" },
                                    external: { label: "External Links", color: "#10b981" },
                                    broken: { label: "Broken Links", color: "#ef4444" },
                                }}
                                className="h-[300px]"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={linkData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({ name, value }) => `${name}: ${value}`}
                                        >
                                            {linkData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Heading Structure</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={{
                                    count: { label: "Count", color: "#3b82f6" },
                                }}
                                className="h-[300px]"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={headingData}>
                                        <XAxis dataKey="level" />
                                        <YAxis />
                                        <Bar dataKey="count" fill="#3b82f6" />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                {selectedUrl.brokenLinks > 0 && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                Broken Links
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {selectedUrl.brokenLinkDetails.map((link, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                                        <span className="font-mono text-sm">{link.url}</span>
                                        <Badge>{link.statusCode}</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Header title={"URL Analysis Dashboard"} subTitle={"Manage your website analyses"} />
                </div>
            </div>

            <Card className="mb-6">
                <CardHeading title="Add New URL" subTitle="Enter a website URL to analyze" />
                <CardBody
                    newUrl={newUrl} setNewUrl={setNewUrl} addUrl={addUrl} />
            </Card>

            <Card>

                <CardHeading title="URL Analysis List" subTitle="View and manage your analyzed URLs" />

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
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectedUrls.length === filteredUrls.length && filteredUrls.length > 0}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedUrls(filteredUrls.map((url) => url.id))
                                                } else {
                                                    setSelectedUrls([])
                                                }
                                            }}
                                        />
                                    </TableHead>
                                    <TableHead>URL</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>HTML Version</TableHead>
                                    <TableHead>Internal Links</TableHead>
                                    <TableHead>External Links</TableHead>
                                    <TableHead>Broken Links</TableHead>
                                    <TableHead>Login Form</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUrls.map((url) => (
                                    <TableRow
                                        key={url.id}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => url.status === "completed" && setSelectedUrl(url)}
                                    >
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedUrls.includes(url.id)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedUrls([...selectedUrls, url.id])
                                                    } else {
                                                        setSelectedUrls(selectedUrls.filter((id) => id !== url.id))
                                                    }
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </TableCell>
                                        <TableCell className="font-mono text-sm max-w-xs truncate">{url.url}</TableCell>
                                        <TableCell className="max-w-xs truncate">{url.title || "-"}</TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                {getStatusBadge(url.status)}
                                                {url.status === "running" && <Progress value={url.progress} className="w-20" />}
                                            </div>
                                        </TableCell>
                                        <TableCell>{url.htmlVersion || "-"}</TableCell>
                                        <TableCell>{url.internalLinks}</TableCell>
                                        <TableCell>{url.externalLinks}</TableCell>
                                        <TableCell>
                                            {url.brokenLinks > 0 ? (
                                                <span className="text-red-600 font-medium">{url.brokenLinks}</span>
                                            ) : (
                                                url.brokenLinks
                                            )}
                                        </TableCell>
                                        <TableCell>{url.hasLoginForm ? "✓" : "✗"}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                {url.status === "queued" && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            startAnalysis(url.id)
                                                        }}
                                                    >
                                                        <Play className="h-3 w-3" />
                                                    </Button>
                                                )}
                                                {url.status === "running" && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            stopAnalysis(url.id)
                                                        }}
                                                    >
                                                        <Square className="h-3 w-3" />
                                                    </Button>
                                                )}
                                                {url.status === "completed" && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setSelectedUrl(url)
                                                        }}
                                                    >
                                                        <ExternalLink className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
