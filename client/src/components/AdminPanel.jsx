import { useState } from 'react';
import { FiUsers, FiAlertCircle, FiUserCheck, FiSearch, FiEye, FiPause, FiTrash2, FiCheck, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Suspended', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  ];

  const complaints = [
    { id: 1, from: 'john@example.com', against: 'Property #123', message: 'The host was not responsive...', status: 'Pending' },
    { id: 2, from: 'jane@example.com', against: 'User: Robert Johnson', message: 'Inappropriate behavior...', status: 'Resolved' },
    { id: 3, from: 'mike@example.com', against: 'Property #456', message: 'The place was not clean...', status: 'Pending' },
  ];

  const hostRequests = [
    { id: 1, name: 'Alex Morgan', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', idCard: 'https://via.placeholder.com/150', date: '2023-05-15' },
    { id: 2, name: 'Sarah Williams', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', idCard: 'https://via.placeholder.com/150', date: '2023-05-18' },
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="flex items-center justify-center h-16 px-4 bg-indigo-600">
            <h1 className="text-white font-semibold text-xl">Admin Panel</h1>
          </div>
          <div className="flex flex-col flex-grow p-4 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-colors ${activeTab === 'users' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FiUsers className="mr-3" />
                Manage Users
              </button>
              <button
                onClick={() => setActiveTab('complaints')}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-colors ${activeTab === 'complaints' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FiAlertCircle className="mr-3" />
                Complaints
              </button>
              <button
                onClick={() => setActiveTab('hostRequests')}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full transition-colors ${activeTab === 'hostRequests' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FiUserCheck className="mr-3" />
                Host Requests
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-10">
        <button className="p-3 bg-indigo-600 text-white rounded-full shadow-lg">
          <FiUserCheck />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('users')}
                className={`p-2 rounded-md ${activeTab === 'users' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'}`}
              >
                <FiUsers />
              </button>
              <button
                onClick={() => setActiveTab('complaints')}
                className={`p-2 rounded-md ${activeTab === 'complaints' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'}`}
              >
                <FiAlertCircle />
              </button>
              <button
                onClick={() => setActiveTab('hostRequests')}
                className={`p-2 rounded-md ${activeTab === 'hostRequests' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'}`}
              >
                <FiUserCheck />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 md:mb-0">Manage Users</h2>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                            <FiEye className="inline" />
                          </button>
                          <button className="text-yellow-600 hover:text-yellow-900 mr-3">
                            <FiPause className="inline" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <FiTrash2 className="inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Complaints Tab */}
          {activeTab === 'complaints' && (
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Complaints</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Against</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {complaints.map((complaint) => (
                      <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.from}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.against}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{complaint.message}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${complaint.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {complaint.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                            <FiEye className="inline mr-1" /> View
                          </button>
                          <button className="text-green-600 hover:text-green-900 mr-3">
                            <FiCheck className="inline mr-1" /> Resolve
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <FiTrash2 className="inline mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Host Requests Tab */}
          {activeTab === 'hostRequests' && (
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Host Requests</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hostRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <img className="h-12 w-12 rounded-full" src={request.avatar} alt={request.name} />
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{request.name}</h3>
                        <p className="text-sm text-gray-500">Requested on: {request.date}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">ID Card Verification</h4>
                      <img className="h-32 w-auto rounded border border-gray-200" src={request.idCard} alt="ID Card" />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center">
                        <FiX className="mr-2" /> Reject
                      </button>
                      <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center">
                        <FiCheck className="mr-2" /> Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;