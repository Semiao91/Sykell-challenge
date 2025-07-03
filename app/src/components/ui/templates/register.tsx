import { Title } from "../atoms/title";
import { RegisterForm } from "../organisms/register-form";

export const RegisterTemplate = ({

}: React.ComponentProps<"div">) => {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Title className="text-center pb-20" children="Sykell"></Title>
                <RegisterForm />
            </div>
        </div>
    );
}