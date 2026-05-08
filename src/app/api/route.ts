import { NextResponse } from "next/server";

//For route handler
export async function GET() {
  return new NextResponse("Hello, this is example!");
}
