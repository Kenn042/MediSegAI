"use client";
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState<any>(null);

  const analyze = async () => {
    const res = await axios.post("http://localhost:5000/api/analyze");
    setResult(res.data);
  };

  return (
    <div style={{ background: "#0a0f1c", color: "white", minHeight: "100vh", padding: "50px" }}>
      <h1>MediSeg AI</h1>
      <p>Detect Cancer Before It Becomes Visible</p>

      <button onClick={analyze} style={{ padding: "10px 20px", marginTop: "20px" }}>
        Run AI Demo
      </button>

      {result && (
        <div style={{ marginTop: "30px" }}>
          <h2>Risk Score: {result.riskScore}%</h2>
          <p>Confidence: {result.confidence}</p>
          <p>{result.report}</p>
        </div>
      )}
    </div>
  );
}
