import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppKitAccount, useDisconnect } from "@reown/appkit/react";
export function useAuthRedirect() {
  console.log("useAuthRedirect called");
  // const { isConnected } = useAppKitAccount();
  // const router = useRouter();
  // useEffect(() => {
  //   // If not logged in, redirect to /login from any page except /login
  //   if (!isConnected) {
  //     router.replace("/");
  //   }
  //   // If logged in and on /login or /, redirect to /dashboard
  //   if (isConnected) {
  //     router.replace("/dashboard");
  //   }
  // }, [isConnected, router]);
}
