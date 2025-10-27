/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { motion } from "framer-motion";

interface SignUpFormProps {
    onSignUpComplete: (userId: string) => void;
}

interface AvailabilityState {
    isAvailable: boolean | null;
    isChecking: boolean;
    message: string | null;
}

interface FormData {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    role: string;
    phoneNumber: string;
    countryCode: string;
}

function debounce<F extends (...args: any[]) => void>(func: F, wait: number): (...args: Parameters<F>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: Parameters<F>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSignUpComplete }) => {
    const Next_API = process.env.NEXTAUTH_URL || window.location.origin;

    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        role: '',
        phoneNumber: '',
        countryCode: '',
    });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [usernameAvailability, setUsernameAvailability] = useState<AvailabilityState>({
        isAvailable: null,
        isChecking: false,
        message: null,
    });
    const [emailAvailability, setEmailAvailability] = useState<AvailabilityState>({
        isAvailable: null,
        isChecking: false,
        message: null,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const checkAvailability = useCallback(
        debounce(async (type: 'username' | 'email', value: string) => {
            if (value.length < 3) {
                if (type === 'username') {
                    setUsernameAvailability({ isAvailable: null, isChecking: false, message: null });
                } else {
                    setEmailAvailability({ isAvailable: null, isChecking: false, message: null });
                }
                return;
            }

            if (type === 'username') {
                setUsernameAvailability(prev => ({ ...prev, isChecking: true }));
            } else {
                setEmailAvailability(prev => ({ ...prev, isChecking: true }));
            }

            try {
                const response = await fetch(
                    type === 'username'
                        ? `${Next_API}/api/auth/username?username=${encodeURIComponent(value)}`
                        : `${Next_API}/api/auth/user?email=${value}`
                );
                const data = await response.json();

                if (type === 'username') {
                    setUsernameAvailability({
                        isAvailable: data.available,
                        isChecking: false,
                        message: data.available ? 'Available' : 'Already taken'
                    });
                } else {
                    setEmailAvailability({
                        isAvailable: data.available,
                        isChecking: false,
                        message: data.available ? 'Available' : 'Already taken'
                    });
                }
            } catch (error) {
                console.error(`Error checking ${type} availability:`, error);
                toast.error(`An error occurred while checking ${type} availability. Please try again later.`);
                if (type === 'username') {
                    setUsernameAvailability({ isAvailable: null, isChecking: false, message: null });
                } else {
                    setEmailAvailability({ isAvailable: null, isChecking: false, message: null });
                }
            }
        }, 300),
        [Next_API]
    );

    useEffect(() => {
        if (formData.username) {
            checkAvailability('username', formData.username);
        }
    }, [formData.username, checkAvailability]);

    useEffect(() => {
        if (formData.email) {
            checkAvailability('email', formData.email);
        }
    }, [formData.email, checkAvailability]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }
    };

    const checkPasswordStrength = (password: string): string => {
        const strengthChecks = {
            length: 0,
            hasUpperCase: false,
            hasLowerCase: false,
            hasDigit: false,
            hasSpecialChar: false,
        };

        strengthChecks.length = password.length >= 8 ? 1 : 0;
        strengthChecks.hasUpperCase = /[A-Z]+/.test(password);
        strengthChecks.hasLowerCase = /[a-z]+/.test(password);
        strengthChecks.hasDigit = /[0-9]+/.test(password);
        strengthChecks.hasSpecialChar = /[^A-Za-z0-9]+/.test(password);

        const strength = Object.values(strengthChecks).filter(Boolean).length;

        if (strength < 2) return 'Weak';
        if (strength < 4) return 'Medium';
        return 'Strong';
    };

    const handlePhoneChange = (value: string, country: { dialCode: string }): void => {
        const countryCode = `+${country.dialCode}`;
        const phoneNumberWithoutCode = value.slice(country.dialCode.length);

        setFormData(prev => ({
            ...prev,
            phoneNumber: phoneNumberWithoutCode,
            countryCode: countryCode
        }));
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!agreedToTerms) {
            setError("Please agree to the terms and conditions.");
            return;
        }
        if (!usernameAvailability.isAvailable) {
            setError("Please choose an available username.");
            return;
        }
        if (!emailAvailability.isAvailable) {
            setError("This email is already in use. Please choose a different email.");
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${Next_API}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    username: formData.username,
                    password: formData.password,
                    name: `${formData.firstName} ${formData.lastName}`,
                    role: formData.role,
                    phoneNumber: formData.phoneNumber,
                    countryCode: formData.countryCode,
                }),
            });
            const data = await response.json();
            if (data.success) {
                toast.success("OTP sent to your email.");
                onSignUpComplete(data.data.userId);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            const error = err as Error;
            toast.error(error.message || "An error occurred during registration.");
            setError(error.message || "An error occurred during registration.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderAvailabilityFeedback = (state: AvailabilityState): React.ReactNode => {
        if (state.isChecking) {
            return <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">Checking...</span>;
        }
        if (state.message) {
            return (
                <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs ${state.isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                    {state.message}
                </span>
            );
        }
        return null;
    };

    return (
        <motion.div 
            className="text-black scale-95 placeholder:text-[#737373] rounded-[34px] md:rounded-[54px] flex flex-col mt-20 pb-10 justify-center jakartha md:w-1/3 bg-white/85 px-6 md:px-8 py-6 shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h1 
                className="md:text-[32px] text-2xl text-[#090914] font-semibold mb-2 md:mb-4"
                {...fadeInUp}
            >
                Create Free Account
            </motion.h1>
            <motion.h3 
                className="text-[#737373] text-xs md:text-base font-normal mb-2 md:mb-6"
                {...fadeInUp}
                transition={{ delay: 0.1 }}
            >
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the
            </motion.h3>
            <form onSubmit={handleSubmit}>
                <motion.div className="text-xs md:mt-0 mt-2 md:text-base gap-2 md:gap-4 flex" {...fadeInUp} transition={{ delay: 0.2 }}>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        onChange={handleChange}
                        className="w-full h-10 md:h-12 rounded-[6px] placeholder:text-[#737373] bg-transparent border border-[#737373] outline-none md:my-2 px-4"
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        onChange={handleChange}
                        className="w-full h-10 md:h-12 rounded-[6px] placeholder:text-[#737373] bg-transparent border border-[#737373] outline-none md:my-2 px-4"
                        required
                    />
                </motion.div>

                <motion.div className="relative" {...fadeInUp} transition={{ delay: 0.3 }}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        className={`w-full h-10 md:h-12 rounded-[6px] placeholder:text-[#737373] bg-transparent border ${usernameAvailability.isAvailable === true ? 'border-green-500' :
                            usernameAvailability.isAvailable === false ? 'border-red-500' :
                                'border-[#737373]'
                            } outline-none my-2 px-4 text-xs md:text-base`}
                        required
                    />
                    {renderAvailabilityFeedback(usernameAvailability)}
                </motion.div>

                <motion.div className="relative" {...fadeInUp} transition={{ delay: 0.4 }}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        className={`w-full h-10 md:h-12 rounded-[6px] placeholder:text-[#737373] bg-transparent border ${emailAvailability.isAvailable === true ? 'border-green-500' :
                            emailAvailability.isAvailable === false ? 'border-red-500' :
                                'border-[#737373]'
                            } outline-none my-2 px-4 text-xs md:text-base`}
                        required
                    />
                    {renderAvailabilityFeedback(emailAvailability)}
                </motion.div>

                <motion.div {...fadeInUp} transition={{ delay: 0.5 }}>
                    <select
                        name="role"
                        onChange={handleChange}
                        className="w-full text-[#737373] text-xs md:text-base h-10 md:h-12 rounded-[6px] placeholder:text-[#737373] bg-transparent border border-[#737373] outline-none my-2 px-4"
                        required
                    >
                        <option value="" disabled selected>User Type</option>
                        <option value="STUDENT">Student</option>
                        <option value="LANDLORD">Landlord</option>
                    </select>
                </motion.div>

                <motion.div className="relative" {...fadeInUp} transition={{ delay: 0.6 }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full h-10 md:h-12 rounded-[6px] text-xs md:text-base placeholder:text-[#737373] bg-transparent border border-[#737373] outline-none my-2 px-4 pr-10"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </motion.div>
                {passwordStrength && (
                    <p className={`text-xs mt-1 ${passwordStrength === 'Weak' ? 'text-red-500' :
                        passwordStrength === 'Medium' ? 'text-yellow-500' :
                            'text-green-500'
                        }`}>
                        Password strength: {passwordStrength}
                    </p>
                )}

                <motion.div className="my-2" {...fadeInUp} transition={{ delay: 0.7 }}>
                    <style jsx global>{`
                        .phone-input-container {
                            width: 100% !important;
                        }
                        .phone-input-container .form-control {
                            width: 100% !important;
                            height: 40px !important;
                            @media (min-width: 768px) {
                                height: 48px !important;
                            }
                            font-size: 12px !important;
                            @media (min-width: 768px) {
                                font-size: 16px !important;
                            }
                            background-color: transparent !important;
                            border: 1px solid #737373 !important;
                            border-radius: 6px !important;
                        }
                        .phone-input-container .flag-dropdown {
                            background-color: transparent !important;
                            border: 1px solid #737373 !important;
                            border-right: none !important;
                            border-radius: 6px 0 0 6px !important;
                        }
                        .phone-input-container .selected-flag {
                            padding: 0 8px !important;
                            background-color: transparent !important;
                        }
                        .phone-input-container .selected-flag:hover,
                        .phone-input-container .selected-flag:focus {
                            background-color: transparent !important;
                        }
                    `}</style>
                    <PhoneInput
                        country={'us'}
                        value={formData.countryCode + formData.phoneNumber}
                        onChange={handlePhoneChange}
                        containerClass="phone-input-container"
                        inputProps={{
                            name: 'phone',
                            required: true,
                            placeholder: 'Phone Number'
                        }}
                    />
                </motion.div>

                <motion.div className="flex items-center my-4" {...fadeInUp} transition={{ delay: 0.8 }}>
                    <input
                        type="checkbox"
                        id="terms"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mr-2 text-[#737373] w-5 h-5"
                    />
                    <label htmlFor="terms" className="text-[#737373] text-xs md:text-sm">
                        I agree to the{" "}
                        <a href="#" className="text-blue-500">
                            terms and conditions
                        </a>
                    </label>
                </motion.div>
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                <motion.button
                    type="submit"
                    disabled={isLoading || !usernameAvailability.isAvailable || !emailAvailability.isAvailable || !agreedToTerms}
                    className="w-full h-10 md:h-12 bg-black py-2 text-white text-sm md:text-base rounded-[6px] mb-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    {...fadeInUp}
                    transition={{ delay: 0.9 }}
                >
                    {isLoading ? 'Signing up...' : 'Sign up'}
                </motion.button>
                <motion.button
                    type="button"
                    className="w-full h-10 md:h-12 bg-transparent text-black text-sm md:text-base border-[#737373] border rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    {...fadeInUp}
                    transition={{ delay: 1 }}
                >
                    Continue with Google
                </motion.button>
            </form>
            <motion.h2 
                className="mt-4 text-center text-xs md:text-base"
                {...fadeInUp}
                transition={{ delay: 1.1 }}
            >
                Already have an account?{" "}
                <Link href={"/auth/signin"}  className="text-blue-500 md:text-base text-sm cursor-pointer">
                    Sign In
                </Link>
            </motion.h2>
        </motion.div>
    );
};

export default SignUpForm;

