'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { toast } from 'sonner';
import { motion } from "framer-motion";


interface OtpFormProps {
  userId: string;
  onVerificationComplete: (user: any) => void;
}

const OtpForm: React.FC<OtpFormProps> = ({ userId, onVerificationComplete }) => {
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          otpCode,
          purpose: 'SIGNUP_VERIFICATION'
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Registration successful.");
        onVerificationComplete(data.data.user);
      } else {
        toast.error(data.message);
        throw new Error(data.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "An error occurred during OTP verification.");
        setError(error.message || "An error occurred during OTP verification.");
      } else {
        toast.error("An error occurred during OTP verification.");
        setError("An error occurred during OTP verification.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        Verify Your Account
      </motion.h1>
      <motion.h3 
        className="text-[#737373] text-xs md:text-base font-normal mb-2 md:mb-6"
        {...fadeInUp}
        transition={{ delay: 0.1 }}
      >
        Enter the OTP sent to your email to complete registration.
      </motion.h3>
      <form onSubmit={handleSubmit}>
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
          <input
            type="text"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="Enter OTP"
            className="w-full h-10 md:h-12 rounded-[6px] placeholder:text-[#737373] bg-transparent border border-[#737373] outline-none md:my-2 px-4 text-xs md:text-base"
            required
          />
        </motion.div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        <motion.button
          type="submit"
          disabled={isLoading || otpCode.length !== 6}
          className="w-full h-10 md:h-12 bg-black py-2 text-white text-sm md:text-base rounded-[6px] mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          {...fadeInUp}
          transition={{ delay: 0.3 }}
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default OtpForm;

