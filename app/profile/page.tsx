"use client";
import UserProfile from "../components/Profile/UserProfile";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../components/Misc/Spinner";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Spinner />;
  }

  if (status === "unauthenticated") {
    return null;
  }
  return (
    <>
      <UserProfile />
    </>
  );
}
