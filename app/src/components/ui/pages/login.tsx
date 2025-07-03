import { LoginTemplate } from "../templates/login";

export const LoginPage = ({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) => {
    return (
        <LoginTemplate className={className} {...props}>
            {children}
        </LoginTemplate>
    );
}