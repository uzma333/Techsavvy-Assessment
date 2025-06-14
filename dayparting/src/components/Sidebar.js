import { NavLink } from "react-router-dom";
import { FiGrid, FiLogOut } from "react-icons/fi";
import { useState } from "react";
import techsavvyimag from "../assets/techsavvyimg.jpg"

const Sidebar = ({ onLogout }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div
        className="fixed top-1/2 -translate-y-1/2 left-0 z-50 bg-purple-600 text-white p-3 rounded-r cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
      >
        <FiGrid size={20} />
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white text-black shadow-lg z-40 transition-transform duration-300
          ${isHovered ? "translate-x-0" : "-translate-x-full"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-6 font-bold text-xl border-b border-gray-200 flex items-center gap-2">
          <img
            src={techsavvyimag}
            alt="Logo"
            className="w-10 h-10"
          />
          TECHSAVVY
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 ${
                isActive ? "bg-purple-100 text-purple-700 font-semibold" : ""
              }`
            }
          >
            <FiGrid /> Dashboard
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;