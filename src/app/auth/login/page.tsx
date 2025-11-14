"use client";
import { LoginForm } from "@/components/forms/LoginForm";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          <p className="text-sm font-medium">
            Authentication failed: {decodeURIComponent(error)}
          </p>
        </div>
      )}
      <LoginForm />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginForm />}>
      <LoginContent />
    </Suspense>
  );
}
