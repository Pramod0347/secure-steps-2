"use client";

import Banner from "@/app/assets/SignIn_Img.png";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { login } = useAuth();

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateX: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, x: -20 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "backOut"
      }
    },
    focused: {
      scale: 1.02,
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
      borderColor: "#3b82f6",
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    unfocused: {
      scale: 1,
      boxShadow: "0 0 0 0px rgba(59, 130, 246, 0)",
      borderColor: "#737373",
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants = {
    idle: { scale: 1, backgroundColor: "#000000" },
    hover: {
      scale: 1.05,
      backgroundColor: "#1f1f1f",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
        ease: "easeInOut"
      }
    },
    loading: {
      scale: 1,
      backgroundColor: "#4b5563",
      transition: {
        duration: 0.3
      }
    }
  };

  const iconVariants = {
    hidden: { opacity: 0, rotate: -180, scale: 0 },
    visible: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "backOut"
      }
    },
    hover: {
      scale: 1.2,
      rotate: 10,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.9,
      rotate: -5,
      transition: {
        duration: 0.1
      }
    }
  };

  const eyeIconVariants = {
    hidden: { opacity: 0, rotateY: 90 },
    visible: {
      opacity: 1,
      rotateY: 0,
      transition: {
        duration: 0.4,
        ease: "backOut"
      }
    },
    toggle: {
      rotateY: showPassword ? 180 : 0,
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const checkboxVariants = {
    unchecked: { scale: 1, rotate: 0 },
    checked: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, 0],
      transition: {
        duration: 0.3,
        ease: "backOut"
      }
    }
  };

  const linkVariants = {
    idle: { color: "#3b82f6", scale: 1 },
    hover: {
      color: "#1d4ed8",
      scale: 1.05,
      textShadow: "0 0 8px rgba(59, 130, 246, 0.6)",
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok) {
        await login(data.data.user);
        toast.success("Login successful!");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative h-screen w-screen bg-cover flex items-center justify-center px-7 md:px-10 bg-center text-white overflow-hidden"
      style={{ backgroundImage: `url(${Banner.src})` }}
    >
      {/* Animated background overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      <motion.div
        className="text-black scale-95 placeholder:text-[#737373] rounded-[34px] md:rounded-[54px] flex flex-col mt-20 justify-center jakartha md:w-1/3 bg-white/90 backdrop-blur-sm px-6 md:px-8 py-6 shadow-2xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header animations */}
        <motion.div
          className="flex items-center justify-center mb-4"
          variants={itemVariants}
        >
          {/* <motion.div
            variants={iconVariants}
            className="mr-3"
          >
            <User className="w-8 h-8 text-blue-500" />
          </motion.div> */}
          <motion.h1
            className="2xl:text-[32px] text-2xl text-[#090914] font-semibold"
            variants={itemVariants}
          >
            Sign in to your account
          </motion.h1>
        </motion.div>

        {/* <motion.h3
          className="text-[#737373] text-xs md:text-[12px] 2xl:text-base font-normal mb-6 text-center"
          variants={itemVariants}
        >
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the
        </motion.h3> */}

        <form onSubmit={handleSubmit}>
          {/* Email field with icon */}
          <motion.div
            variants={itemVariants}
            className="relative mb-4 flex"
          >
            <motion.div
              className="absolute left-3 top-[30%] transform -translate-y-1/2 z-10"
              variants={iconVariants}
            >
              <Mail className="w-5 h-5 text-gray-500" />
            </motion.div>
            <motion.input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className="w-full md:h-12 2xl:h-14 h-10 pl-10 pr-4 placeholder:text-[#737373] border border-[#737373] bg-transparent rounded-[10px] outline-none transition-all duration-200"
              variants={fieldVariants}
              animate={focusedField === 'email' ? 'focused' : 'unfocused'}
              required
            />
          </motion.div>

          {/* Password field with icon */}
          <motion.div
            variants={itemVariants}
            className="relative mb-4"
          >
            <motion.div
              className="absolute left-3 top-[30%]  transform -translate-y-1/2 z-10"
              variants={iconVariants}
            >
              <Lock className="w-5 h-5 text-gray-500" />
            </motion.div>
            <motion.input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              className="w-full md:h-12 2xl:h-14 h-10 pl-10 pr-12 rounded-[10px] placeholder:text-[#737373] bg-transparent border border-[#737373] outline-none transition-all duration-200"
              variants={fieldVariants}
              animate={focusedField === 'password' ? 'focused' : 'unfocused'}
              required
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[30%]  transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none z-10"
              variants={eyeIconVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={showPassword ? 'visible' : 'hidden'}
                  variants={eyeIconVariants}
                  animate="toggle"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* Remember me and forgot password */}
          <motion.div
            className="flex justify-between items-center my-6"
            variants={itemVariants}
          >
            <motion.div className="flex items-center">
              <motion.input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-3 text-[#737373] 2xl:w-5 2xl:h-5 md:w-4 md:h-4 w-3 h-3 cursor-pointer"
                variants={checkboxVariants}
                animate={rememberMe ? 'checked' : 'unchecked'}
              />
              <motion.label 
                htmlFor="remember" 
                className="text-[#737373] text-[12px] 2xl:text-sm cursor-pointer select-none"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Remember me
              </motion.label>
            </motion.div>
            <motion.div>
              <Link href="/auth/forgot-password">
                <motion.span
                  className="text-blue-500 text-[12px] 2xl:text-sm cursor-pointer"
                  variants={linkVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                >
                  Forgot Password?
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Submit button */}
          <motion.button
            type="submit"
            className="w-full md:h-12 2xl:h-14 h-10 bg-black py-2 text-white rounded-[10px] mb-4 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center font-medium relative overflow-hidden"
            variants={buttonVariants}
            initial="idle"
            animate={isLoading ? "loading" : "idle"}
            whileHover={!isLoading ? "hover" : "loading"}
            whileTap={!isLoading ? "tap" : "loading"}
            disabled={!email || !password || isLoading}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center"
                >
                  Sign In
                  <motion.div
                    className="ml-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight size={16} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </form>

        {/* Sign up link */}
        <motion.div
          className="text-center text-xs md:text-[12px] 2xl:text-base"
          variants={itemVariants}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Don&apos;t have an account?{" "}
          </motion.span>
          <Link href="/quizform">
            <motion.span
              className="text-blue-500 cursor-pointer font-medium"
              variants={linkVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              SignUp
            </motion.span>
          </Link>
        </motion.div>

        {/* Decorative elements */}
        {/* <motion.div
          className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        /> */}
        {/* <motion.div
          className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-20 blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          }}
        /> */}
      </motion.div>
    </div>
  );
};

export default Page;