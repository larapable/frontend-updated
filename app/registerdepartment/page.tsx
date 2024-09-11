"use client";
import AdminNavbar from "../components/AdminNavBar";
import RegisterDepartment from "../components/RegisterDepartment"

export default function RegisterDepartmentPage() {
  return (
    <div className="flex flex-row">
      <AdminNavbar />
      <div className="flex-1 flex flex-col mt-8 ml-80">
        <RegisterDepartment />
      </div>
    </div>
  );
}
