import React, { useState, useEffect } from "react";
import InputText from "./InputText";
import EssayCounter from "./EssayCounter";
import MoreInfo from "./MoreInfo";
import Charts from "./Charts";
import ChartOne from "./ChartOne";
import uniqid from "uniqid";
import FeedBack from "./FeedBack";
import Grade from "./Grade";

const StudentPage = ({ user, change }) => {
  const [wordsToHighlightStudent, setWordsToHighlightStudent] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [wordsToHighlight, setWordsToHighlight] = useState([]);
  const [countOrth, setcountOrth] = useState(0);
  const [countGram, setcountGram] = useState(0);
  const [countSti, setcountSti] = useState(0);
  const [wordsOrth, setWordsOrth] = useState([]);
  const [wordsGram, setWordsGram] = useState([]);
  const [userName, setUserName] = useState("");
  const [mistakesStudent, setMistakesStudent] = useState([]);
  const [inputTextStudent, setInputTextStudent] = useState("");
  const [studentUser, setStudentUser] = useState("");
  const [userFilledInfo, setUserFilledInfo] = useState("");

  const [orthStats, setOrthStats] = useState(0);
  const [gramStats, setGramStats] = useState(0);
  const [stiStats, setStiStats] = useState(0);

  //feedback

  const [grade, setGrade] = useState(0);

  const ROLE = "student";
  const getMistakesStudent = (e) => {
    e.preventDefault();

    fetch(` http://127.0.0.1:5000/api/v1/check/${inputTextStudent}`)
      .then((res) => res.json())
      .then((data) => {
        var json_obj = JSON.parse(JSON.stringify(data));
        setMistakesStudent(json_obj.matches);
      });

    update_essay_count();
  };

  const update_essay_count = () => {
    let curr_user = localStorage.getItem("uniqid");
    fetch(
      `http://127.0.0.1:5000/update_essay_count/user/${curr_user}/role/${ROLE}`,
      {
        method: "POST",
      }
    ).then((results) => console.log(results));
  };

  //Sends a POST request to our users api to insert new user into the DB
  const addUser = (id) => {
    fetch(`http://127.0.0.1:5000/user/${ROLE}/${id}`, {
      method: "POST",
    }).then((results) => console.log(results));
  };
  //Delete all mistakes from database
  const clear_data = () => {
    let curr_user = localStorage.getItem("uniqid");
    fetch(
      `http://127.0.0.1:5000/mistakes/delete_by_id/id/${curr_user}/role/${ROLE}`,
      {
        method: "POST",
      }
    ).then((results) => console.log(results));
    window.location.reload();
  };

  useEffect(() => {
    let stored_id = localStorage.getItem("uniqid");
    if (stored_id) {
      setStudentUser(stored_id);
    } else {
      let uniid = uniqid();
      localStorage.setItem("uniqid", uniid);
    }
  }, []);

  useEffect(() => {
    let stored_id = localStorage.getItem("uniqid");
    if (stored_id) {
      setStudentUser(stored_id);
      addUser(stored_id);
    }
  }, []);

  useEffect(() => {
    let stored_userName = localStorage.getItem("userName");
    setUserName(stored_userName);
    let info = localStorage.getItem("info");
    if (localStorage.getItem("info")) {
      setUserFilledInfo(info);
    } else {
      localStorage.setItem("info", "none");
      setUserFilledInfo(localStorage.getItem("info"));
    }
  }, []);

  return (
    <div className="return">
      <div className="title-wrapper">
        <h1 className="title-prof">Καλώς όρισες {userName}</h1>
      </div>
      <InputText
        setInputText={setInputTextStudent}
        getMistakes={getMistakesStudent}
        mistakes={mistakesStudent}
        setWordsToHighlight={setWordsToHighlightStudent}
        setcountOrth={setcountOrth}
        countOrth={countOrth}
        setcountGram={setcountGram}
        countGram={countGram}
        setcountSti={setcountSti}
        countSti={countSti}
        setWordsOrth={setWordsOrth}
        wordsOrth={wordsOrth}
        setWordsGram={setWordsGram}
        wordsGram={wordsGram}
        user={user}
        role={ROLE}
        setOrthStats={setOrthStats}
        setGramStats={setGramStats}
        setStiStats={setStiStats}
        setGrade={setGrade}
      />

      <Grade
        orthStats={orthStats}
        gramStats={gramStats}
        stiStats={stiStats}
        mistakes={mistakesStudent}
        grade={grade}
        role={ROLE}
        user={user}
      />
      <MoreInfo info={userFilledInfo} role={ROLE} />
      <div className="chart_section">
        <div className="charts">
          <div className="chart-section-title">
            <h2 className="title-chart">
              Συνολικά στατιστικά <span id="chart-span">X </span>
              εκθέσεων
            </h2>
            <div className="delete-content">
              <p>Διαγραφή δεδομένων</p>
              <button onClick={clear_data}>Διαγραφή</button>
            </div>
          </div>
          <Charts
            countOrth={countOrth}
            countGram={countGram}
            countSti={countSti}
            wordsOrth={wordsOrth}
            wordsGram={wordsGram}
            mistakes={mistakesStudent}
            user={user}
            role={ROLE}
          />
        </div>
        <div className="charts">
          <div className="chart-section-title">
            <h2 className="title-chart" id="sec-title">
              Στατιστικά μιας έκθεσης
            </h2>
          </div>
          <ChartOne
            countOrth={countOrth}
            countGram={countGram}
            countSti={countSti}
            wordsOrth={wordsOrth}
            wordsGram={wordsGram}
            mistakes={mistakesStudent}
            user={user}
            role={ROLE}
            change={change}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
