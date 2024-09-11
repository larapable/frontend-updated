"use client";
import AdminNavBar from "../components/AdminNavBar";
import AdminPage from "../components/AdminPage";


export default function AdminDashboardPage() {

  return (
    <div className="flex flex-row">
      <AdminNavBar />
      <div className="flex-1 flex flex-col mt-8 ml-80">
        <AdminPage />
      </div>
    </div>
  );
}