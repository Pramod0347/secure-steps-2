import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    console.log("🔍 Testing database connection...");

    // Test 1: Basic connection
    await prisma.$connect();
    console.log("✅ Database connection successful");

    // Test 2: Simple query
    const result = await prisma.$queryRaw`SELECT 1 as test, NOW() as current_time`;
    console.log("✅ Query execution successful");

    // Test 3: Check database info
    const dbInfo = await prisma.$queryRaw`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        version() as postgres_version
    `;

    // Test 4: Check if main tables exist
    const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    // Test 5: Try to count users (if table exists)
    let userCount = 0;
    try {
      userCount = await prisma.user.count();
    } catch (error) {
      console.log("⚠️ User table doesn't exist yet (migrations not run)");
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful!",
      data: {
        connection: "✅ Connected",
        queryTest: "✅ Working",
        databaseInfo: (dbInfo as any)[0],
        tablesFound: tables?.length,
        tables: tables.map((t) => t.table_name),
        userCount: userCount,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error("❌ Database connection failed:", error);

    return NextResponse.json({
      success: false,
      message: "Database connection failed",
      error: {
        type: error.constructor.name,
        message: error.message,
        code: error.code || 'UNKNOWN',
        timestamp: new Date().toISOString()
      },
      solutions: [
        "Check if your database server is running",
        "Verify DATABASE_URL format: postgresql://user:password@host:port/database",
        "Ensure database exists",
        "Check firewall/network connectivity",
        "Verify username/password are correct"
      ]
    }, { status: 500 });
  }
}
