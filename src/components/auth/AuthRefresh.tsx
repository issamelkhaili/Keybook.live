"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function AuthRefresh() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Log the current session state for debugging
  useEffect(() => {
    console.log("Auth status:", status);
    console.log("Session:", session);
    console.log("Current path:", pathname);
  }, [status, session, pathname]);

  // This component doesn't render anything visible
  return null;
} 