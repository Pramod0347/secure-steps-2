'use client'

import React, { ReactNode, useState } from 'react';
import logo from "@/app/assets/logo.png";
import Juslogo from "@/app/assets/Juslogo.png";
import { AnimatePresence, motion } from "framer-motion";
import {
    Search,
    Home,
    Wifi,
    Users2,
    Building,
    CreditCard,
    ChevronRight,
    User,
    ChevronFirst,
    ChevronLast,
    MenuIcon,
    Logs,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface AdminLayoutProps {
    children: ReactNode
    currentRoute: string
    currentSubroute?: string
}

const AdminLayout = ({ children, currentRoute }: AdminLayoutProps) => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [expandedRoutes, setExpandedRoutes] = useState<Record<string, boolean>>({});
    const [mobileNavbar, setMobileNavbar] = useState<boolean>(false);

    const navItems = [
        {
            id: 'select',
            label: 'Select',
            icon: Home,
            subroutes: [
                { id: 'subroute1', label: 'Subroute1' },
                { id: 'subroute2', label: 'Subroute2' },
                { id: 'subroute3', label: 'Subroute3' }
            ]
        },
        {
            id: 'stay',
            label: 'Stay',
            icon: Building,
            subroutes: [
                { id: 'subroute1', label: 'Subroute1' },
                { id: 'subroute2', label: 'Subroute2' },
                { id: 'subroute3', label: 'Subroute3' }
            ]
        },
        {
            id: 'connect',
            label: 'Connect',
            icon: Wifi,
            subroutes: [
                { id: 'subroute1', label: 'Subroute1' },
                { id: 'subroute2', label: 'Subroute2' },
                { id: 'subroute3', label: 'Subroute3' }
            ]
        },
        {
            id: 'community',
            label: 'Community',
            icon: Users2,
            subroutes: [
                { id: 'subroute1', label: 'Subroute1' },
                { id: 'subroute2', label: 'Subroute2' },
                { id: 'subroute3', label: 'Subroute3' }
            ]
        },
        {
            id: 'lenders',
            label: 'Lenders',
            icon: CreditCard,
            subroutes: [
                { id: 'subroute1', label: 'Subroute1' },
                { id: 'subroute2', label: 'Subroute2' },
                { id: 'subroute3', label: 'Subroute3' }
            ]
        }
    ];

    const toggleRouteExpansion = (routeId: string | number) => {
        setExpandedRoutes(prev => ({
            ...prev,
            [routeId]: !prev[routeId]
        }));
    };

    const getCurrentLabel = () => {
        return navItems.find(item => item.id === currentRoute)?.label || 'Admin Panel';
    };

    return (
        <div className="flex w-screen h-screen bg-gray-50">

            {/* Sidebar - Exact replica */}
            <div className={`md:flex hidden bg-white border-r border-gray-200 flex-col transition-all duration-200 ${sidebarExpanded ? 'w-64' : 'w-16'}`}>
                {/* Logo section */}
                <div className={`flex items-center ${sidebarExpanded ? "px-6" : "px-2"} py-6 w-full `}>
                    <Link href={"/"} className="flex items-center  justify-end w-full ">
                        {
                            sidebarExpanded ?
                                (
                                    <div className='bg-black p-5 w-full rounded-xl'>
                                        <Image src={logo} alt="Logo" className="h-[29px] w-[127px] " />
                                    </div>
                                ) : (
                                    <div className='flex items-center  justify-center rounded-xl'>
                                        <Image src={Juslogo} alt="Logo" className="h-[29px] w-[30px]" />

                                    </div>
                                )
                        }
                    </Link>
                </div>

                {/* Search */}
                {sidebarExpanded && (
                    <div className="px-6 mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">⌘F</span>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className=" flex-1 px-4">
                    {/* Your custom routes with dropdowns */}
                    <div className="mb-8">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentRoute === item.id;
                            const isExpanded = expandedRoutes[item.id];

                            return (
                                <div key={item.id} className="mb-1">
                                    <div className="flex items-center">
                                        <a
                                            href={`/admin/${item.id}`}
                                            className={`flex-1 flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${isActive
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Icon size={18} />
                                            {sidebarExpanded && <span className="ml-3">{item.label}</span>}
                                        </a>

                                        {sidebarExpanded && (
                                            <button
                                                onClick={() => toggleRouteExpansion(item.id)}
                                                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                            >
                                                {/* {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />} */}
                                                <ChevronRight size={14} />
                                            </button>
                                        )}
                                    </div>

                                </div>
                            );
                        })}
                    </div>

                </nav>

                {/* Help center and user section */}
                <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center px-4 py-2">
                        <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                            <User size={16} className="text-white" />
                        </div>
                        {sidebarExpanded && (
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Ember Crest</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">

                <AnimatePresence>
                    {mobileNavbar && (
                        <motion.div
                            key="mobile-navbar"
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
                            className="fixed top-0 left-0 w-full h-full z-50 bg-white/80 backdrop-blur-lg shadow-md"
                        >
                            <div className="flex justify-between items-center p-4 border-b">
                                <span className="text-lg font-semibold">Menu</span>
                                <button
                                    onClick={() => setMobileNavbar(false)}
                                    className="p-2 text-gray-700 hover:text-gray-900"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-4 p-4 text-gray-800 text-base">
                                <a href="/admin/select" className="hover:text-red-500 transition">Select</a>
                                <a href="/admin/stay" className="hover:text-red-500 transition">Stay</a>
                                <a href="/admin/connect" className="hover:text-red-500 transition">Connect</a>
                                <a href="/admin/community" className="hover:text-red-500 transition">Community</a>
                                <a href="/admin/lenders" className="hover:text-red-500 transition">Lenders</a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                {
                    !mobileNavbar &&
                    <header className="bg-white border-b border-gray-200 md:px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center w-full px-4 md:px-0 justify-between md:justify-start md:space-x-4">
                                <button
                                    onClick={() => setSidebarExpanded(!sidebarExpanded)}
                                    className="md:block hidden p-1 rounded-md hover:bg-gray-100"
                                >
                                    {
                                        sidebarExpanded ? <ChevronFirst size={18} className="text-gray-500" /> : <ChevronLast size={18} className="text-gray-500" />
                                    }
                                </button>

                                {/* Mobile Navbar */}
                                <button onClick={() => setMobileNavbar(prev => !prev)} className='md:hidden block'>
                                    <Logs />
                                </button>

                                <nav className="flex items-center space-x-2 text-sm">
                                    <span className="text-gray-500">Admin</span>
                                    <span className="text-gray-300">/</span>
                                    <span className="text-gray-900 font-medium">{getCurrentLabel()}</span>
                                </nav>
                            </div>
                        </div>
                    </header>
                }

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-3">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;