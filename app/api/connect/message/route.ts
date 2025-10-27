// // app/api/connects/messages/route.ts
// import { NextResponse } from "next/server";
// import { auth } from "@/app/lib/auth";
// import prisma from "@/app/lib/prisma";

// export async function GET(req: Request) {
//   try {
//     const session = await auth();
//     if (!session) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
//     const page = parseInt(searchParams.get("page") || "1");
//     const limit = parseInt(searchParams.get("limit") || "20");
//     const skip = (page - 1) * limit;

//     const messages = await prisma.message.findMany({
//       where: {
//         OR: [
//           {
//             senderId: session.user.id,
//             receiverId: userId,
//           },
//           {
//             senderId: userId,
//             receiverId: session.user.id,
//           },
//         ],
//       },
//       include: {
//         sender: {
//           select: {
//             name: true,
//             avatar: true,
//           },
//         },
//         receiver: {
//           select: {
//             name: true,
//             avatar: true,
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//       skip,
//       take: limit,
//     });

//     // Mark messages as read
//     await prisma.message.updateMany({
//       where: {
//         receiverId: session.user.id,
//         senderId: userId,
//         isRead: false,
//       },
//       data: { isRead: true },
//     });

//     return NextResponse.json(messages);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Failed to fetch messages" },
//       { status: 500 }
//     );
//   }
// }