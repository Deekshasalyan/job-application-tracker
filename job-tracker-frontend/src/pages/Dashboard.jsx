import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { api } from '../services/apiService';

// Define the structure of the dashboard stats cards
const statsConfig = [
    { title: 'Total Applied', key: 'Total', icon: '📝', bgClass: 'bg-indigo-600', isTotal: true },
    { title: 'Interviews Scheduled', key: 'Interviewing', icon: '📞', bgClass: 'bg-green-500', isTotal: false },
    { title: 'Offer Received', key: 'Offer', icon: '🎉', bgClass: 'bg-amber-500', isTotal: false },
    { title: 'Rejected/Declined', key: 'Rejected', icon: '❌', bgClass: 'bg-red-500', isTotal: false },
];

/**
 * @component Dashboard
 * @description Displays key statistics and application summary for the authenticated user.
 */
const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch application statistics from the backend
    const fetchStats = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // API call to the protected stats endpoint
            const response = await api.get('/applications/stats');
            setStats(response.data);
        } catch (err) {
            console.error("Error fetching stats:", err);
            // The context handles 401, but we handle other errors here
            setError("Failed to load statistics. Please try again.");
            setStats({ defaultStats: {}, totalApplications: 0 }); // Set a safe default state
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []); // Run only once on component mount

    if (isLoading) {
        return <div className="p-8 text-center text-gray-600">Loading your job stats...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600 font-semibold">{error}</div>;
    }
    
    // Calculate total applications for percentage calculation in StatCard
    const totalApplications = stats.totalApplications;

    return (
        <div className="p-8 bg-white min-h-full rounded-xl shadow-lg">
            
            {/* Dashboard Header */}
            <div className="flex justify-between items-center mb-10 border-b pb-4">
                <h1 className="text-4xl font-extrabold text-gray-800">Job Hunt Overview</h1>
                <button
                    // In a later step, this button will open a modal to add a new application
                    className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-200"
                >
                    + Add New Application
                </button>
            </div>

            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statsConfig.map((card) => {
                    // Determine the value to display based on whether it's the Total or a specific status
                    const value = card.isTotal 
                        ? totalApplications 
                        : (stats.defaultStats[card.key] || 0);

                    return (
                        <StatCard
                            key={card.key}
                            title={card.title}
                            value={value}
                            icon={card.icon}
                            bgClass={card.bgClass}
                            total={totalApplications}
                        />
                    );
                })}
            </div>
            
            {/* Secondary Content Placeholder */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
                <p className="text-gray-500">
                    A list or chart of your most recent applications and upcoming follow-ups will appear here (requires fetching all application data).
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
