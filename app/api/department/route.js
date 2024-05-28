import { NextResponse } from "next/server";
import Department from "@/models/department.js";

export async function POST(req) {
  try {
    const { departmentName, headOfficer, departmentLandline, location, university, description, email } = await req.json();

    const isSuccess = await Department.department_register(
      departmentName,
      headOfficer,
      departmentLandline,
      location,
      university,
      description,
      email
    );

    if (isSuccess) {
      return NextResponse.json({ message: "Department registered successfully." }, { status: 201 });
    } else {
      return NextResponse.json({ message: "Failed to register department." }, { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        message: "An error occurred while registering the department.",
      },
      { status: 500 }
    );
  }
}
