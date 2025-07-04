import { cn } from "@/lib/utils";

export const Title = ({
    className,
    children,
}: React.ComponentProps<"h1">) => {
    return (
        <h1
            className={cn(
                "text-5xl font-bold tracking-tight mb-2",
                className
            )}
        >
            {children}
        </h1>
    );
}