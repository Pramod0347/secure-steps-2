'use client'
import React from 'react';
import { useAuth } from './AuthContext';
import FullScreenLoader from '../components/ui/FullScreenLoader';
import {Alert, AlertDescription } from '../components/ui/alert';

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { loading, error, clearError } = useAuth();

  // if (loading) {
  //   return <FullScreenLoader />;
  // }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Alert 
          variant="destructive" 
          className="max-w-md cursor-pointer" 
          onClick={clearError}
        >
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return children;
};

export default AuthWrapper;