import { Bell, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authStore } from "../stores/authStore";
import { userStore } from "../stores/userStore";

const NavbarEmployer = () => {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { notifications, clearNotifications, user, fetchNotifications } = authStore();
  const { searchUsers, users, isLoading, error } = userStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications([...notifications].reverse());
  }, [fetchNotifications, notifications]);

  const handleSearch = () => {
    if (query.trim()) {
      searchUsers(query);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleViewProfile = () => {
    navigate("/employer-profile");
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 shadow-lg relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/employer" className="text-2xl font-bold hover:text-gray-300 transition-colors">
          Employer Panel
        </Link>
        <div className="relative w-full max-w-screen-md mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none w-full focus:ring-2 focus:ring-blue-500 transition-all"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.trim()) {
                  searchUsers(e.target.value);
                }
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          {query && (
            <div className="absolute bg-gray-700 text-white w-full mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
              {isLoading && (
                <p className="text-gray-400 px-4 py-2">Searching...</p>
              )}
              {error && (
                <p className="text-red-500 px-4 py-2">Error: {error}</p>
              )}
              {users.length > 0 &&
                users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center px-4 py-2 hover:bg-gray-600 cursor-pointer rounded transition-colors"
                    onClick={() => handleUserClick(user._id)}
                  >
                    <img
                      src={user.profilePicture || "/avatar.png"}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <span>{user.fullName}</span>
                  </div>
                ))}
              {!isLoading && users.length === 0 && !error && (
                <p className="text-gray-400 px-4 py-2">No users found.</p>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDropdown}
            className="relative cursor-pointer hover:bg-gray-700 p-2 rounded-full transition-colors"
          >
            <Bell className="w-6 h-6" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 text-xs text-white px-1">
                {notifications.length}
              </span>
            )}
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
            <button onClick={handleViewProfile}>
              <img
                src={user.profilePicture || "avatar.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>

      {isDropdownOpen && (
        <div
          id="dropdownNotification"
          className="z-20 w-80 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-800 dark:divide-gray-700 absolute right-0 mt-2 mr-4 transform transition-all duration-300 ease-in-out"
        >
          <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white">
            Notifications
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700 overflow-y-auto max-h-60">
            {notifications.length > 0 ? (
              notifications.map((notif, index) => (
                <div
                  key={notif._id || index}
                  className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-full ps-3">
                    <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400 font-poppins">
                      {notif?.message || notif}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-sm text-gray-500 text-center">
                No new notifications
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <button
              onClick={() => {
                clearNotifications();
                setIsDropdownOpen(false);
              }}
              className="w-full py-2 text-center text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarEmployer;