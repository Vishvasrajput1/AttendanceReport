import React, { useEffect, useState, useMemo } from "react";
import moment from "moment";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import Popup from "reactjs-popup";
import { FaArrowUp } from "react-icons/fa6";
import { FaArrowDown } from "react-icons/fa6";
import { Range } from "react-range";
import PopupComponent from "./PopupComponent";
import TimeLine from "./TimeLine";

const AttendanceTable = () => {
  const [showTimeline, setShowTimeline] = useState(false);
  const exampleData = [
    {
      date: "27-08-2016",
      inOut: [
        { type: "in", time: "09:30" },
        { type: "out", time: "10:10" },
        { type: "in", time: "10:30" },
        { type: "out", time: "13:10" },
        { type: "in", time: "13:50" },
        { type: "out", time: "16:10" },
        { type: "in", time: "16:20" },
        { type: "out", time: "19:10" },
      ],
    },
    {
      date: "26-08-2016",
      inOut: [
        { type: "in", time: "09:40" },
        { type: "out", time: "10:10" },
        { type: "in", time: "10:30" },
        { type: "out", time: "13:10" },
        { type: "in", time: "13:50" },
        { type: "out", time: "16:10" },
        { type: "in", time: "16:20" },
        { type: "out", time: "20:10" },
      ],
    },
    {
      date: "25-08-2016",
      inOut: [
        { type: "in", time: "09:52" },
        { type: "out", time: "10:17" },
        { type: "in", time: "10:34" },
        { type: "in", time: "10:36" },
        { type: "out", time: "10:46" },
        { type: "out", time: "13:15" },
        { type: "in", time: "13:57" },
        { type: "out", time: "16:15" },
        { type: "in", time: "16:40" },
        { type: "out", time: "20:35" },
      ],
    },
  ];
  // useEffect(() => {
  //   exampleData.map((data)=>{
  //     // console.log(data);
  //     // console.log("ps","10:30");
  //     calculateHours(data.inOut)
  //   })

  // }, [])

  const timeToMinutes = (time) => {
    const parts = time.split(":");
    const h = Number(parts[0]);
    const m = Number(parts[1]);
    return h * 60 + m;
  };
  const minutesToHM = (minute) => {
    const h = Math.floor(minute / 60);
    const m = minute % 60;
    //  if(h>0 && m>0){
    //     return `${h}h ${m}m`
    //  }
    //  if(h>0) return `${h}h`
    //  if(m>0) return `${m}m`
    return `${h}h ${m}m`;
  };

  const convertTo12HourFormat = (time) => {
    if (time == "Missing") {
      return time;
    }
    const [hours, minutes] = time.split(":");
    const period = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12;
    return `${adjustedHours}:${minutes} ${period}`;
  };

  const formatDate = (date) => {
    const dateData = date.split("-");
    const d = new Date(dateData[2], dateData[1] - 1, dateData[0]);
    //   console.log(d);

    const weekDay = d.toLocaleString("en-US", { weekday: "short" });
    const monthName = d.toLocaleString("en-US", { month: "short" });
    return `${weekDay} ${dateData[0]} , ${monthName}`;
    // return "hi"
  };

  const calculateHours = (inOut) => {
    if (!inOut || inOut.length == 0) {
      return {
        effctive: "0m",
        breakHours: "0m",
        gross: "0m",
      };
    }
    let effectiveHours = 0;
    let grossHours = 0;
    // let lastOut = 0;
    let breakHours = 0;
    let notes = [];
    let newInOut = [];

    const sorted = [...inOut].sort((a, b) => {
      return timeToMinutes(a.time) - timeToMinutes(b.time);
    });
    // const newArr = [];
    // const index = sorted.findIndex((value, index, array) => {
    //     console.log("idexarr",value.type == 'in' && (index < array.length && array[index + 1].type == "in"));

    //   return ((value.type == 'in' && (index < array.length && array[index + 1].type == "in")) || (value.type == 'out' && (index < array.length-1 && array[index + 1].type == 'out'))) ;
    // });
    // console.log("index",index);

    for (let i = 0; i < sorted.length; i++) {
      let inTime = sorted[i];

      if (i + 1 > sorted.length) {
        break;
      }

      let outTime = sorted[i + 1];

      if (inTime?.type == "in") {
        if (outTime?.type == "out") {
          effectiveHours +=
            timeToMinutes(outTime.time) - timeToMinutes(inTime.time);
          newInOut.push({ in: inTime.time, out: outTime.time });
          i++;
        } else {
          notes.push(`out is mising after ${inTime.time}`);
          newInOut.push({ in: inTime.time, out: "Missing" });
        }
      } else if (inTime.type === "out") {
        notes.push(`in is mising befor ${inTime.time}`);
        newInOut.push({ in: "Missing", out: inTime.time });
      }
    }

    for (let i = 0; i < newInOut.length - 1; i++) {
      if (newInOut[i + 1]?.out !== "Missing" && newInOut[i]?.in !== "Mising") {
        breakHours +=
          timeToMinutes(newInOut[i + 1]?.in) - timeToMinutes(newInOut[i]?.out);
      }
    }

    if (!grossHours && !breakHours) {
      const firstIn = sorted.find((value) => value.type == "in");
      const lastOut = sorted.reverse().find((value) => value.type == "out");

      grossHours = timeToMinutes(lastOut.time) - timeToMinutes(firstIn.time);
      breakHours = grossHours - effectiveHours;
    } else {
      grossHours = effectiveHours + breakHours;
    }

    // console.log("gross",minutesToHM(effectiveHours+breakHours));
    // console.log("effective",minutesToHM(effectiveHours));
    // console.log("break",minutesToHM(breakHours));
    // console.log("notes", notes);
    // console.log("newInOut", newInOut);

    return {
      gross: minutesToHM(grossHours),
      breakHours: minutesToHM(breakHours),
      effective: minutesToHM(effectiveHours),
      progressVal: (effectiveHours / grossHours) * 100,
      newInOut: newInOut,
    };
  };
  return (
    <div className="content" id="content">
      <table id="dataTable">
        <thead>
          <tr>
            <th>No</th>
            <th>Date</th>
            <th>Attendance Visual</th>
            <th>Effective Hours</th>
            <th>Break Hours</th>
            <th>Gross Hours</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          {/* <tr>
                        <td colspan="3" class="loading">Loading data...</td>
                    </tr> */}

          {exampleData.map((data, index) => {
            const { effective, breakHours, gross, progressVal, newInOut } =
              calculateHours(data.inOut);

            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{formatDate(data.date)}</td>
                <td className="progress-cell">
                  <Popup
                    trigger={
                      <div className="timeline-div">
                        <div className="timeline-bar">
                          {Array.from({ length: 24 }, (_, index) => (
                            <span key={index} className="step">
                              |
                            </span>
                          ))}

                        
                          {newInOut.map((session, idx) => {
                            if (
                              session.in !== "Missing" &&
                              session.out !== "Missing"
                            ) {
                              const start =
                                (timeToMinutes(session.in) / (24 * 60)) * 100;
                              const end =
                                (timeToMinutes(session.out) / (24 * 60)) * 100;
                              const width = end - start;

                              return (
                                <span
                                  key={idx}
                                  className="work-block"
                                  style={{
                                    left: `${start}%`,
                                    width: `${width}%`,
                                  }}
                                ></span>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>

                      // <progress value={progressVal} max={100}></progress>
                    }
                    position="bottom center"
                  >
                    <PopupComponent InOut={newInOut} />
                  </Popup>
                  {/* <div></div> */}
                </td>
                <td>{effective || "0m"}</td>
                <td>{breakHours || "0m"}</td>
                <td>{gross || "0m"}</td>
                <td>
                  <button onClick={() => viewDetails(data)}>
                    View Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
