import React, { useState, useEffect } from "react";
import RealTimeClock from './realTimeClock';

function Card({ title, value }) {
  
  return (
    <div className="card">
      <h3>{title}</h3>
      <h2>{value}</h2>
      <h4><RealTimeClock /></h4>
    </div>
  );
}

export default Card;
