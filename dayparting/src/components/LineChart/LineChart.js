import React, { useCallback, useEffect, useState } from "react";
import api from "../../services/apiservice";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Dropdown from "../Dropdown/Dropdown";
import { FiRefreshCcw } from "react-icons/fi";
import { format } from "date-fns";

// Mock Data
const MOCK_DATA = [
  { date: "0 Hr", Spend: 1500, Revenue: 2200, Clicks: 100, CPM: 60, CTR: 0.08, CPC: 12 },
   { date: "2 Hr", Spend: 1800, Revenue: 2400, Clicks: 110, CPM: 65, CTR: 0.10, CPC: 11 },
   { date: "4 Hr", Spend: 1400, Revenue: 2100, Clicks: 90, CPM: 55, CTR: 0.07, CPC: 10 },
   { date: "6 Hr", Spend: 1700, Revenue: 2300, Clicks: 105, CPM: 62, CTR: 0.09, CPC: 11 },
   { date: "8 Hr", Spend: 1600, Revenue: 2000, Clicks: 95, CPM: 58, CTR: 0.11, CPC: 9 },
   { date: "10 Hr", Spend: 1900, Revenue: 2500, Clicks: 120, CPM: 70, CTR: 0.12, CPC: 10 },
   { date: "12 Hr", Spend: 1300, Revenue: 1800, Clicks: 85, CPM: 50, CTR: 0.06, CPC: 8 },
 ];

//  Chart Renderer
const LineChart = ({ isLoading, data, selectedMetrics, error, setRetry }) => {
  if (error) {
    return (
      <div className="h-52 w-full rounded text-red-500 bg-red-50 flex items-center justify-center flex-col gap-2 text-xs">
        {error}
        <button onClick={() => setRetry(true)}>
          <FiRefreshCcw />
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="h-52 w-full rounded bg-slate-100 animate-pulse"></div>;
  }

  if (!selectedMetrics.length) {
    return (
      <div className="h-52 w-full rounded bg-slate-100 flex justify-center items-center text-sm text-slate-500">
        Please select a metric
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="h-52 w-full rounded bg-slate-100 flex justify-center items-center text-sm text-slate-500">
        No data available!
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReLineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray="3 3" />
        {selectedMetrics.map((metric, idx) => (
          <Line
            key={metric}
            type="monotone"
            dataKey={metric}
            stroke={["#6366f1", "#14b8a6", "#8b5cf6", "#f59e0b", "#ef4444"][idx % 5]}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        ))}
      </ReLineChart>
    </ResponsiveContainer>
  );
};

// Container with logic
const LineChartContainer = ({ startDate, endDate, useMockData }) => {
  const [data, setData] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState(["CPC"]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (useMockData) {
        setData(MOCK_DATA);
        return;
      }

      const res = await api.post("/day-parting/DayPartingPerformanceGraphList", {
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        metrics: selectedMetrics,
      });

      setData(res.data.result);
    } catch (err) {
      console.error("Error fetching performance chart:", err);
      setError("Failed to fetch performance graph list");
    } finally {
      setIsLoading(false);
    }
  }, [useMockData, selectedMetrics, startDate, endDate]);

  useEffect(() => {
    fetchData();
    setRetry(false);
  }, [fetchData, retry]);

  return (
    <div className="p-5 bg-white rounded shadow space-y-3">
      <header className="flex justify-between items-center">
        <h3 className="font-semibold text-xl">Performance Chart</h3>
        <Dropdown
          selectedMetrics={selectedMetrics}
          setSelectedMetrics={setSelectedMetrics}
        />
      </header>
      <h6 className="font-extralight text-sm">
        Key Metrics for Dayparting schedule Performance Evaluation
      </h6>
      <LineChart
        data={data}
        isLoading={isLoading}
        selectedMetrics={selectedMetrics}
        error={error}
        setRetry={setRetry}
      />
    </div>
  );
};

export default LineChartContainer;
