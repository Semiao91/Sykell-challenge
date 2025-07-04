import { Card, CardContent } from "../atoms/card";
import { Skeleton } from "../atoms/skeleton";

export const DashboardSkeleton = () => {
    return (
        <div className="container mx-auto p-6 space-y-2 mt-40">
            <Card className="mb-6">
            </Card>
            <Card>
                <CardContent>
                    <div className="mb-4">
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        {/* Skeleton rows to mimic table rows */}
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-4 border-b last:border-b-0"
                            >
                                <Skeleton className="h-5 w-5 rounded" />
                                <Skeleton className="h-5 w-64 rounded" />
                                <Skeleton className="h-5 w-48 rounded" />
                                <Skeleton className="h-5 w-24 rounded" />
                                <Skeleton className="h-5 w-24 rounded" />
                                <Skeleton className="h-5 w-5 rounded" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}