import React, { useState, useEffect } from "react";
import InputText from "./InputText";

const StudentPage = ({ inputText, setInputText, getMistakes, mistakes }) => {
  useEffect(() => {}, [mistakes]);

  return (
    <div className="test">
      <InputText
        inputText={inputText}
        setInputText={setInputText}
        getMistakes={getMistakes}
      />
      <div className="content-sec"></div>
    </div>
  );
};

export default StudentPage;
