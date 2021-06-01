import React, { useState, useEffect } from "react";

const EssayCounter = ({ mistakes, role, setEssayNum, wordsOrth }) => {
  const [averageGrade, setAverageGrade] = useState(0);
  const [counter2, setCounter2] = useState(0);
  const [essayNum, setEssays] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [averageWords, setAverageWords] = useState(0);
  let content;
  let counter = 0;

  const get_essay_count = () => {
    let curr_user = localStorage.getItem("uniqid");
    fetch(
      `http://127.0.0.1:5000/update_essay_count/user/${curr_user}/role/${role}`
    )
      .then((res) => res.json())
      .then((data) => {
        let json_obj = JSON.parse(JSON.stringify(data));
        //setCounter2(json_obj[0].essayCount);
        setEssayNum(json_obj[0].essayCount);
        setEssays(json_obj[0].essayCount);
        counter = json_obj[0].essayCount;
        if (json_obj[0].essayCount >= 0) {
          getWordCount();
        }
      });
  };

  const getWordCount = () => {
    fetch(`http://127.0.0.1:5000/getTotalWords`)
      .then((res) => res.json())
      .then((data) => {
        let json_obj = JSON.parse(JSON.stringify(data));
        setTotalWords(json_obj[0].averageWords);
        if (counter != 0) {
          let temp_total_average = Math.floor(
            json_obj[0].averageWords / counter
          );
          setAverageWords(temp_total_average);
        } else {
          setAverageWords(0);
        }
      });
  };

  const getGradeTA = () => {
    let user_id = localStorage.getItem("uniqid");
    fetch(`http://127.0.0.1:5000/essays/all/role/${role}/id/${user_id}`)
      .then((res) => res.json())
      .then((essays) => {
        let essay_data = JSON.parse(JSON.stringify(essays));
        let grade_counter = 0;
        essay_data.map((essay) => {
          grade_counter = grade_counter + parseInt(essay.grade);
        });
        console.log("ALL", grade_counter);
        console.log("counter", counter);
        let result = Math.floor(grade_counter / counter);
        if (counter !== 0) {
          setAverageGrade(result);
          setCounter2(counter);
        } else {
          setAverageGrade(0);
          setCounter2(counter);
        }
      });
  };

  useEffect(() => {
    get_essay_count();
    getGradeTA();
  }, [mistakes]);

  if (role == "professor") {
    content = (
      <div className="side-bar-info">
        <p id="side-bar-title">ΠΛΗΡΟΦΟΡΙΕΣ</p>
        <div className="upper-section">
          <div className="stat-cont">
            <h2>Αριθμός εκθέσεων:</h2>
            <div className="number-wrapper">
              <p>{essayNum}</p>
            </div>
          </div>
          <div className="stat-cont">
            <h2>Μ.Ο λέξεων:</h2>
            <div className="number-wrapper">
              <p>{averageWords}</p>
            </div>
          </div>
          <div className="stat-cont">
            <h2>Μ.Ο βαθμών:</h2>
            <div className="number-wrapper">
              <p>{averageGrade}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <div className="counter-wrapper">{content}</div>;
};

export default EssayCounter;
