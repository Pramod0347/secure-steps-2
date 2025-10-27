/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/follow/route.ts
import { NextResponse } from 'next/server';
import { Prisma, PrismaClient } from '@prisma/client';
import { Server as SocketIOServer } from 'socket.io';
import type { Server as NetServer } from 'http';

const prisma = new PrismaClient();

const getSocketInstance = () => {
  const globalWithSocket = global as typeof globalThis & {
    socketServer?: NetServer & {
      io?: SocketIOServer;
    };
  };
  
  return globalWithSocket.socketServer?.io;
};

export async function POST(req: Request) {
  try {
    const { followerId, followingId, action } = await req.json();
    
    if (!followerId || !followingId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const io = getSocketInstance();
    if (io) {
      io.to(`user-${followingId}`).emit('follow-update', {
        type: action,
        followerId,
        followingId,
      });
    }

    if (action === 'FOLLOW') {
      const existingFollow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });

      if (existingFollow) {
        return NextResponse.json(
          { error: 'Already following this user' },
          { status: 400 }
        );
      }

      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.follow.create({
          data: {
            followerId,
            followingId,
          },
        });

        await tx.user.update({
          where: { id: followerId },
          data: { followingCount: { increment: 1 } },
        });

        await tx.user.update({
          where: { id: followingId },
          data: { followersCount: { increment: 1 } },
        });
      });
    } else if (action === 'UNFOLLOW') {
      await prisma.$transaction(async (tx:any) => {
        try {
          await tx.follow.delete({
            where: {
              followerId_followingId: {
                followerId,
                followingId,
              },
            },
          });

          await tx.user.update({
            where: { id: followerId },
            data: { followingCount: { decrement: 1 } },
          });

          await tx.user.update({
            where: { id: followingId },
            data: { followersCount: { decrement: 1 } },
          });
        } catch (error) {
          console.error("Error :",error);
          return NextResponse.json(
            { error: 'Follow relationship not found' },
            { status: 404 }
          );
        }
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Follow action failed:', error);
    return NextResponse.json(
      { error: 'Failed to process follow action' },
      { status: 500 }
    );
  }
}