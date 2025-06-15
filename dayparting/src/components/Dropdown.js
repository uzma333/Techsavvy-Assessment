import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import api from "../services/apiservice";

const Dropdown = ({ selectedMetrics, setSelectedMetrics }) => {
  const [tempSelected, setTempSelected] = useState(selectedMetrics);
  const [metricsList, setMetricsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTempSelected(selectedMetrics);
  }, [selectedMetrics]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const res = await api.post("/day-parting/DayPartingFilterList", {
          type: "customizeMetrics",
        });
        setMetricsList(res.data.result || []);
        console.log(res.data.result)
      } catch (err) {
        console.error("Failed to fetch metric list:", err);
        setMetricsList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const toggleMetric = (metric) => {
    setTempSelected((prev) =>
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
    );
  };

  const handleApply = (close) => {
    setSelectedMetrics(tempSelected);
    close();
  };

  const handleCancel = (close) => {
    setTempSelected(selectedMetrics);
    close();
  };

  return (
    <div className="flex justify-end">
      <Menu as="div" className="relative inline-block text-left">
        {({ close }) => (
          <>
            <Menu.Button className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              Select Metrics
              <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-3 space-y-2 max-h-64 overflow-auto">
                  {loading ? (
                    <div className="text-sm text-gray-400 text-center">Loading...</div>
                  ) : metricsList.length === 0 ? (
                    <div className="text-sm text-red-500 text-center">No metrics found</div>
                  ) : (
                    metricsList.map((metric) => (
                      <Menu.Item key={metric}>
                        {() => (
                          <label className="flex items-center gap-2 cursor-pointer text-sm hover:bg-gray-100 p-1 rounded">
                            <input
                              type="checkbox"
                              checked={tempSelected.includes(metric)}
                              onChange={() => toggleMetric(metric)}
                              className="accent-blue-500"
                            />
                            {metric}
                          </label>
                        )}
                      </Menu.Item>
                    ))
                  )}

                  <div className="flex justify-between gap-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => handleCancel(close)}
                      className="w-1/2 py-1 text-sm text-gray-500 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleApply(close)}
                      className="w-1/2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
};

export default Dropdown;