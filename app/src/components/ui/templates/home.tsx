import { cn } from "@/lib/utils";

export const HomeTemplate = ({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) => {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center justify-center h-screen">
                {children}
            </div>
        </div>
    );
}