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

const Grade = ({
  orthStats,
  gramStats,
  stiStats,
  mistakes,
  grade,
  role,
  user,
}) => {
  const [orthComments, setOrthComments] = useState("");
  const [gramComments, setGramComments] = useState("");
  const [stiComments, setStiComments] = useState("");
  const [data, setData] = useState([]);

  const [feedBackOrth, setFeedBackOrth] = useState("");
  const [feedBackGram, setFeedBackGram] = useState("");
  const [feedBackSti, setFeedBackSti] = useState("");

  const fillData = () => {
    if (grade) {
      let temp_data = [
        {
          name: "Βαθμός",
          value: grade,
        },
        {
          name: "_",
          value: 10 - grade,
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
  console.log("COMMENTS", feedBackOrth);
  console.log("COMMENTS", feedBackGram);
  console.log("COMMENTS", feedBackSti);
  useEffect(() => {
    fillData();
  }, [mistakes, grade]);
  return (
    <div className="grade_box">
      <FeedBack
        orthStats={orthStats}
        gramStats={gramStats}
        stiStats={stiStats}
        mistakes={mistakes}
        role={role}
        user={user}
        setFeedBackOrth={setFeedBackOrth}
        setFeedBackGram={setFeedBackGram}
        setFeedBackSti={setFeedBackSti}
        grade={grade}
      />
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
            <span id="grade-span">/10</span>
          </p>
        </div>
      </div>
      <div className="content_feedback">
        <p id="title">Σχόλια:</p>
        <div className="comments">
          <div className="comment-wrapper">
            <p className="comment">{feedBackOrth}</p>
          </div>
          <div className="comment-wrapper">
            <p className="comment">{feedBackGram}</p>
          </div>
          <div className="comment-wrapper">
            <p className="comment">{feedBackSti}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Grade;
