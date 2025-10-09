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
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '12px' }}>
                <div style={{ 
                    fontSize: '24px',
                    minWidth: '32px',
                    textAlign: 'center'
                }}>
                    {emoji}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ 
                        fontWeight: '600', 
                        fontSize: '16px',
                        marginBottom: '4px',
                        color: 'var(--text-primary)'
                    }}>
                        {transaction.text}
                    </div>
                    <div style={{ 
                        fontSize: '12px', 
                        color: 'var(--text-secondary)', 
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center'
                    }}>
                        {transaction.category && (
                            <span style={{
                                padding: '2px 8px',
                                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: '500'
                            }}>
                                {transaction.category}
                            </span>
                        )}
                        {transaction.date && (
                            <span>📅 {formatDate(transaction.date)}</span>
                        )}
                    </div>
                </div>
            </div>
            <div style={{ 
                fontWeight: '700', 
                fontSize: '16px',
                marginRight: '40px',
                color: transaction.amount < 0 ? 'var(--minus-color)' : 'var(--plus-color)'
            }}>
                {sign}${Math.abs(transaction.amount)}
            </div>
            <button 
                onClick={() => deleteTransaction(transaction.id)} 
                className="delete-btn"
            >
                ×
            </button>
        </li>
    );
}
