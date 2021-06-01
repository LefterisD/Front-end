import React, { useState, useEffect } from "react";
import FeedBack from "./FeedBack";

import {
  PieChart,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Pie,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8BD8BD", "#243665"];

const ProfGrade = ({
  mistakes,
  wordCountProf,
  role,
  user,
  flag,
  setFlag,
  countGram,
  countOrth,
  countSti,
  wordsOrth,
}) => {
  const [data, setData] = useState([]);
  const [grade, setGrade] = useState(0);
  //const [weightSpell, setWeightSpell] = useState(0);
  const [weightGram, setWeightGram] = useState(0);
  const [weightPunc, setWeightPunc] = useState(0);
  const [message, setMessage] = useState("");

  let content;

  const fillData = (grade) => {
    if (grade) {
      let temp_data = [
        {
          name: "Βαθμός",
          value: grade,
        },
        {
          name: "_",
          value: 20 - grade,
        },
      ];
      setData(temp_data);
    } else {
      let temp_data = [
        { name: "Βαθμός", value: 0 },
        { name: "", value: 0 },
      ];
      setData(temp_data);
    }
  };

  const findGrade = () => {
    if (mistakes.length !== 0) {
      //Essay grading
      compute_grade(0);
    } else {
      compute_grade(1);
    }
  };

  const compute_grade = (flag) => {
    if (flag === 0) {
      //Sydelestis 0-1 gia kathe kathgoria
      let orthPercentage = computeErrorPercentage(wordCountProf, countOrth);
      let gramPercentage = computeErrorPercentage(wordCountProf, countGram);
      let stiPercentage = computeErrorPercentage(wordCountProf, countSti);

      //Get weights to compute grade
      getWeights(orthPercentage, gramPercentage, stiPercentage);
    } else {
      addEssay(0, 0, 0, wordCountProf, 10);
    }
  };

  //compute coefficient fro ypes of mistakes
  const computeErrorPercentage = (wordCount, errors) => {
    let count_1 = wordCount - errors;
    return count_1 / wordCount;
  };

  const getWeights = (orthPercentage, gramPercentage, stiPercentage) => {
    console.log("MPIKES");
    fetch(`http://127.0.0.1:5000/weights/by/${role}/${user}`)
      .then((res) => res.json())
      .then((data) => {
        let weights = JSON.parse(JSON.stringify(data));

        let temp_grade =
          weights[0].spelling_w * orthPercentage +
          weights[0].grammar_w * gramPercentage +
          weights[0].punctuation_w * stiPercentage;

        temp_grade = Math.round(temp_grade * 10) / 10;

        console.log("DSDEWDEW", weights[0].spelling_w);

        fillData(temp_grade);
        setGrade(temp_grade);
        addEssay(countOrth, countGram, countSti, wordCountProf, temp_grade);
      });
  };

  const addEssay = (countOrth, countGram, countSti, wordCount, grade) => {
    fetch(
      `http://127.0.0.1:5000/essays/add/role/${role}/id/${user}/spelling/${countOrth}/grammar/${countGram}/puncutation/${countSti}/words/${wordCount}/${grade}`,
      {
        method: "POST",
      }
    ).then((results) => console.log(results));
  };

  const fixWeights = () => {
    setMessage(
      "Έγιναν κάποιες αλλαγές ώστε να βελτιωθεί ο τρόπος βαθμολόγησης!"
    );
    fetch(`http://127.0.0.1:5000/weights/update/${role}/${user}/no`, {
      method: "POST",
    }).then((results) => console.log(results));
  };
  const changeMessage = () => {
    setMessage(
      "Τέλεια! Το feedback σας βοηθάει την εφαρμογή να μάθει πιο γρήρορα."
    );
  };
  useEffect(() => {
    console.log("GRADE COUNT", countOrth);
    if (flag === false) {
      console.log("FALSE");
      setFlag(true);
    } else {
      findGrade();
    }
    setMessage("");
  }, [wordsOrth]);

  if (mistakes.length !== 0) {
    content = (
      <div className="grade_box">
        <p className="chart-title">Βαθμός:</p>
        <div className="grade_chart">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart width={500} height={180} id="pie-grade">
              <Pie
                data={data}
                startAngle={180}
                endAngle={0}
                innerRadius={65}
                outerRadius={85}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="grade-text">
            <p>
              {grade}
              <span id="grade-span">/20</span>
            </p>
          </div>
        </div>
        <div id="color-info">
          <span className="color-box">ΟΡΘΟΓΡΑΦΙΚΑ</span>
          <span className="color-box">ΣΤΙΞΗΣ</span>
          <span className="color-box">ΓΡΑΜΜΑΤΙΚΑ</span>
        </div>
        <div className="content_feedback">
          <p id="title">Ήταν ικανοποιητική η βαθμολόγηση;</p>
          <div className="weight_update_btns">
            <button className="weight_btn" onClick={changeMessage}>
              <i class="fa fa-thumbs-up thumb" aria-hidden="true"></i>
            </button>
            <button className="weight_btn" onClick={fixWeights}>
              <i class="fa fa-thumbs-down thumb" aria-hidden="true"></i>
            </button>
          </div>
          <div className="message_feedback">
            <p>{message}</p>
          </div>
        </div>
      </div>
    );
  } else {
    content = <div></div>;
  }
  return <div>{content}</div>;
};
export default ProfGrade;
