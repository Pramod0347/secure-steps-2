// Page.tsx
"use client";

import React from "react";
import { useState, useEffect } from "react";
import Events from "@/app/components/community/Events";
import Forums from "@/app/components/community/Forums";
import Articles from "@/app/components/community/Articles";
import Leaderboard from "@/app/components/community/Leaderboard";
import Hero from "@/app/components/community/group/Hero";


interface GroupData {
    id: string;
    name: string;
    banner: string;
    logo: string;
    description: string;
    followersCount: number;
    membersCount: number;
    creatorUsername: string;
}

const Page = ({ params }: { params: { id: string } }) => {
    const [activeTab, setActiveTab] = useState("Events");
    const [groupData, setGroupData] = useState<GroupData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const response = await fetch(`/api/community/group?id=${params.id}`);
                if (!response.ok) throw new Error('Failed to fetch group data');
                const data = await response.json();
                setGroupData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load group data');
            } finally {
                setLoading(false);
            }
        };

        fetchGroupData();
    }, [params.id]);

    const renderActiveComponent = () => {
        switch (activeTab) {
            case "Events":
                return <Events />;
            case "Forums":
                return <Forums />;
            case "Articles":
                return <Articles />;
            case "Leaderboard":
                return <Leaderboard />;
            default:
                return <Events />;
        }
    };

    if (loading) return <div className="w-full h-[50vh] flex items-center justify-center">Loading...</div>;
    if (error) return <div className="w-full h-[50vh] flex items-center justify-center text-red-500">{error}</div>;
    if (!groupData) return null;

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <Hero groupData={groupData} />
            
            <hr className="w-full my-10 border-4 md:border-8" />
            
            <div className="flex text-[16px] md:text-[22px] text-[#909090] font-semibold w-full justify-evenly md:mt-10">
                {["Events", "Forums", "Articles", "Leaderboard"].map((tab) => (
                    <button
                        key={tab}
                        className={`${
                            activeTab === tab ? "text-[#E50914]" : "hover:text-[#E50914]"
                        }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            
            {renderActiveComponent()}
        </div>
    );
};

export default Page;