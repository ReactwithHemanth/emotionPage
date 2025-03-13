import React, { useEffect, useState } from "react";
import "./App.css";
import { analyzeEmotionWithGemini } from "./components/analyse";
import { TipDisplay } from "./components/tipDisplay";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
// import { ChatGoogleGenerativeAI } from "langchain/chat_models/google_generativeai";
const App = () => {
  // State for emotion scores
  const [happiness, setHappiness] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [anger, setAnger] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [motivation, setMotivation] = useState(5);
  const [tip, setTip] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("linear-gradient(135deg, #667eea, #764ba2)");
  const [activeTab, setActiveTab] = useState("tips"); // State for active tab
  const [emotionData, setEmotionData] = useState([]);
  const [showTip, setShowTip] = useState(false);
  // Dummy data for graph mode

  // Function to handle slider changes
  const handleSliderChange = (setter) => (e) => {
    setter(parseInt(e.target.value, 10));
  };

  // Function to generate and display the tip
  const generateTip = async () => {
    let newBackgroundColor = "";
    setShowTip(false);
    // Determine background color based on emotional scores
    if (happiness >= 7 && energy >= 7 && motivation >= 7) {
      newBackgroundColor = "linear-gradient(135deg, #ff9a9e, #fad0c4)"; // Bright and vibrant
    } else if (happiness <= 3 && anger >= 6 && anxiety >= 6 && motivation <= 3) {
      newBackgroundColor = "linear-gradient(135deg, #0f0c29, #302b63)"; // Dark and cool
    } else if (energy <= 4 && motivation <= 4) {
      newBackgroundColor = "linear-gradient(135deg, #c3cfe2, #f5f7fa)"; // Soft and muted
    } else if (anger >= 7) {
      newBackgroundColor = "linear-gradient(135deg, #ff416c, #ff4b2b)"; // Intense and energetic
    } else if (happiness >= 7 && anxiety <= 3) {
      newBackgroundColor = "linear-gradient(135deg, #76b852, #8DC26F)"; // Calm and joyful
    } else if (anxiety >= 7 && energy <= 3) {
      newBackgroundColor = "linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)"; // Tense and subdued
    } else if (motivation >= 7 && happiness >= 5 && energy >= 5) {
      newBackgroundColor = "linear-gradient(135deg, #f7971e, #ffd200)"; // Energizing and focused
    } else if (happiness <= 3 && anger >= 7) {
      newBackgroundColor = "linear-gradient(135deg, #232526, #414345)"; // Intense and conflicting
    } else if (happiness >= 4 && happiness <= 6 && energy >= 4 && energy <= 6 && anger >= 4 && anger <= 6 && anxiety >= 4 && anxiety <= 6 && motivation >= 4 && motivation <= 6) {
      newBackgroundColor = "linear-gradient(135deg, #bdc3c7, #2c3e50)"; // Neutral and harmonious
    } else {
      newBackgroundColor = "linear-gradient(135deg, #667eea, #764ba2)"; // Default
    }

    setBackgroundColor(newBackgroundColor);

    setIsLoading(true);
    try {
      const response = await analyzeEmotionWithGemini(happiness, energy, anger, anxiety, motivation);
      setTip(response);
      setShowTip(true);
      // Update historical emotion data
      const newDataPoint = {
        day: `Day ${emotionData.length + 1}`,
        happiness,
        energy,
        anger,
        anxiety,
        motivation,
      };
      setEmotionData([...emotionData, newDataPoint]);
    } catch (error) {
      console.error("Error generating tip:", error);
      setTip("Failed to generate a tip. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to calculate slider color based on value
  const getSliderColor = (value, emotion) => {
    switch (emotion) {
      case "happiness":
        return `hsl(${value * 10}, 100%, 50%)`; // Green to Yellow
      case "energy":
        return `hsl(${200 - value * 10}, 100%, 50%)`; // Blue to Cyan
      case "anger":
        return `hsl(0, ${value * 10}%, 50%)`; // Gray to Red
      case "anxiety":
        return `hsl(${270 - value * 5}, 100%, 50%)`; // Light Purple to Dark Purple
      case "motivation":
        return `hsl(${30 + value * 5}, 100%, 50%)`; // Light Orange to Bright Orange
      default:
        return "#ccc";
    }
  };

  // Update background color dynamically
  useEffect(() => {
    document.body.style.background = backgroundColor;
    // document.body.style.transition = "background 0.5s ease-in-out"; // Smooth transition
  }, [backgroundColor]);

  // Render content based on active tab
  const renderContent = () => {
    if (activeTab === "tips") {
      return (
        <>
          <div className="slider-container">
            <div className="slider">
              <label>Happiness: {happiness}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={happiness}
                onChange={handleSliderChange(setHappiness)}
                style={{
                  background: `linear-gradient(to right, ${getSliderColor(1, "happiness")}, ${getSliderColor(10, "happiness")})`,
                }}
              />
            </div>
            <div className="slider">
              <label>Energy: {energy}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={handleSliderChange(setEnergy)}
                style={{
                  background: `linear-gradient(to right, ${getSliderColor(1, "energy")}, ${getSliderColor(10, "energy")})`,
                }}
              />
            </div>
            <div className="slider">
              <label>Anger: {anger}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={anger}
                onChange={handleSliderChange(setAnger)}
                style={{
                  background: `linear-gradient(to right, ${getSliderColor(1, "anger")}, ${getSliderColor(10, "anger")})`,
                }}
              />
            </div>
            <div className="slider">
              <label>Anxiety: {anxiety}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={anxiety}
                onChange={handleSliderChange(setAnxiety)}
                style={{
                  background: `linear-gradient(to right, ${getSliderColor(1, "anxiety")}, ${getSliderColor(10, "anxiety")})`,
                }}
              />
            </div>
            <div className="slider">
              <label>Motivation: {motivation}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={motivation}
                onChange={handleSliderChange(setMotivation)}
                style={{
                  background: `linear-gradient(to right, ${getSliderColor(1, "motivation")}, ${getSliderColor(10, "motivation")})`,
                }}
              />
            </div>
          </div>
          <button className="generate-button" onClick={generateTip} disabled={isLoading}>
            {isLoading ? "Generating..." : "Get Productivity Tip"}
          </button>
          {showTip && tip && <TipDisplay tip={tip} />}
        </>
      );
    } else if (activeTab === "graph") {
      return (
        <div className="graph-container">
          <LineChart width={600} height={300} data={emotionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" color="red" />
            <YAxis color="white" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="happiness" stroke="#82ca9d" />
            <Line type="monotone" dataKey="energy" stroke="#8884d8" />
            <Line type="monotone" dataKey="anger" stroke="#ff7300" />
            <Line type="monotone" dataKey="anxiety" stroke="#ff0000" />
            <Line type="monotone" dataKey="motivation" stroke="#00ffff" />
          </LineChart>
        </div>
      );
    }
  };

  return (
    <div className="App">
      <h1>Emotion-Based Tips</h1>
      <h2>Make your day 1% better</h2>
      <div className="tab-navigation">
        <button className={`tab-button ${activeTab === "tips" ? "active" : ""}`} onClick={() => setActiveTab("tips")}>
          Tips
        </button>
        <button className={`tab-button ${activeTab === "graph" ? "active" : ""}`} onClick={() => setActiveTab("graph")}>
          Graph
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default App;
