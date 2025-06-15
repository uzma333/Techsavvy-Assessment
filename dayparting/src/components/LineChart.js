import React, { useCallback, useEffect, useState } from "react";
import api from "../services/apiservice";
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
import Dropdown from "./Dropdown";
import { FiRefreshCcw } from "react-icons/fi";
import { format } from "date-fns";

// Chart Renderer
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

// Container
const LineChartContainer = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState(["CPC"]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await api.post("/day-parting/DayPartingPerformanceGraphList", {
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        metrics: selectedMetrics,
      });

      setData(res.data.result || []);
    } catch (err) {
      console.error("Error fetching performance chart:", err);
      setError("Failed to fetch performance graph data.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedMetrics, startDate, endDate]);

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