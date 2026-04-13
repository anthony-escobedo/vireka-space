import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    observable: ["Test observable"],
    interpretive: ["Test interpretation"],
    unknown: ["Test unknown"],
    structural: ["Test structural condition"],
    orientation: "Test orientation",
    question: "Test question",
  });
}
