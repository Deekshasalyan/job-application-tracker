import React from 'react';

/**
 * @component Modal
 * @description A reusable modal component to overlay content (like forms) on the application screen.
 */
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        // Modal Overlay (The dark backdrop)
        <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose} // Close modal when clicking outside the content
        >
            {/* Modal Content */}
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the content
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-800 transition duration-150"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Modal Body */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
