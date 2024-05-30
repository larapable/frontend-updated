import { NextResponse } from "next/server";
import InternalProcessReport from "/models/report/internalProcess.js";

export async function POST(req) {
  try {
    const { title, dateCreated, description, objectives, department_id } =
      await req.json();
    console.log(dateCreated);
    const date = new Date(dateCreated);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid dateCreated value");
    }
    const formattedDate = date.toISOString().slice(0, 19).replace("T", " "); // Convert to MySQL DATETIME format
    console.log("formatted date: ", formattedDate);
    
    const success = await InternalProcessReport.postIPReport(
      title,
      formattedDate,
      description,
      objectives,
      department_id
    );

    if (success) {
      return NextResponse.json(
        { message: "IP report registered." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "An error occurred while registering the IP report." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "An error occurred while registering the IP entity." },
      { status: 500 }
    );
  }
}
