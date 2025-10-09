import React, { useState, useRef, useEffect } from "react";
import useTransactionStore from "../store/transactionStore";

export const AddTransaction = () => {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitted, setSubmitted] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const addTransaction = useTransactionStore((state) => state.addTransaction);

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
      category,
      date: new Date(date).toISOString(),
    };

    addTransaction(newTransaction);
    setText("");
    setAmount("");
    setCategory("Uncategorized");
    setDate(new Date().toISOString().split('T')[0]);
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

        <div className="form-control">
          <label htmlFor="category">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: 'var(--glass-border)',
              borderRadius: '4px'
            }}
          >
            <option value="Uncategorized">Uncategorized</option>
            <option value="Food & Dining">Food & Dining</option>
            <option value="Transportation">Transportation</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Bills & Utilities">Bills & Utilities</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Income">Income</option>
            <option value="Investment">Investment</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-control">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: 'var(--glass-border)',
              borderRadius: '4px'
            }}
          />
        </div>

        <button className="btn">Add transaction</button>
        {submitted && <p className="success-msg">✓ Added!</p>}
      </form>
    </>
  );
};
