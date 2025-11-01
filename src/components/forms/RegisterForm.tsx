"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { schemaRegister } from "./schemas";

export const RegisterForm = () => {
  const { control, handleSubmit } = useForm<z.infer<typeof schemaRegister>>({
    defaultValues: {
      username: "",
      password: "",
      email: undefined,
      displayname: undefined,
    },
    mode: "onTouched",
    resolver: zodResolver(schemaRegister),
  });

  const onSubmit = async (data: z.infer<typeof schemaRegister>) => {
    console.log("✅ FORM SUBMITTED SUCCESSFULLY!");
    console.log("data", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="username"
        control={control}
        render={({ field, fieldState }) => (
          <>
            <input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              placeholder="Enter your username"
            />
            {fieldState.invalid && <p>{fieldState.error?.message}</p>}
          </>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => {
          console.log("fieldState:", fieldState);
          console.log("field:", field);

          return (
            <>
              <input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                placeholder="Enter your password"
              />
              {fieldState.invalid && <p>{fieldState.error?.message}</p>}
            </>
          );
        }}
      />

      <input type="submit" />
    </form>
  );
};
