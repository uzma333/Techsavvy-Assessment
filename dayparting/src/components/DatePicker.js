import { format } from "date-fns";
import { useState } from "react";

const DatePicker = ({ startDate, endDate, setDate }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsVisible((prev) => !prev)}
        className="rounded border px-4 py-2 text-xs bg-slate-200 transition-colors duration-500 hover:bg-slate-300"
      >
        {format(startDate, "d MMM y")} - {format(endDate, "d MMM y")}
      </button>
      {isVisible && (
        <div className="bg-white rounded p-5 space-y-5 text-xs">
          <div className="flex gap-3 items-center">
            <label className="font-semibold" htmlFor="start-date">
              Start Date
            </label>
            <input
              id="start-date"
              className="rounded border px-4 py-2"
              type="date"
              onChange={(event) => {
                setDate((prev) => ({
                  ...prev,
                  startDate: new Date(event.target.value),
                }));
              }}
              value={format(startDate, "yyyy-MM-dd")}
            />
          </div>
          <div className="flex gap-3 items-center">
            <label className="font-semibold" htmlFor="end-date">
              End Date
            </label>
            <input
              id="end-date"
              className="rounded border px-4 py-2"
              type="date"
              onChange={(event) =>
                setDate((prev) => ({
                  ...prev,
                  endDate: new Date(event.target.value),
                }))
              }
              value={format(endDate, "yyyy-MM-dd")}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DatePicker;
