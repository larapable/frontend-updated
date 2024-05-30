import { NextResponse } from "next/server";
import StakeholderReport from "/models/report/stakeholder.js";

export async function PUT(req, { params }) {
  try {
    const id = params.id;
    const { title, description, objectives, department_id } = await req.json();
    //const date = new Date(dateCreated);
    //const formattedDate = date.toISOString().slice(0, 19).replace("T", " "); // Convert to MySQL DATETIME format
    //console.log("formatted date: ", formattedDate);

    const success = await StakeholderReport.putStakeholderReport(
      id,
      title,
      objectives,
      description,
      department_id
    );

    if (success) {
      return NextResponse.json(
        { message: "Stakeholder report updated." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "An error occurred while updating the Stakeholder report." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the Stakeholder entity." },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = params.id;

    const success = await StakeholderReport.deleteStakeholderReport(id);

    if (success) {
      return NextResponse.json(
        { message: "Stakeholder report deleted." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "An error occurred while deleting the Stakeholder report." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the IP entity." },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    const department_id = params.id;

    const stakeholderReports =
      await StakeholderReport.getStakeholderReportsByDeptID(department_id);
    console.log(stakeholderReports);
    if (stakeholderReports) {
      return NextResponse.json(stakeholderReports, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Stakeholder report not found." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "An error occurred while retrieving the stakeholder report." },
      { status: 500 }
    );
  }
}
