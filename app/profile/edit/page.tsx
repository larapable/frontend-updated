"use client";
import Navbar from "@/app/components/Navbar";
import UserEditProfile from "@/app/components/EditProfile";

export default function EditProfile() {

  return (
    <div className="flex flex-row w-full h-screen">
      <div className="flex">
        <Navbar />
      </div>
      <div className="flex-1">
        <div className="flex-1 flex flex-col mt-3 ml-80">
          <UserEditProfile />
        </div>
      </div>
    </div>
  );
}
