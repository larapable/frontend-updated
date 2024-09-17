"use client";
import Navbar from "../components/Navbar";
import UserProfile from "@/app/components/UserProfile";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../components/Spinner";

export default  function Profile() {
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
    <div className="flex flex-row w-full h-screen">
      <div className="flex">
        <Navbar />
      </div>
      <div className="flex-1">
        <div className="flex-1 flex flex-col mt-3 ml-80">
          <UserProfile />
        </div>
      </div>
    </div>
  );
}