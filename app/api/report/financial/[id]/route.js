import { NextResponse } from "next/server";
import FinancialReport from "/models/report/financial.js";

export async function PUT(req, { params }) {
  try {
    const id = params.id;
    const { title, description, objectives, department_id } = await req.json();

    const success = await FinancialReport.putFinancialReport(
      id,
      title,
      description,
      objectives,
      department_id
    );

    if (success) {
      return NextResponse.json(
        { message: "Financial report updated." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "An error occurred while updating the financial report." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the financial entity." },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = params.id;

    const success = await FinancialReport.deleteFinancialReport(id);

    if (success) {
      return NextResponse.json(
        { message: "Financial report deleted." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "An error occurred while deleting the financial report." },
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
    const financialReports =
      await FinancialReport.getAllFinancialReportsByDepartment(department_id);
    return NextResponse.json(financialReports, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the financial reports." },
      { status: 500 }
    );
  }
}
