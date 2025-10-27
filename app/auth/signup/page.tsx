'use client'

import React, { useState } from "react";
import Banner from "@/app/assets/signupB.png";
import SignUpForm from "../../components/Auth/SignUpForm";
import OtpForm from "../../components/Auth/OtpForm";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import { User } from "@prisma/client";

const Page = () => {
  const [signUpStep, setSignUpStep] = useState<'SIGN_UP' | 'OTP'>('SIGN_UP');
  const [userId, setUserId] = useState<string | null>(null);
  const {login} = useAuth();

  const handleSignUpComplete = (newUserId: string) => {
    setUserId(newUserId);
    setSignUpStep('OTP');
  };

  const handleVerificationComplete = (user: User) => {
    login(user);
    window.location.href = '/';
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <motion.div
        className="relative w-screen  py-20 bg-cover flex items-center justify-center md:px-10 bg-center text-white"
        style={{ backgroundImage: `url(${Banner.src})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {signUpStep === 'SIGN_UP' ? (
          <SignUpForm onSignUpComplete={handleSignUpComplete} />
        ) : (
          <OtpForm userId={userId!} onVerificationComplete={handleVerificationComplete} />
        )}
      </motion.div>
    </div>
  );
};

export default Page;
