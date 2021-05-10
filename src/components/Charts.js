import React, { useEffect, useState } from "react";
import {
  BarChart,
  PieChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Pie,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#243665", "#8BD8BD", "#FFBB28"];

const Charts = ({
  countGram,
  countOrth,
  countSti,
  wordsOrth,
  wordsGram,
  mistakes,
}) => {
  const dataPie = [
    {
      name: "Ορθογραφικά Λάθη",
      pv: countOrth,
    },
    {
      name: "Λάθη Γραμματικης",
      pv: countGram,
    },
    {
      name: "Λάθη Στίξης",
      pv: countSti,
    },
  ];
  const dataBarGram = [];
  const [dataBarOrth, setDataBarOrth] = useState([]);

  /*const findWordsBarChar = (mistakes) => {
      //dataBarOrth = [];
      if (mistakes.length != 0) {
        //taksinomisi
        wordsOrth.sort(function (a, b) {
          return b.count - a.count;
        });
      }

      if (mistakes.length != 0) {
        //taksinomisi
        wordsGram.sort(function (a, b) {
          return b.count - a.count;
        });
      }

      if (mistakes.length != 0) {
        let counter = 0;
        wordsGram.map((word) => {
          if (counter < 5) {
            counter++;
            let newBarElement = {
              name: word.word,
              pv: word.count,
              amt: 2210,
            };
            dataBarGram.push(newBarElement);
          }
        });
      }
      if (mistakes.length != 0) {
        let counter = 0;
        wordsOrth.map((word) => {
          if (counter < 5) {
            counter++;
            let newBarElement = {
              name: word.word,
              pv: word.count,
              amt: 2210,
            };
            dataBarOrth.push(newBarElement);
          }
        });
      }
    };*/
  //Call it once when component mounts to create the database with 3 object-stores orth gram syntax
  const create_DB = () => {
    console.log("CREATE DB");
    let openRequest = indexedDB.open("Mistakes", 1);
    openRequest.onupgradeneeded = function () {
      let db = openRequest.result;
      //Each store object must a have a unique key set as the word itself
      console.log("CREATE db success");
      db.createObjectStore("Orth", { keyPath: "word" });
      db.createObjectStore("Gram", { autoIncrement: true });
      db.createObjectStore("Syntax", { autoIncrement: true });
    };
  };

  const Get_data = () => {
    let temp_data = [];
    let openRequest = indexedDB.open("Mistakes", 2);
    openRequest.onsuccess = function () {
      let db = openRequest.result;
      let transaction = db.transaction("Orth", "readonly");
      let orth_object_store = transaction.objectStore("Orth");

      orth_object_store.getAll().onsuccess = function (e) {
        let temp_arr = e.target.result;
        //console.log("TempArr", temp_arr);
        temp_arr.map((item) => {
          let temp_item = {
            name: item.word,
            pv: item.count,
            amt: 2210,
          };
          temp_data.push(temp_item);
          //dataBarOrth.push(temp_item);
        });
        //Sort data
        temp_data.sort(function (a, b) {
          return b.pv - a.pv;
        });
        //Show the 5 most frequent
        temp_data = temp_data.slice(0, 6);
        setDataBarOrth(temp_data);
        //return temp_data;
      };
    };
  };

  //Initialize indexedDB when the app opens for the first time
  useEffect(() => {
    create_DB();
  }, []);

  //console.log("Databarorth", dataBarOrth);

  return (
    <div className="section">
      {
        //findWordsBarChar(mistakes)
        Get_data()
      }
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          className="barchart"
          width={500}
          height={300}
          data={dataBarOrth}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="pv" fill="#243665" />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart width={500} height={300} className="donut">
          <Tooltip />
          <Legend verticalAlign="bottom" align="center" iconType="circle" />
          <Pie
            className="piechart"
            data={dataPie}
            nameKey="name"
            dataKey="pv"
            innerRadius="40%"
            outerRadius="80%"
            startAngle={90}
            endAngle={-270}
            fill="#243665"
          >
            {dataPie.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          className="barchart"
          width={500}
          height={300}
          data={dataBarGram}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="pv" fill="#8BD8BD" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;
