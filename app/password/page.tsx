"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Navbar from '../components/Navbars/Navbar';
import Link from 'next/link';

export default function Password() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [changePassword, setChangePassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);


    const { data: session } = useSession();
    const user = session?.user ? JSON.parse(session.user?.name as string) : null;
    const userId = user?.id;

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

    const handlePasswordUpdate = async () => {
    
        // Check if the new password and confirm password match
        if (changePassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }
    
        // Check if the new password meets the validation pattern
        if (!passwordPattern.test(changePassword)) {
            setError("Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.");
            return;
        }
    
        try {
            // Make an API call to update the password
            const response = await fetch(`http://localhost:8080/user/${userId}/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    currentPassword: currentPassword,
                    newPassword: changePassword,
                }),
            });
    
            if (response.ok) {
                // Password update successful
                setShowSuccess(true);
                setCurrentPassword("");
                setChangePassword("");
                setConfirmPassword("");
                setError("");
            } else {
                const data = await response.json();
                setError(data.message || "An error occurred while updating the password.");
            }
        } catch (err) {
            setError("The current password is incorrect.");
        }
    };

    return (
        <div className="flex flex-row w-full text-[rgb(59,59,59)]">
            <Navbar />
            <div className="flex-1 flex flex-col ml-80 items-center justify-center mt-[7rem]">
                <div className="h-[42rem] w-[33rem] mt-5 border border-[#ee552a] rounded-2xl bg-white shadow-2xl mx-auto">
                    <div className="flex flex-col text-center">
                        <div className="mb-2 mt-10 text-center break-words font-bold text-[2rem]">
                            Change your password
                        </div>
                        <div className="text-[1.1rem] text-[rgb(95,95,95)]">Please enter a password below to change your <br /> password.</div>

                        <div className="items-start justify-start ml-[-15rem]">
                            <div className="font-bold text-[1.1rem] mt-10">Current Password</div>
                            {user && (
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => {
                                        setCurrentPassword(e.target.value);
                                    }}
                                    className="px-5 py-3 w-[25rem] ml-[15rem] mt-2 rounded-md border-2 shadow-md "
                                />
                            )}
                        </div>

                        <div className="items-start justify-start">
                            <div className="font-bold text-[1.1rem] mt-8 ml-[-16rem]">New Password</div>
                            {user && (
                                <input
                                    type="password"
                                    value={changePassword}
                                    onChange={(e) => {
                                        setChangePassword(e.target.value);
                                    }}
                                    className="w-[25rem] px-5 py-3 rounded-md border-2 shadow-md "
                                />
                            )}
                        </div>

                        <div className="items-start justify-start">
                            <div className="font-bold text-[1.1rem] mt-8 ml-[-15rem]">Confirm Password</div>
                            {user && (
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                    }}
                                    className="w-[25rem] px-5 py-3 rounded-md border-2 shadow-md"
                                />
                            )}
                        </div>
                        {error && (
                                <div className="text-red-500 mt-2">{error}</div>
                            )}

                        <div className="flex flex-row gap-5 mt-10 items-center justify-center">
                        <Link href="/profile">
                                <button
                                    className="rounded-lg text-[#AB3510] border border-[#AB3510] hover:bg-[#AB3510] hover:text-white font-medium text-md py-3 w-[12rem] h-[3rem] mb-10 items-center"
                                >
                                    Back
                                </button>
                            </Link>
                            <button
                                onClick={handlePasswordUpdate}
                                className="rounded-lg text-[#ffffff] font-medium text-md py-3 w-[12rem] h-[fit-content] mb-10 items-center"
                                style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
                            >
                                Save
                            </button>
                        </div>
                        {showSuccess && (
                                <div className="text-green-500 mt-[-1rem]">
                                    Password updated successfully!
                                </div>
                            )}

                    </div>
                </div>
            </div>
        </div>
    );
}
