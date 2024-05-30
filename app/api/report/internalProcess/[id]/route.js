import { NextResponse } from "next/server";
import InternalProcessReport from "/models/report/InternalProcess.js";

export async function PUT(req, { params }) {
  try {
    const id = params.id;
    const { title, description, objectives, department_id } = await req.json();

    //removed date from const and success
    // const date = new Date(dateCreated);
    // const formattedDate = date.toISOString().slice(0, 19).replace("T", " "); // Convert to MySQL DATETIME format

    const success = await InternalProcessReport.putIPReport(
      id,
      title,
      description,
      objectives,
      department_id
    );

    if (success) {
      return NextResponse.json(
        { message: "IP report updated." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "An error occurred while updating the IP report." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the IP entity." },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = params.id;

    const success = await InternalProcessReport.deleteIPReport(id);

    if (success) {
      return NextResponse.json(
        { message: "IP report deleted." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "An error occurred while deleting the IP report." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the financial entity." },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    const department_id = params.id;
    console.log("department_id:", department_id);
    const internalReports = await InternalProcessReport.getAllIPReportsByDeptId(
      department_id
    );
    return NextResponse.json(internalReports, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the financial reports." },
      { status: 500 }
    );
  }
}
