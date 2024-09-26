"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import QANavbar from "../../components/QANavbar";
import SpinnerPages from "../../components/SpinnerPages";
import { getSession, useSession } from "next-auth/react";

interface Department {
    id: number;
    department_name: string;
    head_officer: string;
}

export default function DepartmentProfile() {
    // const { department_id } = useParams();
    const [department, setDepartment] = useState<Department | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { data: session, status, update } = useSession();
    console.log("useSession Hook session object", session);

    let user;
    if (session?.user?.name) user = JSON.parse(session?.user?.name as string);
    const department_id = user?.department_id;
    const user_id = user?.id;
    console.log("User ID: ", user_id);
    console.log("Department: ", department_id);
    console.log("User Parsed: ", user);
    const username = user?.username;

    

    // const params = useParams();
    // const department_id = params?.department_id;


    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const response = await fetch(`http://localhost:8080/department/getDepartment/${department_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Response data:", data);
                setDepartment(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching department:", error);
                setIsLoading(false);
            }
        };

        fetchDepartment();
    }, [department_id]);

    

    if (isLoading) {
        return <SpinnerPages />;
    }

    if (!department) {
        return <div>Department not found</div>;
    }

    return (
        <div className="flex flex-row w-full h-screen">
            <div className="flex">
                <QANavbar />
            </div>
            <div className="flex-1">
                <div className="flex-1 flex flex-col mt-3 ml-80">
                    <h1 className="text-3xl font-bold mb-4">{department.department_name} Profile</h1>
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <p className="text-xl mb-2"><strong>Department Name:</strong> {department.department_name}</p>
                        <p className="text-xl mb-2"><strong>Head Officer:</strong> {department.head_officer}</p>
                        {/* Add more department details here */}
                    </div>
                </div>
            </div>
        </div>
    );
}