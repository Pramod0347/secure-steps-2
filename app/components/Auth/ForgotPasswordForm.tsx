'use client'

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ForgotPasswordForm = () => {
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const NextUrl = process.env.NEXTAUTH_URL || window.location.origin;
      const response = await fetch(`${NextUrl}/api/auth/forgot-password`, {
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
      const NextUrl = process.env.NEXTAUTH_URL || window.location.origin;
      const response = await fetch(`${NextUrl}/api/auth/reset-password`, {
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
    <div className="text-black scale-95 placeholder:text-[#737373] rounded-[34px] md:rounded-[54px] flex flex-col mt-20 justify-center jakartha md:w-1/3 bg-white/85 px-6 md:px-8 py-6 shadow-lg">
      <h1 className="md:text-[32px] text-2xl text-[#090914] font-semibold mb-2 md:mb-4">
        Forgot Password
      </h1>
      <h3 className="text-[#737373] text-xs md:text-base font-normal mb-2 md:mb-6">
        Enter your email to reset your password
      </h3>

      {step === 'EMAIL' && (
        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full h-10 md:h-12 rounded-[6px] placeholder:text-[#737373] bg-transparent border border-[#737373] outline-none my-2 px-4 text-xs md:text-base"
            required
          />
          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full h-10 md:h-12 bg-black py-2 text-white text-sm md:text-base rounded-[6px] mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
      )}

      {step === 'OTP' && (
        <form onSubmit={(e) => { e.preventDefault(); setStep('NEW_PASSWORD'); }}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full h-10 md:h-12 rounded-[6px] placeholder:text-[#737373] bg-transparent border border-[#737373] outline-none my-2 px-4 text-xs md:text-base"
            required
          />
          <button
            type="submit"
            disabled={otp.length !== 6}
            className="w-full h-10 md:h-12 bg-black py-2 text-white text-sm md:text-base rounded-[6px] mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Verify OTP
          </button>
        </form>
      )}

      {step === 'NEW_PASSWORD' && (
        <form onSubmit={handlePasswordUpdate}>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full h-10 md:h-12 rounded-[6px] placeholder:text-[#737373] bg-transparent border border-[#737373] outline-none my-2 px-4 pr-10 text-xs md:text-base"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="w-full h-10 md:h-12 rounded-[6px] placeholder:text-[#737373] bg-transparent border border-[#737373] outline-none my-2 px-4 pr-10 text-xs md:text-base"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading || !newPassword || !confirmPassword}
            className="w-full h-10 md:h-12 bg-black py-2 text-white text-sm md:text-base rounded-[6px] mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;

