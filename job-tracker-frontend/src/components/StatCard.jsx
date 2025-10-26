import React from 'react';

/**
 * @component StatCard
 * @description Reusable card component for displaying key statistics.
 */
const StatCard = ({ title, value, icon, bgClass, total }) => {
    // Calculate progress as a percentage
    const progress = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
    
    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl transition duration-300 hover:shadow-2xl border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div className={`text-3xl font-extrabold text-white p-3 rounded-xl ${bgClass}`}>
                    {icon}
                </div>
                <div className="text-right">
                    <p className="text-4xl font-black text-gray-900">{value}</p>
                </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-600 mb-4 border-b pb-2">{title}</h3>
            
            {/* Simple Progress Bar */}
            <div className="h-2 rounded-full bg-gray-200">
                <div 
                    className={`h-full rounded-full ${bgClass}`} 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{progress}% of total applications</p>
        </div>
    );
};

export default StatCard;
