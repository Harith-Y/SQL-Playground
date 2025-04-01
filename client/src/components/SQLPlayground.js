import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SQLPlayground = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, logout } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/queries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Query execution failed');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message || 'Failed to execute query');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">SQL Playground</h1>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-700 mr-4">Welcome, {user.username}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white shadow rounded-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="query" className="block text-sm font-medium text-gray-700">
                                    SQL Query
                                </label>
                                <textarea
                                    id="query"
                                    rows={4}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter your SQL query here..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                                    <span className="block sm:inline">{error}</span>
                                </div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {loading ? 'Executing...' : 'Execute Query'}
                                </button>
                            </div>
                        </form>

                        {result && (
                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Query Result</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                {result.columns?.map((column, index) => (
                                                    <th
                                                        key={index}
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        {column}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {result.rows?.map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    {Object.values(row).map((value, colIndex) => (
                                                        <td
                                                            key={colIndex}
                                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                                        >
                                                            {value}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SQLPlayground; 