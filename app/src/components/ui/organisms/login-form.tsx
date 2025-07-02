import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/atoms/card"
import { useLogin } from "@/hooks/useLogin"
import { cn } from "@/lib/utils"
import { type LoginSchema, loginSchema } from "@/schemas/form/login.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Button } from "../atoms/button"
import { Input } from "../atoms/input"
import { Label } from "../atoms/label"
import { Form, FormField } from "../molecules/form"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const { handleLogin } = useLogin();
  const navigate = useNavigate();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  },
  );
  const onSubmit = async (values: LoginSchema) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await handleLogin(values);
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
                <div className="flex flex-col gap-3">
                  <Button disabled={form.formState.isSubmitting} type="submit" className="w-full">
                    {form.formState.isSubmitting && <Loader2Icon className="animate-spin" />}
                    Login
                  </Button>
                  <Button disabled={form.formState.isSubmitting} onClick={() => navigate("/register")} variant="outline" className="w-full">
                    Don't have an account? Register
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
