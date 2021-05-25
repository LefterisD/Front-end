import React, { useState, useEffect } from "react";
import { HighlightWithinTextarea } from "react-highlight-within-textarea";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const InputText = ({
  setInputText,
  getMistakes,
  mistakes,
  setWordsToHighlight,
  setcountGram,
  countGram,
  setcountOrth,
  countOrth,
  setcountSti,
  countSti,
  setWordsOrth,
  setWordsGram,
  user,
  role,
  setOrthStats,
  setGramStats,
  setStiStats,
  setGrade,
}) => {
  //const [textareaValue, setTextareaValue] = useState("");
  const [textAreaInput, setTextAreaInput] = useState("");
  const [words_json, setWordsJson] = useState([]);
  //const [tooltipMessage, setTooltipMessage] = useState("");
  const [tooltipReplacements, setTooltipReplacements] = useState([]);
  const [characters, setCharacters] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [currUser, setCurrUser] = useState("");

  let words = [];
  let tooltipMessage = "";
  let tooltipshortMessage = "";
  let replacement_words = [];
  let fakeWordsOrth = [];
  let fakeWordsGram = [];

  //Fetching the api to insert into the db or update a specific word count
  const insert_to_database = (word, type, role) => {
    console.log(type);
    fetch(
      `http://127.0.0.1:5000/role/${role}/id/${currUser}/type/${type}/word/${word}`,
      {
        method: "POST",
      }
    ).then((results) => console.log(results));
  };
  //kossy wordCount
  const insert_count = (wordCount) => {
    fetch(`http://127.0.0.1:5000/mistakes/${wordCount}`, {
      method: "POST",
    }).then((results) => console.log(results));
  };

  const inputTextHandler = (e) => {
    let input_value = e.target.value;
    let char_count = input_value.length;
    let w_count = input_value.split(" ").length;

    setInputText(input_value);
    setTextAreaInput(input_value);
    setCharacters(char_count);
    setWordCount(w_count);
  };

  //vazei sto map tis lekseis kai to poses fores einai lathos
  const setOrthWords = (word) => {
    let counter = 0; // xrisimopoieite gia na elegxoume ama mia leksi uparxei idi mesa sto map
    if (fakeWordsOrth.length !== 0) {
      fakeWordsOrth.map((item) => {
        //console.log("Mpike sto map");
        if (item.word === word) {
          //console.log("Yparxei idia leksi",item.word);
          console.log("omoia", word);
          item.count = item.count + 1;
          counter = 1;
          insert_to_database(word, "spelling", role);
        }
      });
      if (counter === 0) {
        // console.log("DEn Yparxei i leksi");
        let newobject = {
          word: word,
          count: 1,
        };
        fakeWordsOrth.push(newobject);
        insert_to_database(word, "spelling", role);
      }
    } else {
      //console.log(" pinakas kenos");
      let newobject = {
        word: word,
        count: 1,
      };
      fakeWordsOrth.push(newobject);
      insert_to_database(word, "spelling", role);
    }
    setWordsOrth(fakeWordsOrth);
  };

  const setGramWords = (word) => {
    let counter = 0; // xrisimopoieite gia na elegxoume ama mia leksi uparxei idi mesa sto map
    if (fakeWordsGram.length !== 0) {
      fakeWordsGram.map((item) => {
        //console.log("Mpike sto map");
        if (item.word === word) {
          //console.log("Yparxei idia leksi",item.word);
          item.count = item.count + 1;
          counter = 1;
          insert_to_database(word, "grammar", role);
        }
      });
      if (counter === 0) {
        // console.log("DEn Yparxei i leksi")
        let newobject = {
          word: word,
          count: 1,
        };
        fakeWordsGram.push(newobject);
        insert_to_database(word, "grammar", role);
      }
    } else {
      //console.log(" pinakas kenos");
      let newobject = {
        word: word,
        count: 1,
      };
      fakeWordsGram.push(newobject);
      insert_to_database(word, "grammar", role);
    }
    setWordsGram(fakeWordsGram);
  };

  //count mistakes for charts
  const findCount = (item, word, firstTime) => {
    if (firstTime == 0) {
      countOrth = 0;
      countSti = 0;
      countGram = 0;
    }
    if (item.shortMessage == "Ορθογραφικό λάθος") {
      countOrth++;
      setcountOrth(countOrth); // dinei me to set sto countorth to athrisma
      setOrthWords(word); // gia na stelnw tin leksi pou einai orthografika lathos
    } else if (
      item.shortMessage == "Ελέγξτε τη στίξη" ||
      item.shortMessage == ""
    ) {
      countSti++;
      setcountSti(countSti);
      insert_to_database(word, "syntax", role);
    } else if (item.shortMessage == "Επανάληψη λέξης") {
      countGram++;
      setcountGram(countGram);
      setGramWords(word);
    }
  };

  //vriskei tis lathos leksis mia mia
  const wrongWord = (item) => {
    let offset = item.context.offset;
    let length = item.context.length;
    let sentence = item.context.text;
    // To get only the mistake slice from (offset to offset + length) e.g offset = 3  length = 5 => slice(3,8)
    let word1 = sentence.slice(offset, offset + length);
    return word1;
  };
  //update essay table
  const addEssay = (countOrth, countGram, countSti, wordCount, grade) => {
    console.log("ROLE", role);
    console.log("USER", currUser);
    fetch(
      `http://127.0.0.1:5000/essays/add/role/${role}/id/${currUser}/spelling/${countOrth}/grammar/${countGram}/puncutation/${countSti}/words/${wordCount}/${grade}`,
      {
        method: "POST",
      }
    ).then((results) => console.log(results));
  };

  //compute grade
  const computeErrorPercentage = (wordCount, errors) => {
    let count_1 = wordCount - errors;
    return count_1 / wordCount;
  };

  // This functions finds all the mistakes (words) the user made and puts them in an array that then is returned to the highlight component to highlight the correspponding words
  const findWrongWords = (mistakes) => {
    if (role === "professor") {
      insert_count(wordCount);
    }
    if (mistakes.length != 0) {
      let firstTime = 0;
      words = [];
      mistakes.map((item) => {
        let word = wrongWord(item); // vriskei tin leksi
        findCount(item, word, firstTime); // vriskei ta lathi
        firstTime = 1;
        words.push(word);
      });
      //Essay grading

      let orthPercentage = computeErrorPercentage(wordCount, countOrth);
      let gramPercentage = computeErrorPercentage(wordCount, countGram);
      let stiPercentage = computeErrorPercentage(wordCount, countSti);
      if (role == "student") {
        setOrthStats(orthPercentage);
        setGramStats(gramPercentage);
        setStiStats(stiPercentage);
      }

      let grade =
        9 * orthPercentage + 0.5 * gramPercentage + 0.5 * stiPercentage;
      grade = Math.round(grade * 10) / 10;
      setGrade(grade);
      addEssay(countOrth, countGram, countSti, wordCount, grade);
      //------------
      setWordsOrth(fakeWordsOrth);
      setWordsGram(fakeWordsGram);
      return words;
    } else {
      //If no mistakes are found
      if (role && currUser) {
        if (role == "student") {
          let orthPercentage = computeErrorPercentage(wordCount, countOrth);
          let gramPercentage = computeErrorPercentage(wordCount, countGram);
          let stiPercentage = computeErrorPercentage(wordCount, countSti);
          setOrthStats(orthPercentage);
          setGramStats(gramPercentage);
          setStiStats(stiPercentage);
        }
        addEssay(0, 0, 0, wordCount, 10);
      }
      // if mistakes array is empty use a placeholder for the words
      words = [];
      words.push(["placeholder"]);
      return words;
    }
  };

  useEffect(() => {
    fakeWordsOrth = [];
    fakeWordsGram = [];
    setcountOrth(0);
    setcountGram(0);
    setcountSti(0);
    setWordsToHighlight(findWrongWords(mistakes));
    prepare_words_for_highlight();
    setCurrUser(localStorage.getItem("uniqid"));
  }, [mistakes]);

  /*---------------------------------Toolip--------------------------------*/

  const tooltip_content = (wrong_word) => {
    replacement_words = [];
    mistakes.map((item) => {
      let offset = item.context.offset;
      let length = item.context.length;
      let sentence = item.context.text;
      // To get only the mistake slice from (offset to offset + length) e.g offset = 3  length = 5 => slice(3,8)
      let word = sentence.slice(offset, offset + length);
      //prepei na mpei se sinartisi
      if (word === wrong_word) {
        let message = item.message;
        let shortMessage = item.shortMessage;
        tooltipshortMessage = shortMessage;
        tooltipMessage = message;
        let repls = item.replacements;
        let sliced = repls.slice(0, 2);
        sliced.map((repl) => {
          replacement_words.push(repl.value);
        });
        //console.log(replacement_words);
      }
    });
  };
  //Sets different background color for the highlighted word based on type of mistake
  const pick_color = (mistakes, word) => {
    let class_name = "";
    mistakes.map((item) => {
      let match = wrongWord(item);
      if (word === match) {
        let message = item.shortMessage;
        if (message == "Ορθογραφικό λάθος") {
          class_name = "blue";
        } else if (message == "Ελέγξτε τη στίξη" || message == "") {
          class_name = "yellow";
        } else if (message == "Επανάληψη λέξης") {
          class_name = "green";
        }
      }
    });
    return class_name;
  };

  const prepare_words_for_highlight = () => {
    //words_json = [];

    if (words.length != 0) {
      let temp_arr = [];
      words.map((item, index) => {
        let temp_item = {
          highlight: item,
          enhancement: ToolTip,
          className: pick_color(mistakes, item),
        };
        temp_arr.push(temp_item);
      });
      setWordsJson(temp_arr);
    }
  };

  function ToolTip(props) {
    tooltip_content(props.data.text); // call the function to update the tooltip message state
    replacement_words = replacement_words.slice(0, 2);
    const content = (
      <div
        style={{
          whiteSpace: "pre",
          overflow: "hidden",
          textOverflow: "ellipsis",
          backgroundColor: "transparent",
        }}
      >
        <div className="tooltip-message">
          <div className="tooltp-content">
            <h1 className="tooltip-header">{tooltipshortMessage}</h1>
            <p className="tooltip-info">{tooltipMessage}</p>
            <div className="rightwords">
              {replacement_words.map((ww, count) => (
                <button className="new-word">{ww}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
    const overlayStyle = {
      position: "absolute",
      height: "50%",
      width: "100%",
      background: "transparent",
      zIndex: 1,
    };

    return (
      <mark style={{ position: "relative" }}>
        <Tippy content={content} maxWidth="400px">
          <mark style={overlayStyle}></mark>
        </Tippy>
        <props.MarkView />
      </mark>
    );
  }
  /*---------------------------------Toolip--------------------------------*/

  return (
    <div className="content">
      <div className="text-box-check">
        <form>
          <HighlightWithinTextarea
            id="textarea-box2"
            value={textAreaInput}
            highlight={words_json}
            onChange={inputTextHandler}
            containerClassName="textarea-container"
            placeholder="Γράψτε εδώ..."
          />
          <div className="footer">
            <div className="word-count">
              <div className="words">
                <span className="number-color">{wordCount}</span>:λέξεις
              </div>
              <div className="chars">
                <span className="number-color">{characters}</span>:χαρακτήρες
              </div>
            </div>
            <input
              type="submit"
              onClick={getMistakes}
              value="Έλεγχος"
              id="check-text-btn"
            />
          </div>
        </form>
      </div>
      <div className="svgbox" styles="overflow: hidden;">
        <div id="top-svg"></div>
      </div>
    </div>
  );
};

export default InputText;
