import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';

// Simple date formatter utility
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// Configuration for status colors
const statusColors = {
    'Applied': 'bg-blue-100 text-blue-800',
    'Interviewing': 'bg-green-100 text-green-800',
    'Offer': 'bg-amber-100 text-amber-800',
    'Rejected': 'bg-red-100 text-red-800',
    'withdrawn': 'bg-gray-100 text-gray-800', // Assuming 'withdrawn' from your backend model
};

const statusOptions = ['All', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'withdrawn'];

/**
 * @component Applications
 * @description Displays the full list of job applications with filtering and searching capabilities.
 */
const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ search: '', status: 'All' });

    // --- Data Fetching ---
    const fetchApplications = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/applications');
            // Assuming response.data contains { applications: [list of apps] }
            setApplications(response.data.applications || []);
        } catch (err) {
            console.error("Error fetching applications:", err);
            setError("Failed to load applications. Check your backend API connection.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []); 

    // --- Filtering Logic ---
    const filteredApplications = useMemo(() => {
        return applications.filter(app => {
            // Filter by search term (Company or Job Title)
            const searchMatch = app.company.toLowerCase().includes(filters.search.toLowerCase()) || 
                                app.jobTitle.toLowerCase().includes(filters.search.toLowerCase());

            // Filter by status
            const statusMatch = filters.status === 'All' || app.status === filters.status;

            return searchMatch && statusMatch;
        });
    }, [applications, filters]);

    // Handler for filter changes
    const handleFilterChange = (e) => {
        setFilters(prev => ({ 
            ...prev, 
            [e.target.name]: e.target.value 
        }));
    };

    // --- Component Render ---
    if (isLoading) {
        return <div className="p-8 text-center text-gray-600">Loading applications data...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600 font-semibold">{error}</div>;
    }
    
    if (applications.length === 0 && filters.status === 'All' && filters.search === '') {
        return (
            <div className="p-12 text-center bg-white rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800">Start Your Job Hunt!</h2>
                <p className="mt-2 text-gray-500">You haven't added any applications yet. Go to the Dashboard to add your first entry.</p>
            </div>
        );
    }

    return (
        <div className="p-8 bg-white min-h-full rounded-xl shadow-lg">
            
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h1 className="text-4xl font-extrabold text-gray-800">
                    All Applications 
                    <span className="text-xl font-medium text-gray-500 ml-3">({filteredApplications.length} found)</span>
                </h1>
                <button
                    // This button will eventually open the Add Application modal
                    className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-200"
                >
                    + Add New
                </button>
            </div>

            {/* Filtering Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-gray-50 rounded-xl border">
                <input
                    type="text"
                    name="search"
                    placeholder="Search by Company or Job Title..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition"
                />
                
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition sm:w-1/4"
                >
                    {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company / Position</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Applied Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredApplications.map((app) => (
                            <tr key={app._id} className="hover:bg-gray-50 transition duration-150">
                                {/* Company / Position */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {app.company}
                                    <div className="text-gray-500 text-xs mt-1">{app.jobTitle}</div>
                                </td>
                                
                                {/* Location */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                    {app.location || 'N/A'}
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span 
                                        className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[app.status] || 'bg-gray-300 text-gray-700'}`}
                                    >
                                        {app.status}
                                    </span>
                                </td>

                                {/* Applied Date */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                                    {formatDate(app.dateApplied)}
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-sky-600 hover:text-sky-900 mr-4 transition duration-150">Edit</button>
                                    <button className="text-red-600 hover:text-red-900 transition duration-150">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Message if no results after filtering */}
            {filteredApplications.length === 0 && applications.length > 0 && (
                <div className="p-6 text-center text-gray-500 bg-gray-100 rounded-lg mt-8">
                    No applications match the current filter criteria.
                </div>
            )}
            
        </div>
    );
};

export default Applications;
