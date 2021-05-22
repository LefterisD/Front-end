import React, { useState, useEffect } from "react";
import Essays from "./Essays";
import InputText from "./InputText";
import Modal from "react-modal";
import essaypng from "../assets/essaypng.png";
import Charts from "./Charts";
import EssayCounter from "./EssayCounter";
import DataTable from "./DataTable";
import uniqid from "uniqid";

const customStyles = {
  overlay: {
    zIndex: 1000,
    background: "rgba(0,0,0, 0.3)",
  },
};

Modal.setAppElement("#root");

const ProfessorPage = ({
  inputText,
  setInputText,
  getMistakes,
  mistakes,
  user,
  setUser,
  setRole,
}) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [wordsToHighlight, setWordsToHighlight] = useState([]);
  const [countOrth, setcountOrth] = useState(0);
  const [countGram, setcountGram] = useState(0);
  const [countSti, setcountSti] = useState(0);
  const [wordsOrth, setWordsOrth] = useState([]);
  const [wordsGram, setWordsGram] = useState([]);
  const [userName, setUserName] = useState("");
  const ROLE = "professor";
  function openAddNewEssayModal(e) {
    e.preventDefault();
    setIsOpen(true);
  }

  function closeAddNewEssayModal() {
    setIsOpen(false);
  }

  const deleteMistakes = () => {
    fetch(
      `http://127.0.0.1:5000/mistakes/delete_by_id/id=/${user}/role=/${ROLE}`,
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

  //Checks if local storage uniqid EXISTS and sets the global userid state to the stored id
  //IF not it uses an external uniqid generator and sets the uniqid in local storage
  //then is uses the addUser function from above to insert the user into the users table
  useEffect(() => {
    setRole("professor");
    let stored_id = localStorage.getItem("uniqid");
    if (stored_id) {
      setUser(stored_id);
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
        <h1 className="title-prof">Καλώς όρισατε κ.{userName}</h1>
      </div>
      <InputText
        setInputText={setInputText}
        getMistakes={getMistakes}
        mistakes={mistakes}
        setWordsToHighlight={setWordsToHighlight}
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
      <EssayCounter mistakes={mistakes} role={ROLE} />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeAddNewEssayModal}
        className="modal-essay"
        style={customStyles}
        contentLabel="Test Modal"
        closeTimeoutMS={300}
      >
        <header>
          <button onClick={closeAddNewEssayModal}>
            <i class="fas fa-times"></i>
          </button>
        </header>
        <div className="container">
          <div className="title">
            <h1>Add new Essay</h1>
          </div>
          <div className="main-section">
            <div className="input-box">
              <input
                type="text"
                id="context"
                name="context"
                className="input-field"
                placeholder=" "
              />
              <label htmlFor="context">Title</label>
            </div>
            <div className="input-box">
              <textarea
                name="full-topic"
                id="full-topic"
                className="input-field"
                placeholder=" "
              ></textarea>
              <label htmlFor="full-topic">Full Topic</label>
            </div>
            <div className="line">
              <div className="left">
                <input
                  type="text"
                  id="date"
                  name="date"
                  className="input-field"
                  placeholder=" "
                />
                <label htmlFor="date">Date</label>
              </div>
              <div className="right">
                <input
                  type="text"
                  id="author"
                  name="author"
                  className="input-field"
                  placeholder=" "
                />
                <label htmlFor="author">Author</label>
              </div>
            </div>
            <div className="btn-wrapper">
              <button className="add">Add</button>
            </div>
          </div>
        </div>
      </Modal>
      <div className="chart-section-title">
        <h1 className="title-chart">
          <span id="chart-span">Παρακάτω, </span> θα βρείτε στατιστικά για τα
          λάθη.
        </h1>
      </div>
      <Charts
        countOrth={countOrth}
        countGram={countGram}
        countSti={countSti}
        wordsOrth={wordsOrth}
        wordsGram={wordsGram}
        mistakes={mistakes}
        user={user}
        role={ROLE}
      />
      <section className="essay-section">
        <div id="essay-details">
          <h1 id="essay-header">Πληροφορίες για τις εκθέσεις</h1>
          <p>
            Παρακάτω εμφανίζονται στον πίνακα οι εκθέσεις που έχουν ελεγχθεί.
            Πιο συγκεκριμένα θα βρείτε πληροφορίες για τον βαθμό της έκθεσης,
            τον αριθμό των λαθών καθώς και των λέξεων.{" "}
          </p>
        </div>

        <DataTable role={ROLE} />
      </section>
    </div>
  );
};

export default ProfessorPage;
