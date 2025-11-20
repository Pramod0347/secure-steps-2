"use client";

import { motion } from "framer-motion";
import { PhoneCall } from "lucide-react";

export default function FramerGradientButton() {
    return (
        <motion.button
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="
                relative overflow-hidden px-8 py-4 rounded-full 
                backdrop-blur-xl text-white font-semibold flex items-center gap-3
            "
        >
            {/* Rotating Conic Gradient Highlight */}
            <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="
                    absolute inset-0 rounded-full
                    bg-[conic-gradient(from_0deg,rgba(66,255,239,0.7),rgba(255,0,140,0.4),rgba(0,140,255,0.7))]
                    opacity-40
                "
            />

            {/* Frosted Glass Middle Layer */}
            <span
                className="
                    absolute inset-[2px] bg-white/10 rounded-full 
                    backdrop-blur-2xl border border-white/20
                "
            />

            {/* Content */}
            <span className="relative z-10 flex items-center gap-3">
                Any questions? Reach out
                <PhoneCall className="w-5 h-5" />
            </span>
        </motion.button>
    );
}
