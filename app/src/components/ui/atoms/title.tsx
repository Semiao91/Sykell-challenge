import { cn } from "@/lib/utils";

export const Title = ({
    className,
    children,
}: React.ComponentProps<"h1">) => {
    return (
        <h1
            className={cn(
                "text-6xl font-bold tracking-tight",
                className
            )}
        >
            {children}
        </h1>
    );
}