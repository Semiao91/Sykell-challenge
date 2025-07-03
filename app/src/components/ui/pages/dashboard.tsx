import { DashboardTemplate } from "../templates/dashboard";

export const DashboardPage = ({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) => {
    return (
        <DashboardTemplate className={className} {...props}>
            {children}
        </DashboardTemplate>
    );
}