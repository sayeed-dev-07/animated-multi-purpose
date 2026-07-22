import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import TeamCard from '../components/teamComp/teamCard';

const Team = () => {
    const [teamInfo, setTeamInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'https://backend-updated-topaz.vercel.app/teams';

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Failed to fetch team data');
                
                const data = await response.json();
                
                if (data && data.length > 0) {
                    setTeamInfo(data[0]);
                } else {
                    throw new Error('No team data found in database');
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, []);

    if (loading) {
        return (
            <div className='py-20 flex items-center justify-center text-white min-h-[50vh]'>
                <p className='animate-pulse tracking-[4px] uppercase'>Loading Team...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='py-20 flex items-center justify-center text-red-500 min-h-[50vh]'>
                <p>Error: {error}</p>
            </div>
        );
    }

    // Safety fallbacks in case strings are empty in the DB
    const sectionTitle = teamInfo?.title?.trim() ? teamInfo.title : 'TEAM MEMBER';
    const sectionDes = teamInfo?.des?.trim() ? teamInfo.des : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Integer.';
    const cards = Array.isArray(teamInfo?.cards) ? teamInfo.cards : [];

    return (
        <div className='py-20'>
            <SectionTitle title={sectionTitle} des={sectionDes} />

            {/* team img cards  */}
            <div className='grid md:grid-cols-4 sm:gap-y-11.5 sm:grid-cols-2 grid-cols-1 py-25 md:gap-x-5 sm:gap-x-11.25 justify-center place-items-center gap-y-12.5'>
                {cards.length > 0 ? (
                    cards.map((item, index) => {
                        return <TeamCard key={item.id || index} data={item} />
                    })
                ) : (
                    <div className="col-span-full text-center text-white/50 py-10">
                        No team members available.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Team;