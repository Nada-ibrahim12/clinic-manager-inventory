import React from 'react'



export default function Pagination({ links = {} }) {
    // Safely handle undefined or missing meta data
    const meta = links?.meta || {
        from: 0,
        to: 0,
        total: 0,
        links: [],
    };

    return (
        <nav className="flex items-center justify-between bg-white rounded-md shadow-sm p-4">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{meta.from}</span>
                        to <span className="font-medium">{meta.to}</span> of
                        <span className="font-medium">{meta.total}</span>
                        results
                    </p>
                </div>
                <div>
                    <div className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {meta.links?.map((link, index) => (
                            <a
                                key={index}
                                href={link.url || "#"}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    link.active
                                        ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                } ${
                                    !link.url
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}