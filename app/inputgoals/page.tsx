"use client";
import Navbar from "../components/Navbar";
import Inputgoals from "../components/Inputgoals";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../components/Spinner";

export default function page() {
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
        <div className="flex flex-row">
            <Navbar />
            <div className="flex-1 flex flex-col mt-8 ml-56">
                <Inputgoals />
            </div>
        </div>
    );
}