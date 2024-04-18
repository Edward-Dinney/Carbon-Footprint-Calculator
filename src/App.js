import React, { useState, useEffect } from "react";
import './App.css';
import {climateStats} from './stats'; 
import vlow from './images/vlow.jpg';
import low from './images/low.jpg';
import avg from './images/avg.jpg';
import high from './images/high.jpg';
function App() {
  // State variables to store user inputs and calculated footprint
  const [values, setValues] = useState({
    electric: 0,
    gas: 0,
    oil: 0,
    car: 0,
    longflight: 0,
    shortflight: 0,
  }); 

  const [paper, setPaper] = useState(false);
  const [metal, setMetal] = useState(false);
  const [foot, setFoot] = useState(0);
   // useEffect hook to recalculate the carbon footprint whenever inputs change
  useEffect(() => {
    let total = Object.entries(values).reduce((acc, [key, value]) => {
      // Calculate total based on input values and predefined climate stats
      return acc + (Number(value) * (climateStats[key] || 1));
    }, 350);
    // Adjust total based on recycling paper and metal
    if (paper) {
      total -= climateStats.paper;
    }
    if (metal) {
      total -= climateStats.metal;
    }
    // Update the carbon footprint state
    setFoot(total);
  }, [values, paper, metal]);

  // Handler for changing input values
  const handleChange = (inputKey) => (event) => {
    const newValue = event.target.value;
    // Update state only if the new value is a number
    if (newValue === '' || /^[0-9\b]+$/.test(newValue)) {
      setValues(prevValues => ({
        ...prevValues,
        [inputKey]: newValue
      }));
    }
  };
  // Handler for changing checkbox states
  const handleCheckboxChange = (checkboxKey) => () => {
    if (checkboxKey === 'paper') {
      setPaper(prev => !prev);
    } else if (checkboxKey === 'metal') {
      setMetal(prev => !prev);
    }
  };
  // Questions for input fields
  const questions = {
    electric: "What is your monthly electric bill (in integer)?",
    gas: "What is your monthly gas bill (in integer)?",
    oil: "What is your monthly oil bill (in integer)?",
    car: "What is the yearly mileage on your car (in integer)?",
    longflight: "Number of long flights taken yearly (4 hrs or more)?",
    shortflight: "Number of short flights taken yearly (4 hrs or less)?",
  };
  // Function to determine which image to display based on the carbon footprint
  const getFootprintImage = () => {
    if(foot < 6000){
      return vlow;
    }
    else if(foot > 6000 && foot <= 15999){
      return low;
    }
    else if(foot > 16000 && foot <= 22000){
      return avg;
    }
    else{
      return high;
    }
  }

  return (
    <div className="form-container">
    <form className="form">
       {/* Map through each key in values to create input fields */}
      {Object.keys(values).map((key) => (
        <div key={key}>
          <label htmlFor={key}>{questions[key]}</label>
          <input id={key} type="text" value={values[key]} onChange={handleChange(key)} placeholder={`Enter ${key} usage`}/>
        </div>
      ))}
       {/* Checkbox inputs for paper and metal recycling */}
      <div>
        <label htmlFor="paper">
          Do you recycle paper?
          <input id="paper" type="checkbox" checked={paper} onChange={handleCheckboxChange('paper')}/>
        </label>
      </div>
      <div>
        <label htmlFor="metal">
          Do you recycle metal?
          <input id="metal" type="checkbox" checked={metal} onChange={handleCheckboxChange('metal')}/>
        </label>
      </div>
      {/* Display the carbon footprint status */}
      <div>
        Your carbon footprint is: 
        {foot < 6000 && " Very Low"}
        {foot > 6000 && foot <= 15999 && " Low"}
        {foot >= 16000 && foot <= 22000 && " Average"}
        {foot > 22000 && " High"}
      </div>
      {/* Display the image based on the carbon footprint */}
      <img src={getFootprintImage()} alt="Carbon Footprint Impact" />
    </form>
    </div>
  );
}

export default App;
