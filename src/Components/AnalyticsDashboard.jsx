import React, { useState } from 'react';
import useTransactionStore from '../store/transactionStore';

export const AnalyticsDashboard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const transactions = useTransactionStore((state) => state.transactions);
  const budget = useTransactionStore((state) => state.budget);
  const budgetPeriod = useTransactionStore((state) => state.budgetPeriod);
  
  const getTransactionAnalytics = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date || Date.now());
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const lastMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date || Date.now());
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    });

    const currentMonthExpenses = currentMonthTransactions
      .filter(t => t.amount < 0)
      .reduce((total, t) => total + Math.abs(t.amount), 0);

    const lastMonthExpenses = lastMonthTransactions
      .filter(t => t.amount < 0)
      .reduce((total, t) => total + Math.abs(t.amount), 0);

    const expenseChange = lastMonthExpenses > 0 ? 
      ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;

    const categoryTotals = {};
    transactions.forEach(t => {
      const category = t.category || 'Uncategorized';
      if (!categoryTotals[category]) {
        categoryTotals[category] = { income: 0, expense: 0 };
      }
      if (t.amount > 0) {
        categoryTotals[category].income += t.amount;
      } else {
        categoryTotals[category].expense += Math.abs(t.amount);
      }
    });

    return {
      currentMonthExpenses,
      lastMonthExpenses,
      expenseChange,
      categoryTotals,
      totalTransactions: transactions.length,
      averageTransaction: transactions.length > 0 ? 
        transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length : 0
    };
  };

  const getBudgetStatus = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const periodTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date || Date.now());
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

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
  
  const analytics = getTransactionAnalytics();
  const budgetStatus = getBudgetStatus();

  const formatCurrency = (amount) => `$${Math.abs(amount).toFixed(2)}`;
  const formatPercentage = (value) => `${value.toFixed(1)}%`;

  return (
    <div className="analytics-dashboard" style={{
      margin: '20px 0',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#fff'
    }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px 8px 0 0',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <h3 style={{ margin: 0, color: '#333' }}>📊 Analytics Dashboard</h3>
        <span style={{ fontSize: '18px' }}>{isExpanded ? '▼' : '▶'}</span>
      </div>

      {isExpanded && (
        <div style={{ padding: '20px' }}>
          {/* Overview Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{
              padding: '15px',
              backgroundColor: '#e3f2fd',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#1976d2' }}>Total Transactions</h4>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                {analytics.totalTransactions}
              </div>
            </div>

            <div style={{
              padding: '15px',
              backgroundColor: '#f3e5f5',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#7b1fa2' }}>Average Transaction</h4>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                {formatCurrency(analytics.averageTransaction)}
              </div>
            </div>

            <div style={{
              padding: '15px',
              backgroundColor: analytics.expenseChange >= 0 ? '#ffebee' : '#e8f5e8',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 5px 0', color: analytics.expenseChange >= 0 ? '#d32f2f' : '#388e3c' }}>
                Monthly Change
              </h4>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
              }}>
                <span>{analytics.expenseChange >= 0 ? '📈' : '📉'}</span>
                {formatPercentage(Math.abs(analytics.expenseChange))}
              </div>
            </div>
          </div>

          {/* Monthly Comparison */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '10px', color: '#333' }}>Monthly Expense Comparison</h4>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px'
            }}>
              <div>
                <span style={{ fontSize: '14px', color: '#666' }}>This Month:</span>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#d32f2f' }}>
                  {formatCurrency(analytics.currentMonthExpenses)}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '14px', color: '#666' }}>Last Month:</span>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#666' }}>
                  {formatCurrency(analytics.lastMonthExpenses)}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '14px', color: '#666' }}>Difference:</span>
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  color: analytics.expenseChange >= 0 ? '#d32f2f' : '#388e3c'
                }}>
                  {analytics.expenseChange >= 0 ? '+' : ''}{formatPercentage(analytics.expenseChange)}
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '10px', color: '#333' }}>Category Breakdown</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '10px'
            }}>
              {Object.entries(analytics.categoryTotals).map(([category, totals]) => (
                <div key={category} style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#fff'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{category}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <div>Income: <span style={{ color: '#388e3c' }}>{formatCurrency(totals.income)}</span></div>
                    <div>Expenses: <span style={{ color: '#d32f2f' }}>{formatCurrency(totals.expense)}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Performance */}
          {budgetStatus.budget > 0 && (
            <div>
              <h4 style={{ marginBottom: '10px', color: '#333' }}>Budget Performance</h4>
              <div style={{
                padding: '15px',
                backgroundColor: budgetStatus.isOverBudget ? '#ffebee' : '#e8f5e8',
                borderRadius: '6px',
                border: `2px solid ${budgetStatus.isOverBudget ? '#f44336' : '#4caf50'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>
                    <strong>{budgetStatus.period.charAt(0).toUpperCase() + budgetStatus.period.slice(1)} Budget Status:</strong>
                  </span>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    backgroundColor: budgetStatus.isOverBudget ? '#d32f2f' : '#388e3c',
                    color: 'white'
                  }}>
                    {budgetStatus.isOverBudget ? 'Over Budget' : 'On Track'}
                  </span>
                </div>
                <div style={{ marginTop: '10px', fontSize: '14px' }}>
                  Used {formatPercentage(budgetStatus.percentageUsed)} of {formatCurrency(budgetStatus.budget)} budget
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};