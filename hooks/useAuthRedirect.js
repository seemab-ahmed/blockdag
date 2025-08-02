import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const walletAddress = localStorage.getItem("walletAddress");

    // If not logged in, redirect to /login from any page except /login
    if (!walletAddress && pathname !== "/") {
      router.replace("/");
    }
    // If logged in and on /login or /, redirect to /dashboard
    if (walletAddress && (pathname === "/")) {
      router.replace("/dashboard");
    }
  }, [router, pathname]);
}