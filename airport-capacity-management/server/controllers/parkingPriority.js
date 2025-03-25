const db = require('../models/db');

exports.updateParkingPriorities = (req, res)=>{
  const updates = req.body;

  if (!Array.isArray(updates) || updates.length === 0){
    return res.status(400).json({error: "No data provided."});
  }

  const prioritySet = new Set();
  for (let update of updates){
    if (prioritySet.has(update.priority)){
      return res.status(400).json({
        error: "Duplicate priorities found. Please ensure each FBO has a unique priority."
      });
    }
    prioritySet.add(update.priority);
  }

  const updateQueries = updates.map((update) =>{
    return new Promise((resolve, reject) =>{
      const query = "UPDATE airport_parking SET Priority = ? WHERE id = ?";
      db.query(query, [update.priority, update.id], (err, results) =>{
        if (err){
          return reject(err);
        }
        resolve(results);
      });
    });
  });

  Promise.all(updateQueries)
    .then(() =>{
      res.status(200).json({message: "Priorities updated successfully."});
    })
    .catch((error) =>{
      console.error("Error updating parking priorities:", error);
      res.status(500).json({error: "Error updating parking priorities."});
    });
}
