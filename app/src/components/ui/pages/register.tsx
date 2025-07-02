import { RegisterTemplate } from "../templates/register";

export const RegisterPage = ({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) => {
    return (
        <RegisterTemplate className={className} {...props}>
            {children}
        </RegisterTemplate>
    );
}
