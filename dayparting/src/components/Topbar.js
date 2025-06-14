import { FiMenu, FiX } from "react-icons/fi";

const TopBar = ({ onLogout, sidebarVisible, setSidebarVisible }) => {
  return (
    <header className="w-full bg-white shadow flex items-center justify-between px-6 py-3">
      {/* Toggle button for small screens */}
      <div className="flex items-center space-x-3">
        <button
          className="md:hidden bg-gray-900 text-white p-2 rounded"
          onClick={() => setSidebarVisible((prev) => !prev)}
        >
          {sidebarVisible ? <FiX /> : <FiMenu />}
        </button>
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      <button
        onClick={onLogout}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
};

export default TopBar;
