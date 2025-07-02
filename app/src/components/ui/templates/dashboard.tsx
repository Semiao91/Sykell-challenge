import { ExternalLink, Play, Plus, RefreshCw, Search, Square, Table, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../atoms/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../atoms/card";
import { Checkbox } from "../atoms/checkbox";
import { Input } from "../atoms/input";
import { Header } from "../molecules/headder";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "../molecules/table";

export const DashboardTemplate = ({

}: React.ComponentProps<"div">) => {
    const [newUrl, setNewUrl] = useState("");

    const addUrl = () => {
        if (newUrl.trim() === "") return;
        // Here you would typically handle the URL submission, e.g., send it to an API
        console.log("Adding URL:", newUrl);
        setNewUrl(""); // Clear the input after adding
    };
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">

                <Header title="URL Crawler" subTitle="Crawl and analyze website information" />
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Add New URL</CardTitle>
                        <CardDescription>Enter a website URL to analyze</CardDescription>
                    </CardHeader>
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
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Analysis Dashboard</CardTitle>
                                <CardDescription>Manage and view your URL analyses</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                {selectedUrls.length > 0 && (
                                    <>
                                        <Button variant="outline" onClick={rerunSelected}>
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Re-run Selected
                                        </Button>
                                        <Button variant="destructive" onClick={deleteSelected}>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Selected
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardHeader>
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
        </div>
    );
}