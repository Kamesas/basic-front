"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log("🔍 OAuth Callback - Full URL:", window.location.href);
    console.log(
      "🔍 All search params:",
      Object.fromEntries(searchParams.entries()),
    );

    const success = searchParams.get("success");
    const error = searchParams.get("error");

    console.log("🔍 Success:", success || "No");
    console.log("🔍 Error received:", error || "No");

    if (error) {
      console.error("❌ Authentication error:", error);
      router.push("/auth/login?error=" + encodeURIComponent(error));
      return;
    }

    if (success === "true") {
      console.log("✅ OAuth authentication successful!");
      console.log("✅ Cookies have been set by the server");
      console.log("✅ Redirecting to dashboard...");
      router.push("/");
      return;
    }

    console.warn("⚠️ No success flag found in callback, redirecting to login");
    router.push(
      "/auth/login?error=" +
        encodeURIComponent("Authentication was not completed"),
    );
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold">Completing authentication...</h2>
        <p className="mt-2 text-muted-foreground">Please wait</p>
        <p className="text-xs text-muted-foreground">
          Check browser console for details
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Loading...</h2>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
