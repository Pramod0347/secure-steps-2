/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useCallback, useEffect } from 'react';
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion';
import PlaceHolder from "@/app/assets/Placehoder-Img.png";
// import { Eye, EyeOff } from 'lucide-react';
// import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'sonner';

interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    banner: string | null;
    phoneNumber: string | null;
    department: string | null;
    program: string | null;
    graduationYear: string | null;
}

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onSave: (updatedUser: User) => void;
}

interface AvailabilityState {
    isAvailable: boolean | null;
    isChecking: boolean;
    message: string | null;
}

function debounce<F extends (...args: any[]) => any>(func: F, wait: number): (...args: Parameters<F>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: Parameters<F>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, user, onSave }) => {
    const Next_API = process.env.NEXTAUTH_URL || window.location.origin;
    const [formData, setFormData] = useState<User>(user);
    const [changedFields, setChangedFields] = useState<Partial<User>>({});
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [usernameAvailability, setUsernameAvailability] = useState<AvailabilityState>({
        isAvailable: true,
        isChecking: false,
        message: '',
    });
    const [emailAvailability, setEmailAvailability] = useState<AvailabilityState>({
        isAvailable: true,
        isChecking: false,
        message: '',
    });

    const checkAvailability = useCallback(
        debounce(async (type: 'username' | 'email', value: string) => {
            if (value === (type === 'username' ? user.username : user.email)) {
                if (type === 'username') {
                    setUsernameAvailability({ isAvailable: true, isChecking: false, message: null });
                } else {
                    setEmailAvailability({ isAvailable: true, isChecking: false, message: null });
                }
                return;
            }

            if (value.length < 3) {
                if (type === 'username') {
                    setUsernameAvailability({ isAvailable: false, isChecking: false, message: 'Username must be at least 3 characters long' });
                } else {
                    setEmailAvailability({ isAvailable: false, isChecking: false, message: 'Please enter a valid email' });
                }
                return;
            }

            if (type === 'username') {
                setUsernameAvailability(prev => ({ ...prev, isChecking: true, message: 'Checking availability...' }));
            } else {
                setEmailAvailability(prev => ({ ...prev, isChecking: true, message: 'Checking availability...' }));
            }

            try {
                let response;
                if (type === 'username') {
                    response = await fetch(`${Next_API}/api/auth/username?username=${encodeURIComponent(value)}`);
                } else {
                    response = await fetch(`${Next_API}/api/auth/user?email=${value}`);
                }
                const data = await response.json();

                if (type === 'username') {
                    setUsernameAvailability({
                        isAvailable: data.available,
                        isChecking: false,
                        message: data.available ? 'Username available' : 'Username already taken'
                    });
                } else {
                    setEmailAvailability({
                        isAvailable: data.available,
                        isChecking: false,
                        message: data.available ? 'Email available' : 'Email already in use'
                    });
                }
            } catch (error) {
                console.error(`Error checking ${type} availability:`, error);
                if (type === 'username') {
                    setUsernameAvailability({ isAvailable: false, isChecking: false, message: 'Error checking availability' });
                } else {
                    setEmailAvailability({ isAvailable: false, isChecking: false, message: 'Error checking availability' });
                }
            }
        }, 300),
        [Next_API, user.username, user.email]
    );

    useEffect(() => {
        if (formData.username !== user.username) {
            checkAvailability('username', formData.username);
        } else {
            setUsernameAvailability({ isAvailable: true, isChecking: false, message: null });
        }
    }, [formData.username, checkAvailability, user.username]);

    useEffect(() => {
        if (formData.email !== user.email) {
            checkAvailability('email', formData.email);
        } else {
            setEmailAvailability({ isAvailable: true, isChecking: false, message: null });
        }
    }, [formData.email, checkAvailability, user.email]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Only track if the value is different from the original
        if (value !== user[name as keyof User]) {
            setChangedFields(prev => ({ ...prev, [name]: value }));
        } else {
            // Remove from changed fields if it's back to original
            const updatedFields = { ...changedFields };
            delete updatedFields[name as keyof User];
            setChangedFields(updatedFields);
        }
    };

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'avatar') => {
        const file = e.target.files?.[0];
        if (file) {
            if (type === 'banner') {
                setBannerFile(file);
                const newBannerUrl = URL.createObjectURL(file);
                setFormData(prev => ({ ...prev, banner: newBannerUrl }));
                setChangedFields(prev => ({ ...prev, banner: newBannerUrl }));
            } else {
                setAvatarFile(file);
                const newAvatarUrl = URL.createObjectURL(file);
                setFormData(prev => ({ ...prev, avatar: newAvatarUrl }));
                setChangedFields(prev => ({ ...prev, avatar: newAvatarUrl }));
            }
        }
    }, []);



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!usernameAvailability.isAvailable) {
            toast.error("Please choose an available username.");
            return;
        }
        if (!emailAvailability.isAvailable) {
            toast.error("This email is already in use. Please choose a different email.");
            return;
        }

        // Only include changed fields and ID in the update
        const updatedData: Partial<User> = {
            // id: user.id,
            ...changedFields
        };

        // Handle file uploads if needed
        if (bannerFile) {
            // Simulating S3 upload and getting URL
            updatedData.banner = `https://your-s3-bucket.com/${bannerFile.name}`;
        }

        if (avatarFile) {
            // Simulating S3 upload and getting URL
            updatedData.avatar = `https://your-s3-bucket.com/${avatarFile.name}`;
        }

        onSave(updatedData as User);
        onClose();
    };


    const renderAvailabilityFeedback = (state: AvailabilityState) => {
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

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white mt-10 rounded-[30px] w-full max-w-3xl mx-4 max-h-[80vh] flex flex-col"
                >
                    <div className="p-6 border-b flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Edit Profile</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <IoClose size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                        <div className="space-y-6">
                            {/* Banner Image */}
                            <div className="relative rounded-2xl overflow-hidden h-48">
                                <Image
                                    src={formData.banner || PlaceHolder}
                                    alt="Banner"
                                    fill
                                    className="object-cover"
                                />
                                <label className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm p-2 rounded-full cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, 'banner')}
                                    />
                                    <span className="text-white">Change Banner</span>
                                </label>
                            </div>

                            {/* Avatar Image */}
                            <div className="relative w-32 h-32 mx-auto -mt-16 rounded-full overflow-hidden border-4 border-white">
                                <Image
                                    src={formData.avatar || PlaceHolder}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                />
                                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, 'avatar')}
                                    />
                                    <span className="text-white text-sm">Change Avatar</span>
                                </label>
                            </div>

                            {/* Other form fields */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Name"
                                        className="w-full p-3 border rounded-lg"
                                    />
                                    <span className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs text-gray-500">
                                        Name
                                    </span>
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Username"
                                        className={`w-full p-3 border rounded-lg ${usernameAvailability.isAvailable ? 'border-green-500' : 'border-red-500'
                                            }`}
                                    />
                                    <span className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs text-gray-500">
                                        Username
                                    </span>
                                    {renderAvailabilityFeedback(usernameAvailability)}
                                </div>

                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        className={`w-full p-3 border rounded-lg ${emailAvailability.isAvailable ? 'border-green-500' : 'border-red-500'
                                            }`}
                                    />
                                    <span className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs text-gray-500">
                                        Email
                                    </span>
                                    {renderAvailabilityFeedback(emailAvailability)}
                                </div>

                                <div className="relative">
                                    <textarea
                                        name="bio"
                                        value={formData.bio || ''}
                                        onChange={handleChange}
                                        placeholder="Bio"
                                        className="w-full p-3 border rounded-lg"
                                        rows={4}
                                    />
                                    <span className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs text-gray-500">
                                        Bio
                                    </span>
                                </div>

                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber || ''}
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                        className="w-full p-3 border rounded-lg"
                                    />
                                    <span className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs text-gray-500">
                                        Phone Number
                                    </span>
                                </div>



                                <div className="relative">
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department || ''}
                                        onChange={handleChange}
                                        placeholder="Department"
                                        className="w-full p-3 border rounded-lg"
                                    />
                                    <span className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs text-gray-500">
                                        Department
                                    </span>
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        name="program"
                                        value={formData.program || ''}
                                        onChange={handleChange}
                                        placeholder="Program"
                                        className="w-full p-3 border rounded-lg"
                                    />
                                    <span className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs text-gray-500">
                                        Program
                                    </span>
                                </div>

                                <div className="relative">
                                    <input
                                        type="number"
                                        name="graduationYear"
                                        value={formData.graduationYear || ''}
                                        onChange={handleChange}
                                        placeholder="Graduation Year"
                                        className="w-full p-3 border rounded-lg"
                                    />
                                    <span className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs text-gray-500">
                                        Graduation Year
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-center space-x-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-1/2 px-4 py-2 text-sm font-medium text-black bg-gray-200 border border-transparent rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-1/2 px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditProfileModal;

