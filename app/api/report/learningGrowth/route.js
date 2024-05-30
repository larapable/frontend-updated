import { NextResponse } from "next/server";
import LearningGrowthReport from "/models/report/learningGrowth.js";

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

    const success = await LearningGrowthReport.postLGReport(
      title,
      formattedDate,
      description,
      objectives,
      department_id
    );

    console.log("success: ", success);
    
    if (success) {
      return NextResponse.json(
        { message: "LG report registered." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "An error occurred while registering the LG report." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "An error occurred while registering the LG entity." },
      { status: 500 }
    );
  }
}
