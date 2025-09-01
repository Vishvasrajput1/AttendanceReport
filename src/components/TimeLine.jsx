import React from 'react'

const TimeLine = (progressVal) => {
 
  return (
    <div className="timeline-div">
      <div className={`timeline-bar`}>
         {
         Array.from({ length: 40 }, (_, index) => (
         <span key={index} className={`step`}>{`|`}</span>
      ))
      }
      
      </div>
    </div>
  )
}

export default TimeLine
