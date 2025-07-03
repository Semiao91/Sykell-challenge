import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/atoms/card"
import { useRegisterForm } from "@/hooks/useRegisterForm"
import { cn } from "@/lib/utils"
import type { RegisterSchema } from "@/schemas/form/register.schema"
import { registerSchema } from "@/schemas/form/register.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Button } from "../atoms/button"
import { Input } from "../atoms/input"
import { Label } from "../atoms/label"
import { Form, FormField } from "../molecules/form"

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const { handleRegister } = useRegisterForm();
    const navigate = useNavigate();
    const form = useForm<RegisterSchema>({

        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
        mode: "onSubmit",
    });
    const onSubmit = async (values: RegisterSchema) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        await handleRegister(values);
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Register for an account</CardTitle>
                    <CardDescription>
                        Enter your email below to create a new account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="flex flex-col gap-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field, fieldState }) => (
                                        <div className="grid gap-3">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                className={cn(
                                                    "w-full",
                                                    fieldState.error ? "border-red-500" : ""
                                                )}
                                                id="email"
                                                type="email"
                                                placeholder="m@example.com"
                                                required
                                                {...field}
                                            />
                                            {fieldState.error && (
                                                <p className="text-sm text-red-500">{fieldState.error.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field, fieldState }) => (
                                        <div className="grid gap-3">
                                            <div className="flex items-center">
                                                <Label htmlFor="password">Password</Label>
                                            </div>
                                            <Input
                                                className={cn(
                                                    "w-full",
                                                    fieldState.error ? "border-red-500" : ""
                                                )}
                                                id="password"
                                                type="password"
                                                maxLength={10}
                                                required
                                                {...field}
                                            />
                                            {fieldState.error && (
                                                <p className="text-sm text-red-500">{fieldState.error.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field, fieldState }) => (
                                        <div className="grid gap-3">
                                            <div className="flex items-center">
                                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                            </div>
                                            <Input
                                                className={cn(
                                                    "w-full",
                                                    fieldState.error ? "border-red-500" : ""
                                                )}
                                                id="confirm-password"
                                                type="password"
                                                maxLength={10}
                                                required
                                                {...field}
                                            />
                                            {fieldState.error && (
                                                <p className="text-sm text-red-500">{fieldState.error.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                                <div className="flex flex-col gap-3">
                                    <Button disabled={form.formState.isSubmitting} type="submit" className="w-full">
                                        {form.formState.isSubmitting && <Loader2Icon className="animate-spin" />}
                                        Register
                                    </Button>
                                    <Button disabled={form.formState.isSubmitting} onClick={() => navigate("/")} variant="outline" className="w-full">
                                        Already have an account? Login
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
