
// interface PopupProps {
//     handleSubmitted:()=>void
//     handleSubmitting:()=>void
//     handleClosePopup:()=>void
//     isPopupOpen:()=>void
// }

// const Popup = ({handleSubmitted,handleSubmitting,handleClosePopup,isPopupOpen}:{}) => {
//     const [email, setEmail] = useState("");
//     const [phone, setPhone] = useState("");
//     const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

//     const handleSubmit = async (e: React.FormEvent) => {
//       e.preventDefault();
//       if (selectedOptions.length !== 1 && selectedOptions.length !== 3) {
//         return; // Don't submit if the selection is invalid
//       }
//       setIsSubmitting(true);
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 2000));
//       console.log("Form submitted:", { email, phone, selectedOptions });
//       setIsSubmitting(false);
//       setIsSubmitted(true);
//       setTimeout(() => {
//         handleClosePopup();
//       }, 3000);
//     };

//     const handleCheckboxChange = (option: string) => {
//       setSelectedOptions((prev) =>
//         prev.includes(option)
//           ? prev.filter((item) => item !== option)
//           : [...prev, option]
//       );
//     };

//     return (
//       <AnimatePresence>
//         {isPopupOpen && (
//           <motion.div
//             className="fixed inset-0 flex items-center justify-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className="absolute inset-0 bg-black bg-opacity-50"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={handleClosePopup}
//             />
//             <motion.div
//               className="bg-white p-6 md:p-8 flex flex-col w-full max-w-md rounded-2xl shadow-xl relative z-10"
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ type: "spring", damping: 20, stiffness: 300 }}
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl md:text-2xl font-bold text-[#BE243C]">
//                   Get Resources
//                 </h2>
//                 <button
//                   onClick={handleClosePopup}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-6 w-6"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </button>
//               </div>
//               <AnimatePresence mode="wait">
//                 {isSubmitting ? (
//                   <motion.div
//                     key="loading"
//                     className="flex flex-col items-center justify-center h-40"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                   >
//                     <motion.div
//                       className="w-16 h-16 border-4 border-[#BE243C] border-t-transparent rounded-full"
//                       animate={{ rotate: 360 }}
//                       transition={{
//                         duration: 1,
//                         repeat: Number.POSITIVE_INFINITY,
//                         ease: "linear",
//                       }}
//                     />
//                   </motion.div>
//                 ) : isSubmitted ? (
//                   <motion.div
//                     key="success"
//                     className="flex flex-col items-center justify-center h-40"
//                     initial={{ opacity: 0, scale: 0.5 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ type: "spring", stiffness: 260, damping: 20 }}
//                   >
//                     <svg
//                       className="w-16 h-16 text-green-500"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M5 13l4 4L19 7"
//                       />
//                     </svg>
//                     <motion.p
//                       className="mt-4 text-lg font-semibold text-gray-700"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ delay: 0.2 }}
//                     >
//                       We'll reach you soon!
//                     </motion.p>
//                   </motion.div>
//                 ) : (
//                   <motion.div
//                     key="form"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                   >
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                       <div>
//                         <label
//                           htmlFor="email"
//                           className="block mb-2 text-sm font-medium text-gray-700"
//                         >
//                           Email
//                         </label>
//                         <input
//                           type="email"
//                           id="email"
//                           className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BE243C]"
//                           placeholder="name@company.com"
//                           required
//                           value={email}
//                           onChange={(e) => setEmail(e.target.value)}
//                         />
//                       </div>
//                       <div>
//                         <label
//                           htmlFor="phone"
//                           className="block mb-2 text-sm font-medium text-gray-700"
//                         >
//                           Phone Number
//                         </label>
//                         <input
//                           type="tel"
//                           id="phone"
//                           className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BE243C]"
//                           placeholder="123-456-7890"
//                           required
//                           value={phone}
//                           onChange={(e) => setPhone(e.target.value)}
//                         />
//                       </div>
//                       <div>
//                         <label className="block mb-2 text-sm font-medium text-gray-700">
//                           Choose Your Resources
//                         </label>
//                         <div className="space-y-2">
//                           {[
//                             "Ultimate Guide",
//                             "Statement of Purpose",
//                             "Letter of Recommendation",
//                           ].map((option) => (
//                             <label key={option} className="flex items-center">
//                               <input
//                                 type="checkbox"
//                                 className="form-checkbox h-5 w-5 text-[#BE243C]"
//                                 checked={selectedOptions.includes(option)}
//                                 onChange={() => handleCheckboxChange(option)}
//                               />
//                               <span className="ml-2 text-gray-700">
//                                 {option}
//                               </span>
//                             </label>
//                           ))}
//                         </div>
//                       </div>
//                       {selectedOptions.length === 2 && (
//                         <p className="text-sm text-red-500">
//                           Please select either 1 or 3 options.
//                         </p>
//                       )}
//                       <motion.button
//                         type="submit"
//                         className={`w-full px-6 py-3 text-white rounded-full font-medium transition-colors duration-200 ${selectedOptions.length === 1 ||
//                             selectedOptions.length === 3
//                             ? "bg-[#BE243C] hover:bg-[#A61F35]"
//                             : "bg-gray-400 cursor-not-allowed"
//                           }`}
//                         whileHover={
//                           selectedOptions.length === 1 ||
//                             selectedOptions.length === 3
//                             ? { scale: 1.05 }
//                             : {}
//                         }
//                         whileTap={
//                           selectedOptions.length === 1 ||
//                             selectedOptions.length === 3
//                             ? { scale: 0.95 }
//                             : {}
//                         }
//                         disabled={
//                           selectedOptions.length !== 1 &&
//                           selectedOptions.length !== 3
//                         }
//                       >
//                         Submit
//                       </motion.button>
//                     </form>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     );
//   };

//   export default Popup;