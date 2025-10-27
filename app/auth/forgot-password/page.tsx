'use client'

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Banner from "@/app/assets/signupB.png";

const Page = () => {
  const router = useRouter();
  const [step, setStep] = useState<'EMAIL' | 'OTP' | 'NEW_PASSWORD'>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const iconVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    tap: { scale: 0.9 },
    hover: { scale: 1.1 }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL || window.location.origin}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setUserId(data.date.userId);
        setStep('OTP');
        toast.success('OTP sent to your email');
      } else {
        toast.error(data.message || 'User not found');
      }
    } catch (error) {
      toast.error((error as Error).message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL || window.location.origin}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          otpCode: otp,
          password: newPassword,
          purpose: 'PASSWORD_RESET'
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Password updated successfully');
        router.push('/auth/signin');
      } else {
        toast.error(data.message || 'Failed to update password');
      }
    } catch (error) {
      toast.error((error as Error).message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative h-screen w-screen bg-cover flex items-center justify-center md:px-10 bg-center text-white"
      style={{ backgroundImage: `url(${Banner.src})` }}
    >
      <motion.div 
        className="text-black scale-95 placeholder:text-[#737373] rounded-[34px] md:rounded-[54px] flex flex-col mt-20 justify-center jakartha md:w-1/3 bg-white/85 px-6 md:px-8 py-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="md:text-[32px] text-2xl text-[#090914] font-semibold mb-2 md:mb-4"
          {...fadeInUp}
        >
          Forgot Password
        </motion.h1>
        <motion.h3 
          className="text-[#737373] text-xs md:text-base font-normal mb-2 md:mb-6"
          {...fadeInUp}
          transition={{ delay: 0.2 }}
        >
          {step === 'EMAIL' ? 'Enter your email to reset your password' : 
           step === 'OTP' ? 'Enter the OTP sent to your email' : 
           'Enter your new password'}
        </motion.h3>

        {step === 'EMAIL' && (
          <form onSubmit={handleEmailSubmit}>
            <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full h-12 rounded-[6px] placeholder:text-[#737373] bg-transparent border border-[#737373] outline-none my-2 px-4 text-xs md:text-base"
                required
              />
            </motion.div>
            <motion.button
              type="submit"
              disabled={isLoading || !email}
              className="w-full h-12 bg-black py-2 text-white text-sm md:text-base rounded-[6px] mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              {...fadeInUp}
              transition={{ delay: 0.4 }}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </motion.button>
          </form>
        )}

        {step === 'OTP' && (
          <form onSubmit={(e) => { e.preventDefault(); setStep('NEW_PASSWORD'); }}>
            <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full h-12 rounded-[6px] placeholder:text-[#737373] bg-transparent border border-[#737373] outline-none my-2 px-4 text-xs md:text-base"
                required
              />
            </motion.div>
            <motion.button
              type="submit"
              disabled={otp.length !== 6}
              className="w-full h-12 bg-black py-2 text-white text-sm md:text-base rounded-[6px] mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              {...fadeInUp}
              transition={{ delay: 0.4 }}
            >
              Verify OTP
            </motion.button>
          </form>
        )}

        {step === 'NEW_PASSWORD' && (
          <form onSubmit={handlePasswordUpdate}>
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full h-12 rounded-[6px] placeholder:text-[#737373] bg-transparent border border-[#737373] outline-none my-2 px-4 pr-12 text-xs md:text-base"
                required
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[35%] transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                initial="initial"
                animate="animate"
                whileTap="tap"
                whileHover="hover"
                variants={iconVariants}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: showPassword ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </motion.div>
              </motion.button>
            </motion.div>
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="w-full h-12 rounded-[6px] placeholder:text-[#737373] bg-transparent border border-[#737373] outline-none my-2 px-4 pr-12 text-xs md:text-base"
                required
              />
              <motion.button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[35%] transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                initial="initial"
                animate="animate"
                whileTap="tap"
                whileHover="hover"
                variants={iconVariants}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: showConfirmPassword ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </motion.div>
              </motion.button>
            </motion.div>
            <motion.button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword}
              className="w-full h-12 bg-black py-2 text-white text-sm md:text-base rounded-[6px] mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              {...fadeInUp}
              transition={{ delay: 0.5 }}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Page;

