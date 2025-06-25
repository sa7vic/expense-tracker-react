import React, { useState, useContext, useRef, useEffect } from "react";
import { GlobalContext } from "../Context/GlobalState";

export const AddTransaction = () => {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const { addTransaction } = useContext(GlobalContext);

  const suggestions = ["Groceries", "Coffee", "Rent", "Bills", "Salary", "Snacks", "Investment", "Gift"];
  const filteredSuggestions = suggestions.filter(
    (item) =>
      item.toLowerCase().startsWith(text.toLowerCase()) && text.length > 0
  );

  const onSubmit = (e) => {
    e.preventDefault();

    if (text.trim() === "" || amount === "") {
      alert("Please enter both a name and an amount.");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      text,
      amount: +amount,
    };

    addTransaction(newTransaction);
    setText("");
    setAmount("");
    setShowSuggestions(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 1000);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <h3>Add New Transaction</h3>
      <form onSubmit={onSubmit}>
        <div className="form-control" style={{ position: "relative" }}>
          <label htmlFor="text">Text</label>
          <input
            type="text"
            value={text}
            ref={inputRef}
            onChange={(e) => {
              setText(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="e.g. Coffee, Salary"
            autoComplete="off"
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul className="suggestions" ref={suggestionsRef}>
              {filteredSuggestions.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setText(item);
                    setShowSuggestions(false);
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-control">
          <label htmlFor="amount">
            Amount <br />
            (negative = expense, positive = income)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount..."
          />
        </div>

        <button className="btn">Add transaction</button>
        {submitted && <p className="success-msg">✓ Added!</p>}
      </form>
    </>
  );
};
