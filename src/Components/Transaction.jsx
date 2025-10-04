import React from 'react';
import useTransactionStore from '../store/transactionStore';

export const Transaction = ({ transaction }) => {
    const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);

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
