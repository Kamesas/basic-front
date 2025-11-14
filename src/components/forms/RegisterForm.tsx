"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { schemaRegister } from "./schemas";

import {
  FieldError,
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

export const RegisterForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { control, handleSubmit } = useForm<z.infer<typeof schemaRegister>>({
    defaultValues: {
      username: "",
      password: "",
      email: "",
      displayName: "",
    },
    mode: "onTouched",
    resolver: zodResolver(schemaRegister),
  });

  const onSubmit = async (data: z.infer<typeof schemaRegister>) => {
    console.log("✅ FORM SUBMITTED SUCCESSFULLY!");
    console.log("data", data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>Create an account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Register with Google
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or with your email
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
                        autoComplete="email"
                        placeholder="m@example.com"
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  </>
                )}
              />

              <Controller
                name="username"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Field>
                      <FieldLabel htmlFor="username">Username</FieldLabel>
                      <Input
                        {...field}
                        type="text"
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        autoComplete="new-username"
                        placeholder="username"
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  </>
                )}
              />

              <Controller
                name="displayName"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Field>
                      <FieldLabel htmlFor="displayName">
                        Display name
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        placeholder="Display Name"
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
                          href="#"
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
                        autoComplete="new-password"
                        placeholder="m@example.com"
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  </>
                )}
              />

              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/auth/login">Sign up</a>
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
};
