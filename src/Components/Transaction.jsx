import React from 'react';
import useTransactionStore from '../store/transactionStore';

export const Transaction = ({ transaction }) => {
    const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);

    const categoryEmojiMap = {
        "Food & Dining": "🍽️",
        "Transportation": "🚗",
        "Shopping": "🛒",
        "Entertainment": "🎬",
        "Bills & Utilities": "🧾",
        "Healthcare": "🏥",
        "Education": "📚",
        "Income": "💼",
        "Investment": "📈",
        "Other": "📝",
        "Uncategorized": "❓"
    };

    const textEmojiMap = {
        Groceries: "🛒",
        Coffee: "☕",
        Rent: "🏠",
        Bills: "🧾",
        Salary: "💼"
    };

    const emoji = categoryEmojiMap[transaction.category] || textEmojiMap[transaction.text] || "💰";
    const sign = transaction.amount < 0 ? '-' : '+';
    
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <li className={transaction.amount < 0 ? "minus" : "plus"} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{emoji}</span>
                    <span style={{ fontWeight: 'bold' }}>{transaction.text}</span>
                </div>
                <div style={{ 
                    fontSize: '12px', 
                    color: '#666', 
                    marginTop: '2px',
                    display: 'flex',
                    gap: '10px'
                }}>
                    {transaction.category && (
                        <span>📂 {transaction.category}</span>
                    )}
                    {transaction.date && (
                        <span>📅 {formatDate(transaction.date)}</span>
                    )}
                </div>
            </div>
            <span style={{ fontWeight: 'bold', marginRight: '10px' }}>
                {sign}${Math.abs(transaction.amount)}
            </span>
            <button 
                onClick={() => deleteTransaction(transaction.id)} 
                className="delete-btn"
                style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)' }}
            >
                ×
            </button>
        </li>
    );
}
