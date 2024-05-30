import { NextResponse } from "next/server";
import LearningGrowthReport from "/models/report/learningGrowth.js";

export async function PUT(req, { params }) {
  try {
    const id = params.id;
    const { title, description, objectives, department_id } = await req.json();

    const success = await LearningGrowthReport.putLearningReport(
      id,
      title,
      description,
      objectives,
      department_id
    );

    if (success) {
      return NextResponse.json(
        { message: "LG report updated." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "An error occurred while updating the LG report." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the LG entity." },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = params.id;

    const success = await LearningGrowthReport.deleteLGReport(id);

    if (success) {
      return NextResponse.json(
        { message: "LG report deleted." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "An error occurred while deleting the LG report." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the LG entity." },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    const department_id = params.id;

    const LearningReports = await LearningGrowthReport.getAllLGReportsbyDeptID(
      department_id
    );

    return NextResponse.json(LearningReports, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the LG reports." },
      { status: 500 }
    );
  }
}
