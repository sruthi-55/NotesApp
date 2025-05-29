import React from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarLayout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname.startsWith(path) ? "bg-gray-200" : "";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-gray-100 p-4">
        <h2 className="text-2xl font-bold mb-6">📝 My Notes</h2>
        <nav className="flex flex-col space-y-2">
          <Link
            to="/dashboard"
            className={`p-2 rounded hover:bg-gray-300 ${isActive("/dashboard")}`}>
            Dashboard 
          </Link>
          <Link
            to="/trash"
            className={`p-2 rounded hover:bg-gray-300 ${isActive("/trash")}`}>
            Trash 
          </Link>
          <Link
            to="/logout"
            className="p-2 rounded text-red-600 hover:bg-red-100">
            Logout
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-grow p-6">{children}</div>
    </div>
  );
};

export default SidebarLayout;
