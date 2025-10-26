// import React, { useState, useEffect } from 'react';
// import { api } from '../services/apiService';

// const statusOptions = ['Applied', 'Interviewing', 'Offer', 'Rejected', 'withdrawn'];

// /**
//  * @component ApplicationForm
//  * @description Handles both creating new applications and editing existing ones.
//  * @param {object} initialData - Optional data if editing an existing application.
//  * @param {function} onClose - Function to close the modal.
//  * @param {function} onComplete - Function to call after successful save (e.g., refresh list).
//  */
// const ApplicationForm = ({ initialData, onClose, onComplete }) => {
//     // Determine if we are editing or creating based on initialData presence
//     const isEditing = !!initialData?._id;
//     const initialFormState = {
//         company: '',
//         jobTitle: '',
//         status: 'Applied',
//         location: '',
//         notes: '',
//         jobUrl: '',
//         salary: '',
//         skills: '',
//         followUpDate: '',
//         ...initialData,
//         // Format followUpDate for the input type="date"
//         followUpDate: initialData?.followUpDate ? new Date(initialData.followUpDate).toISOString().split('T')[0] : '',
//     };

//     const [formData, setFormData] = useState(initialFormState);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(false);

//     // Sync form data if initialData changes (important if the modal is reused)
//     useEffect(() => {
//         setFormData(initialFormState);
//     }, [initialData]);
    
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         setSuccess(false);
//         setIsLoading(true);

//         const url = isEditing ? `/applications/${initialData._id}` : '/applications';
//         const method = isEditing ? 'patch' : 'post';
        
//         try {
//             await api[method](url, formData);
            
//             setSuccess(true);
            
//             // Wait briefly before closing and completing
//             setTimeout(() => {
//                 onClose();
//                 if (onComplete) onComplete(); 
//             }, 800);

//         } catch (err) {
//             console.error("API Error:", err);
//             const msg = err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} application.`;
//             setError(msg);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-6">
//             <h3 className="text-xl font-semibold text-gray-700">Required Details</h3>
            
//             {/* Row 1: Company and Job Title */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                     <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
//                     <input
//                         type="text"
//                         name="company"
//                         id="company"
//                         value={formData.company}
//                         onChange={handleChange}
//                         required
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-sky-500 focus:border-sky-500"
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title</label>
//                     <input
//                         type="text"
//                         name="jobTitle"
//                         id="jobTitle"
//                         value={formData.jobTitle}
//                         onChange={handleChange}
//                         required
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-sky-500 focus:border-sky-500"
//                     />
//                 </div>
//             </div>

//             {/* Row 2: Status and Location */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                     <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
//                     <select
//                         name="status"
//                         id="status"
//                         value={formData.status}
//                         onChange={handleChange}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-sky-500 focus:border-sky-500"
//                     >
//                         {statusOptions.map(status => (
//                             <option key={status} value={status}>{status}</option>
//                         ))}
//                     </select>
//                 </div>
//                 <div>
//                     <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
//                     <input
//                         type="text"
//                         name="location"
//                         id="location"
//                         value={formData.location}
//                         onChange={handleChange}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-sky-500 focus:border-sky-500"
//                     />
//                 </div>
//             </div>

//             <h3 className="text-xl font-semibold text-gray-700 pt-4 border-t">Optional Details</h3>

//             {/* Row 3: Job URL and Salary */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                     <label htmlFor="jobUrl" className="block text-sm font-medium text-gray-700">Job URL</label>
//                     <input
//                         type="url"
//                         name="jobUrl"
//                         id="jobUrl"
//                         value={formData.jobUrl}
//                         onChange={handleChange}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-sky-500 focus:border-sky-500"
//                         placeholder="https://company.com/job-post"
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary Estimate</label>
//                     <input
//                         type="text"
//                         name="salary"
//                         id="salary"
//                         value={formData.salary}
//                         onChange={handleChange}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-sky-500 focus:border-sky-500"
//                         placeholder="$60k - $80k / year"
//                     />
//                 </div>
//             </div>

//             {/* Row 4: Follow Up Date and Skills */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                     <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700">Follow Up Date</label>
//                     <input
//                         type="date"
//                         name="followUpDate"
//                         id="followUpDate"
//                         value={formData.followUpDate}
//                         onChange={handleChange}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-sky-500 focus:border-sky-500"
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills (Comma Separated)</label>
//                     <input
//                         type="text"
//                         name="skills"
//                         id="skills"
//                         value={formData.skills}
//                         onChange={handleChange}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-sky-500 focus:border-sky-500"
//                         placeholder="React, Tailwind, Node.js"
//                     />
//                 </div>
//             </div>

//             {/* Row 5: Notes */}
//             <div>
//                 <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes / Description</label>
//                 <textarea
//                     name="notes"
//                     id="notes"
//                     rows="3"
//                     value={formData.notes}
//                     onChange={handleChange}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-sky-500 focus:border-sky-500"
//                 ></textarea>
//             </div>

//             {/* Submit and Feedback */}
//             {error && <p className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-md">{error}</p>}
//             {success && <p className="text-green-600 text-sm font-medium bg-green-50 p-3 rounded-md">Successfully {isEditing ? 'updated' : 'created'} application!</p>}

//             <div className="flex justify-end space-x-3 pt-4">
//                 <button
//                     type="button"
//                     onClick={onClose}
//                     className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150"
//                     disabled={isLoading}
//                 >
//                     Cancel
//                 </button>
//                 <button
//                     type="submit"
//                     className="px-5 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition duration-150 shadow-md disabled:opacity-50"
//                     disabled={isLoading}
//                 >
//                     {isLoading ? 'Saving...' : (isEditing ? 'Update Application' : 'Add Application')}
//                 </button>
//             </div>
//         </form>
//     );
// };

// export default ApplicationForm;
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';

const statusOptions = ['Applied', 'Interviewing', 'Offer', 'Rejected', 'withdrawn'];

/**
 * @component ApplicationForm
 * @description Handles both creating new applications and editing existing ones.
 * @param {object} initialData - Optional data if editing an existing application.
 * @param {function} onClose - Function to close the modal.
 * @param {function} onComplete - Function to call after successful save (e.g., refresh list).
 */
const ApplicationForm = ({ initialData, onClose, onComplete }) => {
    // Determine if we are editing or creating based on initialData presence
    const isEditing = !!initialData?._id;
    const initialFormState = {
        company: '',
        jobTitle: '',
        status: 'Applied',
        location: '',
        notes: '',
        jobUrl: '',
        salary: '',
        skills: '',
        followUpDate: '',
        ...initialData,
        // Format followUpDate for the input type="date"
        followUpDate: initialData?.followUpDate ? new Date(initialData.followUpDate).toISOString().split('T')[0] : '',
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Sync form data if initialData changes (important if the modal is reused)
    useEffect(() => {
        setFormData(initialFormState);
    }, [initialData]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setIsLoading(true);

        const url = isEditing ? `/applications/${initialData._id}` : '/applications';
        const method = isEditing ? 'patch' : 'post';
        
        try {
            await api[method](url, formData);
            
            setSuccess(true);
            
            // Wait briefly before closing and completing
            setTimeout(() => {
                onClose();
                if (onComplete) onComplete(); 
            }, 800);

        } catch (err) {
            console.error("API Error:", err);
            const msg = err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} application.`;
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-700">Required Details</h3>
            
            {/* Row 1: Company and Job Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                    <input
                        type="text"
                        name="company"
                        id="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-sky-500 focus:border-sky-500"
                    />
                </div>
                <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title</label>
                    <input
                        type="text"
                        name="jobTitle"
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-sky-500 focus:border-sky-500"
                    />
                </div>
            </div>

            {/* Row 2: Status and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        name="status"
                        id="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-sky-500 focus:border-sky-500"
                    >
                        {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                        type="text"
                        name="location"
                        id="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-sky-500 focus:border-sky-500"
                    />
                </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-700 pt-4 border-t">Optional Details</h3>

            {/* Row 3: Job URL and Salary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="jobUrl" className="block text-sm font-medium text-gray-700">Job URL</label>
                    <input
                        type="url"
                        name="jobUrl"
                        id="jobUrl"
                        value={formData.jobUrl}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="https://company.com/job-post"
                    />
                </div>
                <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary Estimate</label>
                    <input
                        type="text"
                        name="salary"
                        id="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="$60k - $80k / year"
                    />
                </div>
            </div>

            {/* Row 4: Follow Up Date and Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700">Follow Up Date</label>
                    <input
                        type="date"
                        name="followUpDate"
                        id="followUpDate"
                        value={formData.followUpDate}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-sky-500 focus:border-sky-500"
                    />
                </div>
                <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills (Comma Separated)</label>
                    <input
                        type="text"
                        name="skills"
                        id="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="React, Tailwind, Node.js"
                    />
                </div>
            </div>

            {/* Row 5: Notes */}
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes / Description</label>
                <textarea
                    name="notes"
                    id="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-sky-500 focus:border-sky-500"
                ></textarea>
            </div>

            {/* Submit and Feedback */}
            {error && <p className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-md">{error}</p>}
            {success && <p className="text-green-600 text-sm font-medium bg-green-50 p-3 rounded-md">Successfully {isEditing ? 'updated' : 'created'} application!</p>}

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150"
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-5 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition duration-150 shadow-md disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : (isEditing ? 'Update Application' : 'Add Application')}
                </button>
            </div>
        </form>
    );
};

export default ApplicationForm;
