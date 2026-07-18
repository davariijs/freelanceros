"use client";

import * as React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useApp } from "@/context/AppContext";

export function GoogleAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale } = useApp();

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
      locale={locale}
      key={locale}
    >
      {children}
    </GoogleOAuthProvider>
  );
}
