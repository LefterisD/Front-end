import React, { useState, useEffect } from "react";

const EssayCounter = ({ mistakes, role }) => {
  const [counter, setCounter] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [averageWords, setAverageWords] = useState(0);
  let content;
  const get_essay_count = () => {
    let curr_user = localStorage.getItem("uniqid");
    fetch(
      `http://127.0.0.1:5000/update_essay_count/user/${curr_user}/role/${role}`
    )
      .then((res) => res.json())
      .then((data) => {
        let json_obj = JSON.parse(JSON.stringify(data));
        setCounter(json_obj[0].essayCount);
        if (json_obj[0].essayCount >= 5) {
          getWordCount();
        }
      });
  };

  const getWordCount = () => {
    console.log("TESTTTTTTTTTTTTTTTT");
    fetch(`http://127.0.0.1:5000/getTotalWords`)
      .then((res) => res.json())
      .then((data) => {
        let json_obj = JSON.parse(JSON.stringify(data));
        setTotalWords(json_obj[0].averageWords);
        let temp_total_average = Math.floor(json_obj[0].averageWords / counter);
        setAverageWords(temp_total_average);
      });
  };

  const clear_data = () => {
    let curr_user = localStorage.getItem("uniqid");
    fetch(
      `http://127.0.0.1:5000/mistakes/delete_by_id/id/${curr_user}/role/${role}`,
      {
        method: "POST",
      }
    ).then((results) => console.log(results));
    window.location.reload();
  };

  useEffect(() => {
    get_essay_count();
  }, [mistakes]);

  if (role == "professor") {
    content = (
      <div className="upper-section">
        <div className="stat-cont">
          <h2>Αριθμός εκθέσων:</h2>
          <div className="number-wrapper">
            <p>{counter}</p>
          </div>
        </div>
        <div className="stat-cont">
          <h2>Μ.Ο λέξεων:</h2>
          <div className="number-wrapper">
            <p>{averageWords}</p>
          </div>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="upper-section">
        <h2>Διαγραφή δεδομένων</h2>
      </div>
    );
  }
  return (
    <div className="counter-wrapper">
      {content}
      <div className="lower-section">
        <button id="delete-all-data" onClick={clear_data}>
          Διαγραφή
        </button>
      </div>
    </div>
  );
};

export default EssayCounter;
