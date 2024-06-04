"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@repo/ui/appbar";
import { useRouter } from "next/navigation";

export function AppbarClient() {
  const session = useSession();
  const router = useRouter();

  return (
    <div>
       <Appbar onSignin={signIn} onSignout={async () => {
         console.log("Signing out"); // Debug log
         await signOut(); // Ensure this line executes successfully
         console.log("Redirecting to signin"); // Debug log
         router.push("/signin");
       }} user={session.data?.user} />
    </div>
   );
}
