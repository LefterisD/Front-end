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
}) => {
  //const [textareaValue, setTextareaValue] = useState("");
  const [textAreaInput, setTextAreaInput] = useState("");
  const [words_json, setWordsJson] = useState([]);
  //const [tooltipMessage, setTooltipMessage] = useState("");
  const [tooltipReplacements, setTooltipReplacements] = useState([]);
  const [characters, setCharacters] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  let words = [];
  let tooltipMessage = "";
  let tooltipshortMessage = "";
  let replacement_words = [];
  let fakeWordsOrth = [];
  let fakeWordsGram = [];

  /*
    ------------------------ THIS CODE IS FOR INDEXED DB DELETE IT BEFORE DEPLOYING THE APP
    -
    -
    -
    -
    -
    -
    -
  ---------------------------------- IDB Start ---------------------*/
  /*//Call it once when component mounts to create the database with 3 object-stores orth gram syntax
  const create_DB = () => {
    let openRequest = indexedDB.open("Mistakes", 1);
    openRequest.onupgradeneeded = function () {
      let db = openRequest.result;
      //Each store object must a have a unique key set as the word itself
      db.createObjectStore("Orth", { keyPath: "word" });
      db.createObjectStore("Gram", { autoIncrement: true });
      db.createObjectStore("Syntax", { autoIncrement: true });
    };
  };*/

  /*const testFunction = () => {
    fetch("http://127.0.0.1:5000/mistakes")
      .then((res) => res.json())
      .then((data) => {
        let json_obj = JSON.parse(JSON.stringify(data));
        console.log("DATABASE FROM API");
        console.log(json_obj);
      });
  };*/
  /*
    ------------------------ THIS CODE IS FOR INDEXED DB DELETE IT BEFORE DEPLOYING THE APP
    -
    -
    -
    -
    -
    -
    -
  const Update_word_count = (word_to_update) => {
    let openRequest = indexedDB.open("Mistakes", 1);
    openRequest.onsuccess = function () {
      let db = openRequest.result;
      let transaction = db.transaction("Orth", "readwrite");
      let orth_object_store = transaction.objectStore("Orth");
      //Because the object store has for a key the word itself we can't have duplicate words in the table
      //we provide the word as a key to retrieve the data for each mistake
      //we update its count and put it back in the database
      orth_object_store.getAll().onsuccess = function (event) {
        let request = orth_object_store.get(word_to_update);
        request.onsuccess = function (e) {
          let data = e.target.result;
          data.count = data.count + 1;
          let requestUpdate = orth_object_store.put(data);
          requestUpdate.onsuccess = function () {
            console.log("Item count Updated");
          };
        };
      };
    };
  };
  //Takes a wrong word as an argument
  //Makes a transaction to add the wrong word with its count=1 to the DB
  //Adds a wrong word that does not exist in the db
  //On-error means that the word is already in the DB and calls Update_word_count function to update its count
  const Add_new_word = (word) => {
    let openRequest = indexedDB.open("Mistakes", 2);
    openRequest.onsuccess = function () {
      let db = openRequest.result;
      let transaction = db.transaction("Orth", "readwrite");
      let orth = transaction.objectStore("Orth");
      let temp_item = {
        word: word,
        count: 1,
      };
      let request = orth.add(temp_item);
      request.onsuccess = function () {
        console.log("Item added");
      };
      request.onerror = function () {
        console.log("Error", request.error);
        Update_word_count(word);
      };
    };
  };

  /*---------------------------------- IDB END ---------------------*/

  //Fetching the api to insert into the db or update a specific word count
  const insert_to_database = (word, type) => {
    fetch(`http://127.0.0.1:5000/mistakes/${user}/${type}/${word}`, {
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
          //Update_word_count(word);
          insert_to_database(word, "spelling");
        }
      });
      if (counter === 0) {
        // console.log("DEn Yparxei i leksi");
        let newobject = {
          word: word,
          count: 1,
        };
        fakeWordsOrth.push(newobject);
        //Add_new_word(word);
        insert_to_database(word, "spelling");
      }
    } else {
      //console.log(" pinakas kenos");
      let newobject = {
        word: word,
        count: 1,
      };
      fakeWordsOrth.push(newobject);
      //Add_new_word(word);
      insert_to_database(word, "spelling");
    }
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
          insert_to_database(word, "grammar");
        }
      });
      if (counter == 0) {
        // console.log("DEn Yparxei i leksi")
        let newobject = {
          word: word,
          count: 1,
        };
        fakeWordsGram.push(newobject);
        insert_to_database(word, "grammar");
      }
    } else {
      //console.log(" pinakas kenos");
      let newobject = {
        word: word,
        count: 1,
      };
      fakeWordsGram.push(newobject);
      insert_to_database(word, "grammar");
    }
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

  // This functions finds all the mistakes (words) the user made and puts them in an array that then is returned to the highlight component to highlight the correspponding words
  const findWrongWords = (mistakes) => {
    if (mistakes.length != 0) {
      let firstTime = 0;
      words = [];
      mistakes.map((item) => {
        let word = wrongWord(item); // vriskei tin leksi
        findCount(item, word, firstTime); // vriskei ta lathi
        firstTime = 1;
        words.push(word);
      });
      setWordsOrth(fakeWordsOrth);
      setWordsGram(fakeWordsGram);
      return words;
    } else {
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
                <span className="number-color">{wordCount}</span>:words
              </div>
              <div className="chars">
                <span className="number-color">{characters}</span>:chars
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
