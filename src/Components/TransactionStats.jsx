import React from 'react';
import useTransactionStore from '../store/transactionStore';

export const TransactionStats = () => {
  const transactions = useTransactionStore((state) => state.transactions);
  const clearAllTransactions = useTransactionStore((state) => state.clearAllTransactions);
  const resetToInitial = useTransactionStore((state) => state.resetToInitial);

  const totalTransactions = transactions.length;
  const totalBalance = transactions.reduce((total, transaction) => total + transaction.amount, 0);
  const income = transactions
    .filter(transaction => transaction.amount > 0)
    .reduce((total, transaction) => total + transaction.amount, 0);
  const expense = transactions
    .filter(transaction => transaction.amount < 0)
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
  const averageTransaction = totalTransactions > 0 ? (totalBalance / totalTransactions).toFixed(2) : 0;

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all transactions?')) {
      clearAllTransactions();
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to initial data?')) {
      resetToInitial();
    }
  };

  return (
    <div className="stats-container" style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3>Transaction Statistics</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '15px' }}>
        <div>
          <strong>Total Transactions:</strong> {totalTransactions}
        </div>
        <div>
          <strong>Average per Transaction:</strong> ${averageTransaction}
        </div>
        <div>
          <strong>Total Income:</strong> ${income.toFixed(2)}
        </div>
        <div>
          <strong>Total Expenses:</strong> ${expense.toFixed(2)}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={handleClearAll}
          style={{ 
            padding: '8px 12px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear All
        </button>
        <button 
          onClick={handleReset}
          style={{ 
            padding: '8px 12px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset to Initial
        </button>
      </div>
    </div>
  );
};