import React from "react";
import "./ProjectView.css";

const ProjectView = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ display: "flex", flex: 1 }}>
        <button
          style={{ flex: 1, backgroundColor: "red", border: "none" }}
          onClick={() => {}}
        />
        <button
          style={{ flex: 1, backgroundColor: "green", border: "none" }}
          onClick={() => {}}
        />
      </div>
      <div style={{ display: "flex", flex: 1 }}>
        <button
          style={{ flex: 1, backgroundColor: "blue", border: "none" }}
          onClick={() => {}}
        />
        <button
          style={{ flex: 1, backgroundColor: "yellow", border: "none" }}
          onClick={() => {}}
        />
      </div>
    </div>
  );
};

export default ProjectView;