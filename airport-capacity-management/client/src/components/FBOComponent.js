import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Card, CardContent } from "./card";
import { getStatusClass } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import "../styles/SummaryPage.css";

export default function FBOSection({id}) {
  const [FBOList, setFBOList] = useState([]);
  const [isEditingFBO, setIsEditingFBO] = useState(false);
  const [originalPriorities, setOriginalPriorities] = useState([]);
  const navigate = useNavigate();

  const fetchFBOData = useCallback(() =>{
    axios
      .get(`http://localhost:5001/airports/getParkingCoordinates/${id}`)
      .then((response) => {
        const data = response.data;
        const fboData = data.map((lot) =>({
          id: lot.id,
          name: lot.FBO_Name,
          // Ensure parking_taken is capped at Total_Space
          parking_taken: Math.min(lot.Parking_Space_Taken, lot.Total_Space),
          total_parking: lot.Total_Space,
          status: "Open",
          priority: lot.Priority,
        }));
        setFBOList(fboData);
        if (isEditingFBO){
          setOriginalPriorities(fboData.map((fbo) => fbo.priority));
        }
      })
      .catch((error) =>{
        console.error("Error fetching FBO data >:(", error);
      });
  }, [id, isEditingFBO]);

  useEffect(() =>{
    fetchFBOData();
  }, [fetchFBOData]);

  const handleToggleEditFBO = () =>{
    if (isEditingFBO){
      const currentPriorities = FBOList.map((fbo) => fbo.priority);
      const uniquePriorities = new Set(currentPriorities);
      if (uniquePriorities.size !== currentPriorities.length){
        alert("There are duplicate priorities. Please ensure each FBO has a unique priority.");
        return;
      }
      const originalPayload = originalPriorities.join(",");
      const currentPayload = currentPriorities.join(",");
      if (originalPayload === currentPayload){
        setIsEditingFBO(false);
        return;
      }
      const payload = FBOList.map((fbo) =>({
        id: fbo.id,
        priority: fbo.priority,
      }));

      console.log("Updating with payload:", payload);

      axios
        .patch("http://localhost:5001/airportsPriority/updateParkingPriorities", payload)
        .then((response) =>{
          console.log("Priorities updated:", response.data.message);
          setIsEditingFBO(false);
          fetchFBOData();
        })
        .catch((error) =>{
          if (error.response) {
            console.error("Error updating priorities:", error.response.data);
          } else {
            console.error("Error updating priorities:", error.message);
          }
          alert("Error updating priorities >:(");
        });
    } else{
      setOriginalPriorities(FBOList.map((fbo) => fbo.priority));
      setIsEditingFBO(true);
    }
  };

  const handlePriorityChange = (index, newPriority) =>{
    setFBOList((prevFBOs) =>{
      const updatedFBOs = [...prevFBOs];
      updatedFBOs[index] ={
        ...updatedFBOs[index],
        priority: newPriority,
      };
      return updatedFBOs;
    });
  };

  const handleAddFBO = () =>{
    navigate(`/fboPage/${id}`);
  };

  const handleRemoveFBO = (fboId) =>{
    if (!window.confirm("Are you sure you want to remove this FBO?")){
      return;
    }
    axios
      .delete(`http://localhost:5001/airports/fbo/deleteFBO/${fboId}`)
      .then((response) => {
        console.log("FBO deleted:", response.data.message);
        axios
          .get(`http://localhost:5001/airports/getParkingCoordinates/${id}`)
          .then((response) => {
            const data = response.data;
            const fboData = data.map((lot) =>({
              id: lot.id,
              name: lot.FBO_Name,
              parking_taken: Math.min(lot.Parking_Space_Taken, lot.Total_Space),
              total_parking: lot.Total_Space,
              status: "Open",
              priority: lot.Priority,
            }));
            setFBOList(fboData);
            if (isEditingFBO){
              setOriginalPriorities(fboData.map((fbo) => fbo.priority));
            }
          })
          .catch((error) =>{
            console.error("Error re-fetching FBO data after deletion:", error);
          });
      })
      .catch((error) =>{
        console.error("Error deleting FBO:", error);
        alert("Error deleting FBO");
      });
  };

  return (
    <Card className="card-content flex-3">
      <CardContent>
        <div className="fbo-container">
          <div
            className="fbo-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h2>FBOs</h2>
            <button onClick={handleToggleEditFBO} className="edit-button">
              {isEditingFBO ? "Done" : "Edit"}
            </button>
          </div>
          <table className="info-table">
            <thead>
              <tr>
                <th>FBO</th>
                <th>Status</th>
                <th>Priority</th>
                {isEditingFBO && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {FBOList.map((fbo, index) => (
                <tr key={index}>
                  <td>{fbo.name}</td>
                  <td>
                    <span className={getStatusClass(fbo.parking_taken, fbo.total_parking)}>
                      {fbo.parking_taken}/{fbo.total_parking}
                    </span>
                  </td>
                  <td>
                    {isEditingFBO ? (
                      <select
                        value={fbo.priority}
                        onChange={(e) => handlePriorityChange(index, parseInt(e.target.value))}
                      >
                        {Array.from({ length: FBOList.length }, (_, i) => i + 1).map((val) => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    ) : (
                      fbo.priority
                    )}
                  </td>
                  {isEditingFBO && (
                    <td style={{ paddingRight: "10px" }}>
                      <button onClick={() => handleRemoveFBO(fbo.id)} className="fbo-action-button">
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {isEditingFBO && (
            <div style={{marginTop: "10px", textAlign: "center"}}>
              <button onClick={handleAddFBO} className="fbo-action-button">
                Add FBO
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
