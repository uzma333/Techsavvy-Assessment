import { useCallback, useEffect, useState, Fragment } from 'react';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { TbLoader2 } from 'react-icons/tb';
import { FiRefreshCcw } from 'react-icons/fi';
import api from '../services/apiservice';

const Dropdown = ({ selectedMetrics, setSelectedMetrics }) => {
  const [data, setData] = useState([]);
  const [tempSelection, setTempSelection] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.post('/day-parting/DayPartingFilterList', {
        type: 'customizeMetrics',
      });

      setData(res.data.result);
      setSelectedMetrics(res.data.result.slice(0, 5).map((metric) => metric.code));
      setTempSelection(res.data.result.slice(0, 5).map((metric) => metric.code));
    } catch (err) {
      console.error('Error fetching filter list:', err);
      setError('Failed to fetch filter list');
    } finally {
      setIsLoading(false);
    }
  }, [setSelectedMetrics]);

  useEffect(() => {
    fetchData();
    setRetry(false);
  }, [fetchData, retry]);

  const handleCheckboxChange = (code) => {
    setTempSelection((prev) =>
      prev.includes(code)
        ? prev.filter((item) => item !== code)
        : [...prev, code]
    );
  };

  const handleApply = (close) => {
    setSelectedMetrics(tempSelection);
    close();
  };

  const handleCancel = (close) => {
    setTempSelection(selectedMetrics); // reset to last applied
    close();
  };

  if (isLoading) {
    return <TbLoader2 className="text-primary-100 animate-spin size-4" />;
  }

  if (error) {
    return (
      <div className="rounded-full px-4 py-2 flex items-center gap-2 text-xs text-red-500 bg-red-50">
        {error}
        <button title="Retry" onClick={() => setRetry(true)}>
          <FiRefreshCcw className="size-3" />
        </button>
      </div>
    );
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ close }) => (
        <>
          <MenuButton className="flex justify-center items-center w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-xs text-slate-500 shadow-sm hover:bg-gray-50 gap-2">
            Select Metrics
            <ChevronDownIcon className="size-4" />
          </MenuButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute right-0 z-10 mt-2 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-3 space-y-2 max-h-64 overflow-auto">
                {data.map((metric) => (
                  <MenuItem as="div" key={metric.code}>
                    <label className="flex items-center gap-2 text-xs hover:bg-gray-100 p-1 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempSelection.includes(metric.code)}
                        onChange={() => handleCheckboxChange(metric.code)}
                        className="accent-primary-100"
                      />
                      {metric.label}
                    </label>
                  </MenuItem>
                ))}
              </div>

              <div className="flex justify-between px-3 py-2 border-t">
                <button
                  className="text-xs text-gray-500 hover:text-black"
                  onClick={() => handleCancel(close)}
                >
                  Cancel
                </button>
                <button
                  className="text-xs text-blue-600 font-medium hover:text-blue-800"
                  onClick={() => handleApply(close)}
                >
                  Apply
                </button>
              </div>
            </MenuItems>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default Dropdown;