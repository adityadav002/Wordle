import React, { useRef, useState } from "react";
import words from "word-list-json";
import Keyboard from "./Keyboard.jsx";

const rows = 6;
const cols = 5;

function Inputs() {
  const [activeRow, setActiveRow] = useState(0);
  const inputRefs = useRef([]);

  const [colors, setColors] = useState(
    Array.from({ length: rows }, () => Array(cols).fill("transparent"))
  );

  const [keyboardColors, setKeyboardColors] = useState({});

  const isRowFilled = (row) => {
    return inputRefs.current[row].every((input) => input && input.value !== "");
  };

  const handleChange = (e, row, col) => {
    const value = e.target.value.toUpperCase();
    e.target.value = value;

    if (!value) return;
    if (col < cols - 1) {
      inputRefs.current[row][col + 1].focus();
    }
  };

  const [answer] = useState(() => {
    const fiveLetterWords = words.filter((word) => word.length === 5);
    return fiveLetterWords[
      Math.floor(Math.random() * fiveLetterWords.length)
    ].toUpperCase();
  });

  console.log("Answer:", answer);

  const handleKeyDown = (e, row, col) => {
    // Handle Backspace
    if (e.key === "Backspace") {
      e.preventDefault();
      if (e.target.value) {
        e.target.value = "";
      } else if (col > 0) {
        inputRefs.current[row][col - 1].focus();
        inputRefs.current[row][col - 1].value = "";
      }
      return;
    }

    // Handle Enter
    if (e.key === "Enter" && row === activeRow) {
      e.preventDefault();

      if (!isRowFilled(row)) {
        alert("Complete the row first!");
        return;
      }

      const typedWord = inputRefs.current[row]
        .map((input) => input.value.toUpperCase())
        .join("");

      if (!words.includes(typedWord.toLowerCase())) {
        console.log("Not a valid word!");
        return;
      }

      const newColors = colors.map((r) => [...r]);
      const newKeyboardColors = { ...keyboardColors };

      const answerArr = answer.split("");
      const typedArr = typedWord.split("");

      // Green pass
      typedArr.forEach((letter, i) => {
        if (letter === answerArr[i]) {
          newColors[row][i] = "green";
          newKeyboardColors[letter] = "green";
          answerArr[i] = null;
          typedArr[i] = null;
        }
      });

      // Yellow/gray pass
      typedArr.forEach((letter, i) => {
        if (!letter) return;
        if (answerArr.includes(letter)) {
          newColors[row][i] = "yellow";
          if (newKeyboardColors[letter] !== "green") {
            newKeyboardColors[letter] = "yellow";
          }
          answerArr[answerArr.indexOf(letter)] = null;
        } else {
          if (!newKeyboardColors[letter] || newKeyboardColors[letter] === "yellow") {
            newKeyboardColors[letter] = "transparent";
          }
          newColors[row][i] = "transparent";
        }
      });

      setColors(newColors);
      setKeyboardColors(newKeyboardColors);

      if (typedWord === answer) {
        setTimeout(() => alert("🎉 Correct!"), 10);
        window.location.reload();
      } else if (row === rows - 1) {
        setTimeout(() => alert(`Game Over! The word was: ${answer}`), 10);
      }

      if (row < rows - 1) {
        setActiveRow(row + 1);
        setTimeout(() => {
          inputRefs.current[row + 1][0].focus();
        }, 0);
      }
    }
  };

  return (
    <div className="inputs-container">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="input_field">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <input
              key={colIndex}
              type="text"
              maxLength={1}
              style={{ backgroundColor: colors[rowIndex][colIndex] }}
              ref={(el) => {
                if (!inputRefs.current[rowIndex]) inputRefs.current[rowIndex] = [];
                inputRefs.current[rowIndex][colIndex] = el;
              }}
              disabled={rowIndex !== activeRow}
              onChange={(e) => handleChange(e, rowIndex, colIndex)}
              onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
      <br />
      <hr />
      <br />
      <Keyboard keyboardColors={keyboardColors} />
      <br />
      <hr />
    </div>
  );
}

export default Inputs;
