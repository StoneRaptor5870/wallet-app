"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@repo/ui/appbar";
import { useRouter } from "next/navigation";

export function AppbarClient() {
  const session = useSession();
  const router = useRouter();

  const handleSignout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/api/auth/signin");
    } catch (error) {
      console.error("Error during signout", error);
    }
  };

  return (
    <div>
      <Appbar
        onSignin={signIn}
        onSignout={handleSignout}
        user={session.data?.user}
      />
    </div>
  );
}
