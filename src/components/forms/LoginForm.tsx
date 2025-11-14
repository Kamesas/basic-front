"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { schemaLogin } from "./schemas";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<z.infer<typeof schemaLogin>>({
    defaultValues: {
      password: "",
      email: "",
    },
    mode: "onTouched",
    resolver: zodResolver(schemaLogin),
  });

  const onSubmit = async (data: z.infer<typeof schemaLogin>) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🔐 Attempting login with email:", data.email);

      const response = await fetchAPI("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      console.log("🔐 Response status:", response.status);
      const result = await response.json();
      console.log("🔐 Response data:", result);

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      // With httpOnly cookies, tokens are automatically stored by the browser
      console.log("✅ Login successful! Cookies set by server.");

      // Store user data if provided
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
        console.log("✅ User data stored:", result.user.username);
      }

      console.log("✅ Redirecting to dashboard...");
      router.push("/");
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const googleLoginUrl = `${apiUrl}/api/auth/login/google`;
    console.log("🔵 Redirecting to Google OAuth:", googleLoginUrl);
    window.location.href = googleLoginUrl;
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {error && (
                <Field>
                  <div className="rounded-md bg-destructive/15 p-3 text-destructive">
                    <p className="text-sm">{error}</p>
                  </div>
                </Field>
              )}
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Field>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        placeholder="m@example.com"
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  </>
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Field>
                      <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <a
                          href="/auth/forgot-password"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </a>
                      </div>
                      <Input
                        {...field}
                        id={field.name}
                        type="password"
                        required
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        placeholder="m@example.com"
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  </>
                )}
              />

              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <a href="/auth/register">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
