import React, { useEffect, useState } from 'react';

interface UserEntity {
    id: number;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    age: number;
    birthdate: Date;
    generatedAiStrats: number;
    // Add other fields if they exist in your UserEntity class
}

const AdminListOfUser: React.FC = () => {
    const [users, setUsers] = useState<UserEntity[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserEntity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userCount, setUserCount] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        // Fetch the list of users from the backend
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8080/user/getAllUsers');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data: UserEntity[] = await response.json();
                setUsers(data);
                setFilteredUsers(data);

                // Fetch the user count
                const countResponse = await fetch('http://localhost:8080/user/userCount');
                if (!countResponse.ok) {
                    throw new Error('Failed to fetch user count');
                }
                const countData = await countResponse.json();
                setUserCount(countData.userCount);

            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        // Filter users based on the search term
        const filtered = users.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    if (loading) {
        return <div className="text-center text-xl">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 text-xl">Error: {error}</div>;
    }

    return (
        <div className="p-8 max-w-15xl mx-auto text-[rgb(59,59,59)] ">
            <h1 className="font-bold text-[3rem] text-[rgb(59,59,59)] text-center mb-5">List of Users</h1>
            <div className="mb-8">
                <p className="text-xl text-center mb-4">Total Users: {userCount}</p>
                <div className="flex justify-center mb-8">
                    <div className="relative w-full max-w-md">
                        <div className="flex items-center border border-gray-300 rounded-lg shadow-lg">
                            <input
                                type="text"
                                placeholder="Search by username..."
                                className="w-full px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-500 mr-3 ml-3"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="15" y2="15" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            {filteredUsers.length > 0 ? (
                <div className="overflow-auto justify-center mb-[6rem] ml-[5rem]">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-xl text-lg">
                        <thead className="bg-[#b83216] rounded-t-lg">
                            <tr>
                                <th className="py-4 px-6 text-left font-semibold text-white uppercase tracking-wider border-b border-gray-200 shadow-md">ID</th>
                                <th className="py-4 px-6 text-left font-semibold text-white uppercase tracking-wider border-b border-gray-200 shadow-md">Username</th>
                                <th className="py-4 px-6 text-left font-semibold text-white uppercase tracking-wider border-b border-gray-200 shadow-md">Email</th>
                                <th className="py-4 px-6 text-left font-semibold text-white uppercase tracking-wider border-b border-gray-200 shadow-md">Firstname</th>
                                <th className="py-4 px-6 text-left font-semibold text-white uppercase tracking-wider border-b border-gray-200 shadow-md">Lastname</th>
                                <th className="py-4 px-6 text-left font-semibold text-white uppercase tracking-wider border-b border-gray-200 shadow-md">Role</th>
                                <th className="py-4 px-6 text-left font-semibold text-white uppercase tracking-wider border-b border-gray-200 shadow-md">Age</th>
                                <th className="py-4 px-6 text-left font-semibold text-white uppercase tracking-wider border-b border-gray-200 shadow-md">Birthdate</th>
                                <th className="py-4 px-6 text-left font-semibold text-white uppercase tracking-wider border-b border-gray-200 shadow-md">Generated AI Strats</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user, index) => (
                                <tr key={user.id} className={`${index % 2 === 0 ? 'bg-[#fff6d1]' : 'bg-white'} border-b border-gray-200`}>
                                    <td className="py-4 px-6 text-gray-800 border-b border-white">{user.id}</td>
                                    <td className="py-4 px-6 text-gray-800 border-b border-white">{user.username}</td>
                                    <td className="py-4 px-6 text-gray-800 border-b border-white">{user.email}</td>
                                    <td className="py-4 px-6 text-gray-800 border-b border-white">{user.firstname}</td>
                                    <td className="py-4 px-6 text-gray-800 border-b border-white">{user.lastname}</td>
                                    <td className="py-4 px-6 text-gray-800 border-b border-white">{user.role}</td>
                                    <td className="py-4 px-6 text-gray-800 border-b border-white">{user.age}</td>
                                    <td className="py-4 px-6 text-gray-800 border-b border-white">{user.birthdate ? new Date(user.birthdate).toLocaleDateString() : 'N/A'}</td>
                                    <td className="py-4 px-6 text-gray-800 border-b border-white">{user.generatedAiStrats}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center text-gray-600 text-xl">No users found.</div>
            )}
        </div>
    );
};
    
export default AdminListOfUser;