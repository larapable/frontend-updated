"use client";
import Navbar from "../components/Navbars/Navbar";
import Inputgoals from "../components/InputGoals/Inputgoals";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../components/Misc/Spinner";

export default function Page() {
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
      <Inputgoals />
    </>
  );
}
