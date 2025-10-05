import React, { useState } from 'react';
import useTransactionStore from '../store/transactionStore';

export const BudgetManager = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [periodInput, setPeriodInput] = useState('monthly');

  const budget = useTransactionStore((state) => state.budget);
  const budgetPeriod = useTransactionStore((state) => state.budgetPeriod);
  const setBudget = useTransactionStore((state) => state.setBudget);
  const getBudgetStatus = useTransactionStore((state) => state.getBudgetStatus);

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
    if (budgetStatus.percentageUsed >= 100) return '#dc3545'; // Red
    if (budgetStatus.percentageUsed >= 80) return '#ffc107'; // Yellow
    return '#28a745'; // Green
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
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: '#333' }}>Budget Tracker</h3>
        {!isEditing && (
          <button 
            onClick={handleEditBudget}
            style={{
              padding: '5px 10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
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
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <select
              value={periodInput}
              onChange={(e) => setPeriodInput(e.target.value)}
              style={{
                padding: '8px',
                border: '1px solid #ccc',
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
                backgroundColor: '#28a745',
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
                backgroundColor: '#6c757d',
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
              backgroundColor: '#e9ecef',
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
            color: budgetStatus.isOverBudget ? '#dc3545' : '#28a745'
          }}>
            {getStatusMessage()}
          </div>
        </div>
      )}
    </div>
  );
};