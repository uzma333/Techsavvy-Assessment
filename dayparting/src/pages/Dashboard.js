import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import LineChartContainer from "../components/LineChart";
import HeatMap from "../components/HeatMap";
import { useAuth } from "../context/Authcontext";
import DatePicker from "../components/DatePicker";
import { subDays } from "date-fns";

const Dashboard = () => {
  const { logout } = useAuth();
  const [useMockData, setUseMockData] = useState(true);
  
  const [{ startDate, endDate }, setDate] = useState({
    startDate: new Date(subDays(Date.now(), 7)),
    endDate: new Date(),
  });

  return (
    <div className="flex h-screen bg-slate-200 text-black">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-auto">
        <TopBar onLogout={logout} />

        <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          <DatePicker
            startDate={startDate}
            endDate={endDate}
            setDate={setDate}
          />
          <label className="flex items-center space-x-2 text-white">
    <input
      type="checkbox"
      checked={useMockData}
      onChange={(e) => setUseMockData(e.target.checked)}
      className="form-checkbox h-4 w-4 text-blue-500"
    />
    <span className="text-black">Use Mock Data</span>
  </label>
          <LineChartContainer startDate={startDate} endDate={endDate} useMockData={useMockData} />
          <HeatMap startDate={startDate} endDate={endDate} useMockData={useMockData} metrics={["Imp", "Clicks", "CPM"]} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
