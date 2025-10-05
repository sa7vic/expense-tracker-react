import React from 'react';
import useTransactionStore from '../store/transactionStore';

export const TransactionStats = () => {
  const transactions = useTransactionStore((state) => state.transactions);
  const getTotalBalance = useTransactionStore((state) => state.getTotalBalance);
  const getIncome = useTransactionStore((state) => state.getIncome);
  const getExpense = useTransactionStore((state) => state.getExpense);
  const clearAllTransactions = useTransactionStore((state) => state.clearAllTransactions);
  const resetToInitial = useTransactionStore((state) => state.resetToInitial);

  const totalTransactions = transactions.length;
  const averageTransaction = totalTransactions > 0 ? (getTotalBalance() / totalTransactions).toFixed(2) : 0;

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
          <strong>Total Income:</strong> ${getIncome().toFixed(2)}
        </div>
        <div>
          <strong>Total Expenses:</strong> ${getExpense().toFixed(2)}
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