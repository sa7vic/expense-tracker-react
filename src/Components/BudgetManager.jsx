import React, { useState } from 'react';
import useTransactionStore from '../store/transactionStore';

export const BudgetManager = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [periodInput, setPeriodInput] = useState('monthly');

  const budget = useTransactionStore((state) => state.budget);
  const budgetPeriod = useTransactionStore((state) => state.budgetPeriod);
  const setBudget = useTransactionStore((state) => state.setBudget);
  const transactions = useTransactionStore((state) => state.transactions);

  const getBudgetStatus = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentWeek = Math.ceil(now.getDate() / 7);

    let periodTransactions = transactions;

    if (budgetPeriod === 'monthly') {
      periodTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date || Date.now());
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      });
    } else if (budgetPeriod === 'weekly') {
      periodTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date || Date.now());
        const transactionWeek = Math.ceil(transactionDate.getDate() / 7);
        return transactionWeek === currentWeek && 
               transactionDate.getMonth() === currentMonth &&
               transactionDate.getFullYear() === currentYear;
      });
    }

    const totalExpenses = periodTransactions
      .filter(t => t.amount < 0)
      .reduce((total, t) => total + Math.abs(t.amount), 0);

    const remaining = budget - totalExpenses;
    const percentageUsed = budget > 0 ? (totalExpenses / budget) * 100 : 0;

    return {
      budget,
      spent: totalExpenses,
      remaining,
      percentageUsed,
      isOverBudget: totalExpenses > budget,
      period: budgetPeriod
    };
  };

  const budgetStatus = getBudgetStatus();

  const handleSaveBudget = () => {
    const amount = parseFloat(budgetInput);
    if (amount > 0) {
      setBudget(amount, periodInput);
      setIsEditing(false);
      setBudgetInput('');
    }
  };

  const handleEditBudget = () => {
    setBudgetInput(budget.toString());
    setPeriodInput(budgetPeriod);
    setIsEditing(true);
  };

  const getProgressBarColor = () => {
    if (budgetStatus.percentageUsed >= 100) return 'var(--minus-color)'; 
    if (budgetStatus.percentageUsed >= 80) return 'var(--warning-color)';
    return 'var(--plus-color)';
  };

  const getStatusMessage = () => {
    if (budgetStatus.isOverBudget) {
      return `Over budget by $${Math.abs(budgetStatus.remaining).toFixed(2)}`;
    }
    return `$${budgetStatus.remaining.toFixed(2)} remaining`;
  };

  return (
    <div className="budget-manager" style={{ 
      margin: '20px 0', 
      padding: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0 }}>💰 Budget Tracker</h3>
        {!isEditing && (
          <button 
            onClick={handleEditBudget}
            className="btn btn-small btn-secondary"
            style={{ width: 'auto' }}
          >
            Edit Budget
          </button>
        )}
      </div>

      {isEditing ? (
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="Enter budget amount"
              style={{
                flex: 1,
                padding: '8px',
                border: 'var(--glass-border)',
                borderRadius: '4px'
              }}
            />
            <select
              value={periodInput}
              onChange={(e) => setPeriodInput(e.target.value)}
              style={{
                padding: '8px',
                border: 'var(--glass-border)',
                borderRadius: '4px'
              }}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleSaveBudget}
              style={{
                padding: '8px 15px',
                backgroundColor: 'var(--plus-color)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                padding: '8px 15px',
                backgroundColor: 'var(--text-secondary)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <strong>{budgetPeriod.charAt(0).toUpperCase() + budgetPeriod.slice(1)} Budget: </strong>
            ${budget.toFixed(2)}
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span>Spent: ${budgetStatus.spent.toFixed(2)}</span>
              <span>{budgetStatus.percentageUsed.toFixed(1)}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '20px',
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '10px',
              overflow: 'hidden',
              marginTop: '5px'
            }}>
              <div style={{
                width: `${Math.min(budgetStatus.percentageUsed, 100)}%`,
                height: '100%',
                backgroundColor: getProgressBarColor(),
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>

          <div style={{ 
            fontSize: '14px', 
            fontWeight: 'bold',
            color: budgetStatus.isOverBudget ? 'var(--minus-color)' : 'var(--plus-color)'
          }}>
            {getStatusMessage()}
          </div>
        </div>
      )}
    </div>
  );
};