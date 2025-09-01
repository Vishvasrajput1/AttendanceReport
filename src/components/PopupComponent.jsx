import React from "react";
import { FaArrowUp } from "react-icons/fa6";
import { FaArrowDown } from "react-icons/fa6";

const PopupComponent = ({ InOut }) => {
  const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours, 10);
    const period = h >= 12 ? "PM" : "AM";
    const adjustedHours = h % 12 || 12;
    return `${adjustedHours}:${minutes} ${period}`;
  };

  return (
    <div className="my-popup-content">
      <div className="timeline-popup popup-overlay parent">
        {InOut.map((entry, i) => (
          <React.Fragment key={i}>
            <div className="entry">
              <span><FaArrowDown color="green" /></span>
              <span>{entry.in === "Missing" ? "Missing" : convertTo12HourFormat(entry.in)}</span>
            </div>
            <div className="entry">
              <span><FaArrowUp color="red" /></span>
              <span>{entry.out === "Missing" ? "Missing" : convertTo12HourFormat(entry.out)}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PopupComponent;

