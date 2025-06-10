import React, { useEffect, useState } from "react";
import { formatValue, getRGBColor } from "../../utils/formatUtils";
import api from "../../services/apiservice";
import { format } from "date-fns";

// Time slots and day names
const hours = [
  "12am",
  "1am",
  "2am",
  "3am",
  "4am",
  "5am",
  "6am",
  "7am",
  "8am",
  "9am",
  "10am",
  "11am",
  "12pm",
  "1pm",
  "2pm",
  "3pm",
  "4pm",
  "5pm",
  "6pm",
  "7pm",
  "8pm",
  "9pm",
  "10pm",
  "11pm",
];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const metrics = ["Imp", "Clicks", "CPM"];

// Generates mock data
const generateMockData = () => {
  const data = {};
  hours.forEach((hour) => {
    data[hour] = {};
    days.forEach((day) => {
      data[hour][day] = {
        Imp: Math.floor(Math.random() * 10000000),
        Clicks: Math.floor(Math.random() * 60000),
        CPM: parseFloat((Math.random() * 100).toFixed(2)),
      };
    });
  });
  return data;
};

const getValueType = (metric) => {
  if (["CPM", "CPC"].includes(metric)) return "currency";
  if (metric === "CTR") return "percentage";
  return "number";
};

const HeatMap = ({
  useMockData,
  startDate,
  endDate,
  metrics: selectedMetrics = metrics,
}) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setData({});
      try {
        if (useMockData) {
          const mock = generateMockData();
          setData(mock);
          console.log("useMockData:", useMockData);
          console.log("metrics:", selectedMetrics);
        } else {
          const user = JSON.parse(localStorage.getItem("user"));
          if (!user?.token || !user?.identity) {
            console.warn("Missing user credentials.");
            return;
          }
          if (!Array.isArray(selectedMetrics) || selectedMetrics.length === 0) {
            console.warn("No metrics selected.");
            return;
          }

          const res = await api.post("/day-parting/heatmap-list", {
            startDate: format(startDate, "yyyy-MM-dd"),
            endDate: format(endDate, "yyyy-MM-dd"),
            metrics: selectedMetrics,
          });

          const structured = {};
          res.data.result.forEach((row) => {
            if (!structured[row.hour]) structured[row.hour] = {};
            if (!structured[row.hour][row.day])
              structured[row.hour][row.day] = {};
            structured[row.hour][row.day][row.metric] = row.value;
          });

          setData(structured);
        }
      } catch (error) {
        console.error("Error loading heatmap data:", error);
      }
    };

    fetchData();
  }, [useMockData, startDate, endDate, selectedMetrics]);

  return (
    <div className="p-4 bg-white rounded shadow overflow-auto">
      <h3 className="mb-2 font-semibold">Heat Map</h3>
      <h6 className="mb-4 font-extralight">
        Select hours to schedule Dayparting
      </h6>

      {!Object.keys(data).length ? (
        <div className="h-52 w-full rounded bg-slate-100 flex justify-center items-center text-sm text-slate-500">
          No data available!
        </div>
      ) : (
        <table className="min-w-[1200px] text-xs text-center border-collapse">
          <thead>
            <tr>
              <th className="p-2 border bg-gray-50"></th>
              {days.map((day) =>
                metrics.map((metric) => (
                  <th
                    key={`${day}-${metric}`}
                    className="p-2 border bg-gray-100 font-medium"
                  >
                    {day} <br />
                    <span className="text-gray-500 text-[11px]">{metric}</span>
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <tr key={hour}>
                <td className="p-2 border font-semibold text-left">{hour}</td>
                {days.map((day) =>
                  metrics.map((metric) => {
                    const val = data?.[hour]?.[day]?.[metric] ?? 0;
                    return (
                      <td
                        key={`${hour}-${day}-${metric}`}
                        className="p-1 border text-xs text-center text-black font-medium"
                        style={{
                          backgroundColor: getRGBColor(
                            metric,
                            val,
                            getValueType(metric)
                          ),
                        }}
                      >
                        {formatValue(val, getValueType(metric))}
                      </td>
                    );
                  })
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HeatMap;
