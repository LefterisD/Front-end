import React, { useState, useEffect } from "react";
import InputText from "./InputText";
import EssayCounter from "./EssayCounter";
import Charts from "./Charts";
import uniqid from "uniqid";

const StudentPage = ({ user }) => {
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
      />
      <EssayCounter mistakes={mistakesStudent} role={ROLE} />
      <div className="chart-section-title">
        <h1 className="title-chart">
          <span id="chart-span">Παρακάτω, </span> θα βρείτε στατιστικά για τα
          λάθη.{" "}
        </h1>
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
  );
};

export default StudentPage;
