"use client";
import QANavbar from "../components/QANavbar";
import QADepartmentView from "@/app/components/QADepartmentView";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../components/Spinner";

export default  function QProfileView() {
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
          <QANavbar />
        </div>
        <div className="flex-1">
          <div className="flex-1 flex flex-col mt-3 ml-80">
            <QADepartmentView />
          </div>
        </div>
      </div>
    );
  }