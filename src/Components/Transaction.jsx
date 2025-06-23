import React, { useContext } from 'react';
import { GlobalContext } from '../Context/GlobalState';

export const Transaction = ({ transaction }) => {
    const { deleteTransaction } = useContext(GlobalContext);

    const emojiMap = {
        Groceries: "🛒",
        Coffee: "☕",
        Rent: "🏠",
        Bills: "🧾",
        Salary: "💼"
    };

    const emoji = emojiMap[transaction.text] || "";


    const sign = transaction.amount < 0 ? '-' : '+';
    return (
  <li className={transaction.amount < 0 ? "minus" : "plus"}>
    {emoji} {transaction.text}
    <span>{sign}${Math.abs(transaction.amount)}</span>
    <button onClick={() => deleteTransaction(transaction.id)} className="delete-btn">x</button>
  </li>
);
}
