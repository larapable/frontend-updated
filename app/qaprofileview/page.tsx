"use client";
import QANavbar from "../components/Navbars/QANavbar";
import QADepartmentView from "../components/QAProfile/QADepartmentView";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../components/Misc/Spinner";

export default function QProfileView() {
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
      <QADepartmentView />
    </>
  );
}
