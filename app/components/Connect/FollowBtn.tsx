/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/FollowButton.tsx
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface FollowButtonProps {
  currentUserId: string;
  targetUserId: string;
  initialIsFollowing: boolean;
}

export default function FollowButton({
  currentUserId,
  targetUserId,
  initialIsFollowing,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socketInit = async () => {
      await fetch('/api/socketio');
      const socket = io({
        path: '/api/socketio',
      });

      socket.emit('join-user-channel', targetUserId);

      socket.on('follow-update', (data: any) => {
        if (data.followerId === currentUserId) {
          setIsFollowing(data.type === 'FOLLOW');
          setIsLoading(false);
        }
      });

      setSocket(socket);
    };

    socketInit();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [targetUserId, currentUserId]);

  const handleFollowAction = async () => {
    setIsLoading(true);
    setIsFollowing(!isFollowing);
    
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followerId: currentUserId,
          followingId: targetUserId,
          action: isFollowing ? 'UNFOLLOW' : 'FOLLOW',
        }),
      });

      if (!response.ok) {
        setIsFollowing(isFollowing);
        throw new Error('Failed to update follow status');
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
      setIsFollowing(isFollowing);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollowAction}
      disabled={isLoading}
      className={`w-24 ${isFollowing ? "outline" : "default"}`}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}