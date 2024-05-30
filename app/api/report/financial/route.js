import { NextResponse } from "next/server";
import FinancialReport from "/models/report/financial.js";

export async function POST(req) {
  try {
    const { title, dateCreated, description, objectives, department_id } =
      await req.json();

    const date = new Date(dateCreated);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid dateCreated value");
    }
    const formattedDate = date.toISOString().slice(0, 19).replace("T", " "); // Convert to MySQL DATETIME format
    console.log("formatted date: ", formattedDate);

    const success = await FinancialReport.postFinancialReport(
      title,
      formattedDate,
      description,
      objectives,
      department_id
    );

    if (success) {
      return NextResponse.json(
        { message: "Financial report registered." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "An error occurred while registering the financial report.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "An error occurred while registering the financial entity." },
      { status: 500 }
    );
  }
}
