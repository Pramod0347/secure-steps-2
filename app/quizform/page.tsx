"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Background } from "@/app/components/PopupQuiz/Background"
import { PlaneAnimation } from "@/app/components/PopupQuiz/PlaneAnimation"
import { Clouds } from "@/app/components/PopupQuiz/Clouds"
import { toast } from "sonner"
import { useAuth } from "../context/AuthContext"
import { Eye, EyeOff } from "lucide-react"
import type React from "react" // Added import for React
import AuthQuestion from "../components/Auth/QuizForm/QuizData"

type QuizState = {
  stage: number
  answer: string
  email: string
  phoneNumber: string
  isTransitioning: boolean
  answers: { [key: number]: string | { email: string; phoneNumber: string } }
  completedStages: { [key: number]: boolean }
  userId?: string
  password: string
}

const initialState: QuizState = {
  stage: 0,
  answer: "",
  email: "",
  phoneNumber: "",
  password: "",
  isTransitioning: false,
  answers: {},
  completedStages: {},
}

export default function QuizPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [state, setState] = useState<QuizState>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedState = localStorage.getItem("quizState")
        return savedState ? JSON.parse(savedState) : initialState
      } catch (error) {
        console.error("Failed to parse saved state:", error)
      }
    }
    return initialState
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isBlurred, setIsBlurred] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [selectionDelay, setSelectionDelay] = useState(false)

  useEffect(() => {
    if (state.stage < 0 || state.stage >= AuthQuestion.length) {
      setState((prev) => ({
        ...prev,
        stage: Math.max(0, Math.min(prev.stage, AuthQuestion.length - 1)),
      }))
    }
  }, [state.stage])

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("quizState", JSON.stringify(state))
      } catch (error) {
        console.error("Failed to save state to localStorage:", error)
      }
    }
  }, [state])

  const clearQuizData = () => {
    setState(initialState)
    localStorage.removeItem("quizState")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const currentQuestion = AuthQuestion[state.stage]
    if (!currentQuestion) {
      console.error("Invalid stage")
      return
    }

    if (state.isTransitioning) return
    if (currentQuestion.type === "email-phone" && (!state.email || !state.phoneNumber)) return
    if (currentQuestion.type !== "email-phone" && !state.answer) return

    setState((prev) => ({
      ...prev,
      isTransitioning: true,
      answers: {
        ...prev.answers,
        [currentQuestion.id]:
          currentQuestion.type === "email-phone" ? { email: prev.email, phoneNumber: prev.phoneNumber } : prev.answer,
      },
      completedStages: { ...prev.completedStages, [state.stage]: true },
    }))

    try {
      if (state.stage === AuthQuestion.length - 2) {
        const response = await fetch("/api/auth/quiz-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...state.answers,
            [currentQuestion.id]: {
              email: state.email,
              phoneNumber: state.phoneNumber,
              password: state.password,
            },
          }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          toast.success("Registration data received. Please check your email for the OTP.")
          setState((prev) => ({
            ...prev,
            stage: prev.stage + 1,
            answer: "",
            isTransitioning: false,
            userId: data.tempRegistrationToken ? `temp_${data.tempRegistrationToken}` : data.userId,
          }))
        } else {
          toast.error(data.message || "Registration failed")
          throw new Error(data.message || "Registration failed")
        }
      } else if (state.stage === AuthQuestion.length - 1) {
        const response = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: state.userId,
            otpCode: state.answer,
            purpose: "SIGNUP_VERIFICATION",
          }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          login(data.data.user)
          toast.success("OTP verified successfully. Redirecting to home...")
          clearQuizData()
          router.push("/")
        } else {
          throw new Error(data.message || "OTP verification failed")
        }
      } else {
        setState((prev) => ({
          ...prev,
          stage: prev.stage + 1,
          answer: "",
          isTransitioning: false,
        }))
      }
    } catch (error) {
      console.error("Operation failed", error)
      toast.error(error instanceof Error ? error.message : "Operation failed. Please try again.")
    } finally {
      setIsBlurred(false)
      setIsTransitioning(false)
      setState((prev) => ({ ...prev, isTransitioning: false }))
      setSelectionDelay(false)
      toast.dismiss()
    }
  }

  const handlePrevious = () => {
    if (state.stage > 0) {
      setState((prev) => {
        const prevQuestion = AuthQuestion[prev.stage - 1]
        const prevAnswer = prev.answers[prevQuestion.id]

        if (prevQuestion.type === "email-phone" && typeof prevAnswer === "object") {
          return {
            ...prev,
            stage: prev.stage - 1,
            email: prevAnswer.email || "",
            phoneNumber: prevAnswer.phoneNumber || "",
            answer: "",
            isTransitioning: false,
          }
        } else {
          return {
            ...prev,
            stage: prev.stage - 1,
            answer: typeof prevAnswer === "string" ? prevAnswer : "",
            email: "",
            phoneNumber: "",
            isTransitioning: false,
          }
        }
      })
    }
  }

  const handleOptionSelect = (option: string) => {
    if (selectionDelay || isTransitioning) return;
    
    // First, set the answer to show the selected option with red border
    setState((prev) => ({ ...prev, answer: option }))
    
    // Then set the selection delay flag to prevent immediate transition
    setSelectionDelay(true)
    
    // After a delay (1.5 seconds), proceed to the next question
    setTimeout(() => {
      // Update the current question's answer in the answers object
      const currentQuestion = AuthQuestion[state.stage];
      if (currentQuestion) {
        setState((prev) => ({
          ...prev,
          isTransitioning: true,
          answers: {
            ...prev.answers,
            [currentQuestion.id]: option
          },
          completedStages: { ...prev.completedStages, [state.stage]: true },
        }));
        
        setIsTransitioning(true);
        setIsBlurred(true);
        
        // Move to the next question after a short transition
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            stage: prev.stage + 1,
            answer: "",
            isTransitioning: false,
          }));
          setIsBlurred(false);
          setIsTransitioning(false);
          setSelectionDelay(false);
        }, 300);
      }
    }, 700); // 7ms seconds delay before transition
  }

  const handleNext = () => {
    const currentQuestion = AuthQuestion[state.stage]
    if (currentQuestion.type === "email-phone") {
      if (state.email && state.phoneNumber && state.password && state.stage < AuthQuestion.length - 1) {
        setIsTransitioning(true)
        setIsBlurred(true)
        setTimeout(() => {
          handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)
        }, 300)
      }
    } else {
      if (state.answer && state.stage < AuthQuestion.length - 1) {
        setIsTransitioning(true)
        setIsBlurred(true)
        setTimeout(() => {
          handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)
        }, 300)
      }
    }
  }

  const renderQuestion = () => {
    const currentQuestion = AuthQuestion[state.stage]
    if (!currentQuestion) return null

    if (currentQuestion.options) {
      return (
        <div className="grid grid-cols-1 gap-2 ">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className={`w-full px-4 py-3 rounded-lg border flex items-center space-x-3 ${
                state.answer === option ? "border-[#BE243C] text-[#BE243C]" : "border-gray-300 text-black"
              } text-left text-sm 2xl:text-lg font-medium transition-colors duration-200 hover:bg-gray-50 ${
                selectionDelay || isTransitioning ? "cursor-not-allowed opacity-70" : "cursor-pointer"
              }`}
              disabled={selectionDelay || isTransitioning}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  state.answer === option ? "border-[#BE243C]" : "border-gray-300"
                }`}
              >
                {state.answer === option && <div className="w-3 h-3 rounded-full bg-[#BE243C]" />}
              </div>
              <span className="flex-grow">{option}</span>
            </button>
          ))}
        </div>
      )
    }

    if (currentQuestion.type === "email-phone") {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={state.email}
              onChange={(e) => setState((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#BE243C] focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={state.phoneNumber}
              onChange={(e) => setState((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#BE243C] focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={state.password}
                onChange={(e) => setState((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#BE243C] focus:border-transparent"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <input
        type={currentQuestion.type === "tel" ? "tel" : "text"}
        value={state.answer}
        onChange={(e) => setState((prev) => ({ ...prev, answer: e.target.value }))}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#BE243C] focus:border-transparent"
        placeholder={`Enter ${currentQuestion.type === "otp" ? "OTP" : currentQuestion.type || "answer"}`}
      />
    )
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col md:flex-row jakartha">
      <div className="relative w-full md:w-2/3 h-1/3 md:h-full overflow-hidden">
        <Background stage={state.stage} />
        <PlaneAnimation stage={state.stage} isTransitioning={state.isTransitioning} />
        <Clouds stage={state.stage} isTransitioning={state.isTransitioning} />
      </div>

      <div
        className={`bg-white p-4 sm:p-6 md:p-8 flex flex-col w-full  md:w-1/3 h-2/3 md:h-full rounded-t-3xl md:rounded-none overflow-y-auto scrollbar-hide transition-all duration-300 ease-in-out ${isBlurred ? "blur-sm opacity-50" : "blur-0 opacity-100"}`}
      >
        <div className="flex-1 mt-4 md:mt-16 relative">
          {state.stage === 0 && (
            <div className="text-center font-semibold mb-6">
              Dream Big, Choose Wisely: Your Place, Your Crowd, Your Vibe, Your Lifestyle!
            </div>
          )}

          <div className="flex justify-between items-center mb-4 md:mb-6 gap-4 md:gap-6 w-full sticky bottom-0 bg-white p-2 md:p-0 md:static">
            {state.stage > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                disabled={selectionDelay || isTransitioning}
                className="md:px-4 md:py-2 py-1 px-2 w-full md:w-auto border border-gray-300 rounded-full text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
            )}
            {state.stage < AuthQuestion.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                disabled={
                  state.isTransitioning ||
                  selectionDelay ||
                  (AuthQuestion[state.stage].type === "email-phone"
                    ? !state.email || !state.phoneNumber || !state.password
                    : !state.answer)
                }
                className="md:px-4 md:py-2 py-1 px-2 w-full md:w-auto bg-[#BE243C] text-white rounded-full font-medium hover:bg-[#A61F35] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>

          <h2 className="text-xl md:text-2xl lg:text-3xl leading-tight font-semibold mb-4 md:mb-6">
            {AuthQuestion[state.stage]?.question || "Question not found"}
            <p className="text-base my-2">{AuthQuestion[state.stage]?.caption}</p>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 pb-8 md:pb-16">
            {renderQuestion()}
            {state.stage === AuthQuestion.length - 1 && (
              <button
                type="submit"
                disabled={state.isTransitioning || !state.answer || selectionDelay}
                className="w-full px-6 py-2 bg-[#BE243C] text-white rounded-full font-medium hover:bg-[#A61F35] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify OTP
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}