import { cn } from "@/lib/utils";

export const SubTitle = ({
    className,
    children,
}: React.ComponentProps<"h1">) => {
    return (
        <p
            className={cn(
                "text-muted-foreground",
                className
            )}
        >
            {children}
        </p>
    );
}