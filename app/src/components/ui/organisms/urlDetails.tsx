import type { UrlAnalysis } from "@/interfaces/url"
import { AlertTriangle } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Badge } from "../atoms/badge"
import { Button } from "../atoms/button"
import { Card, CardContent, CardTitle } from "../atoms/card"
import { CardHeader } from "../organisms/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../organisms/chart"

export const UrlDetails = ({ selectedUrl, onBack }: { selectedUrl: UrlAnalysis, onBack: () => void }) => {
    const linkData = [
        { name: "Internal Links", value: selectedUrl.internal_links, fill: "#3b82f6" },
        { name: "External Links", value: selectedUrl.external_links, fill: "#10b981" },
        { name: "Broken Links", value: selectedUrl.broken_links, fill: "#ef4444" },
    ]
    const headingData = Object.entries(selectedUrl.heading_counts).map(([level, count]) => ({ level, count }))
    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" onClick={onBack}>
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
                        <div className="text-2xl font-bold">{selectedUrl.html_version || "Unknown"}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{selectedUrl.internal_links + selectedUrl.external_links}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Broken Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{selectedUrl.broken_links}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Login Form</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{selectedUrl.has_login_form ? "✓" : "✗"}</div>
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
                                <BarChart accessibilityLayer data={headingData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="level"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                    <YAxis />
                                    <Bar activeBar={false} dataKey="count" fill="#3b82f6" />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>

                </Card>
            </div>
            {selectedUrl.broken_links > 0 ? (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Broken Links
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {selectedUrl.broken_link_details.map((link, index) => (
                                <div key={index} className="flex items-center justify-between p-2 border rounded">
                                    <span className="font-mono text-sm">{link.url}</span>
                                    <Badge>{link.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )
                : (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                Broken Links
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                No broken links found for this URL...
                            </div>
                        </CardContent>
                    </Card>
                )
            }
        </div>
    )
}
