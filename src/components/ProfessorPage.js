import React, { useState } from "react";
import Essays from "./Essays";
import InputText from "./InputText";
import Modal from "react-modal";
import essaypng from "../assets/essaypng.png";
import Charts from "./Charts";

const customStyles = {
  overlay: {
    zIndex: 1000,
    background: "rgba(0,0,0, 0.3)",
  },
};

Modal.setAppElement("#root");

const ProfessorPage = ({ inputText, setInputText, getMistakes, mistakes }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [wordsToHighlight, setWordsToHighlight] = useState([]);
  const [countOrth, setcountOrth] = useState(0);
  const [countGram, setcountGram] = useState(0);
  const [countSti, setcountSti] = useState(0);
  const [wordsOrth, setWordsOrth] = useState([]);
  const [wordsGram, setWordsGram] = useState([]);

  function openAddNewEssayModal(e) {
    e.preventDefault();
    setIsOpen(true);
  }

  function closeAddNewEssayModal() {
    setIsOpen(false);
  }

  return (
    <div className="return">
      <div className="title-wrapper">
        <h1 className="title-prof">Professor</h1>
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
      />
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
          λάθη.{" "}
        </h1>
      </div>
      <Charts
        countOrth={countOrth}
        countGram={countGram}
        countSti={countSti}
        wordsOrth={wordsOrth}
        wordsGram={wordsGram}
        mistakes={mistakes}
      />
      <section className="essay-section">
        <Essays addEssay={openAddNewEssayModal} />
        <div className="essay-info">
          <div className="essay-img-wrapper">
            <img src={essaypng} alt="Search-read-share" />
          </div>
          <h1>
            Search<span className="dot">. </span>
            Read<span className="dot">. </span>
            Share<span className="dot">. </span>
          </h1>
          <p className="essay-info-p">
            Discover essay topics other professors assign their students and
            share your own.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ProfessorPage;
