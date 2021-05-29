import React, { useState, useEffect } from "react";
 
 const Flask  = ({}) => {
     
    const adduser = (flag) => {
        //get weights to use in the model
        getWeights();
        if (flag === 0) {
          //FOR feedback
          if (role == "student") {
            //setOrthStats(orthPercentage);
            //setGramStats(gramPercentage);
            //setStiStats(stiPercentage);
          }
          if (weightSpell === 0 && weightPunc === 0 && weightGram === 0) {
            //IF the user enter for he first time we need to give the model he average of each weight
            getTotalAverageOfWeights();
          }
        } else {
          if (role && currUser) {
            if (role == "student") {
              //let orthPercentage = computeErrorPercentage(wordCount, countOrth);
              //let gramPercentage = computeErrorPercentage(wordCount, countGram);
              //let stiPercentage = computeErrorPercentage(wordCount, countSti);
              //setOrthStats(orthPercentage);
              //setGramStats(gramPercentage);
              //setStiStats(stiPercentage);
            }
          }
        }
      };

 //Get weights for a specific user
 const getWeights = () => {
    fetch(`http://127.0.0.1:5000/weights/by/${role}/${currUser}`)
      .then((res) => res.json())
      .then((data) => {
        let json_obj = JSON.parse(JSON.stringify(data));

        setWeightSpell(json_obj[0].spelling_w);
        setWeightGram(json_obj[0].grammar_w);
        setWeightPunc(json_obj[0].punctuation_w);
      });
  };
  


//Get total average of weights If the user enters for he first time
const getTotalAverageOfWeights = () => {
    let w1 = 0,w2 = 0,w3 = 0, count = 0;
    fetch(`http://127.0.0.1:5000/test/route`)
      .then((res) => res.json())
      .then((data) => {
        let json_obj = JSON.parse(JSON.stringify(data));
        /*setWeightSpell(json_obj[0].spelling_w);
        setWeightGram(json_obj[0].grammar_w);
        setWeightPunc(json_obj[0].punctuation_w);
        w1 = json_obj[0].spelling_w;
        w2 = json_obj[0].grammar_w;
        w3 = json_obj[0].punctuation_w;*/
        json_obj.map((x) => {
          w1 = w1 + x.w1;
          w2 = w2 + x.w2;
          w3 = w3 + x.w3;
          count = count + 1;
        });
        if (count !== 0) {
          w1 = w1 / count;
          w2 = w2 / count;
          w3 = w3 / count;
        }
        assignUserWeight(w1, w2, w3);
      });
  };

  const assignUserWeight = (w1, w2, w3) => {
    fetch(
      `http://127.0.0.1:5000/add/user/weights/${role}/${currUser}/${w1}/${w2}/${w3}`,
      {
        method: "POST",
      }
    ).then((results) => console.log(results));
  };

};

export default Flask;