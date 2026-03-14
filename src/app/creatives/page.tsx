"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flex, Spinner } from "@chakra-ui/react";
import { AuthProvider, useAuth } from "@/store/AuthProvider";
import { ROUTES } from "@/constants";
import { getClaimedBrandId } from "@/lib/delayedAuth";
import CreativesShell from "@/components/creatives/CreativesShell";

// Skip static generation - this page requires authentication
export const dynamic = "force-dynamic";

function CreativesGate() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(ROUTES.LOGIN);
    }
  }, [isLoading, router, user]);

  const brandId = user ? getClaimedBrandId() : null;

  if (isLoading || !user) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="#F8F8F6">
        <Spinner size="lg" color="#4F46E5" />
      </Flex>
    );
  }

  return <CreativesShell brandId={brandId} />;
}

export default function CreativesPage() {
  return (
    <AuthProvider redirectToDashboard={false}>
      <CreativesGate />
    </AuthProvider>
  );
}
