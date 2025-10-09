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
      margin: '20px 0'
    }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '20px',
          background: 'rgba(102, 126, 234, 0.05)',
          borderRadius: '16px 16px 0 0',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.3s ease'
        }}
      >
        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>📊 Analytics Dashboard</h3>
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
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 5px 0', color: 'var(--primary-color)' }}>Total Transactions</h4>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {analytics.totalTransactions}
              </div>
            </div>

            <div style={{
              padding: '15px',
              backgroundColor: 'rgba(118, 75, 162, 0.1)',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 5px 0', color: 'var(--secondary-color)' }}>Average Transaction</h4>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {formatCurrency(analytics.averageTransaction)}
              </div>
            </div>

            <div style={{
              padding: '15px',
              backgroundColor: analytics.expenseChange >= 0 ? 'rgba(250, 112, 154, 0.1)' : 'rgba(39, 174, 96, 0.1)',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 5px 0', color: analytics.expenseChange >= 0 ? 'var(--minus-color)' : 'var(--plus-color)' }}>
                Monthly Change
              </h4>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: 'var(--text-primary)',
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
            <h4 style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>Monthly Expense Comparison</h4>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '15px',
              backgroundColor: 'var(--bg-glass)',
              borderRadius: '6px'
            }}>
              <div>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>This Month:</span>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--minus-color)' }}>
                  {formatCurrency(analytics.currentMonthExpenses)}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Last Month:</span>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                  {formatCurrency(analytics.lastMonthExpenses)}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Difference:</span>
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  color: analytics.expenseChange >= 0 ? 'var(--minus-color)' : 'var(--plus-color)'
                }}>
                  {analytics.expenseChange >= 0 ? '+' : ''}{formatPercentage(analytics.expenseChange)}
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>Category Breakdown</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '10px'
            }}>
              {Object.entries(analytics.categoryTotals).map(([category, totals]) => (
                <div key={category} style={{
                  padding: '10px',
                  border: 'var(--glass-border)',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-card)'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{category}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <div>Income: <span style={{ color: 'var(--plus-color)' }}>{formatCurrency(totals.income)}</span></div>
                    <div>Expenses: <span style={{ color: 'var(--minus-color)' }}>{formatCurrency(totals.expense)}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Performance */}
          {budgetStatus.budget > 0 && (
            <div>
              <h4 style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>Budget Performance</h4>
              <div style={{
                padding: '15px',
                backgroundColor: budgetStatus.isOverBudget ? 'rgba(250, 112, 154, 0.1)' : 'rgba(39, 174, 96, 0.1)',
                borderRadius: '6px',
                border: `2px solid ${budgetStatus.isOverBudget ? 'var(--minus-color)' : 'var(--plus-color)'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>
                    <strong>{budgetStatus.period.charAt(0).toUpperCase() + budgetStatus.period.slice(1)} Budget Status:</strong>
                  </span>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    backgroundColor: budgetStatus.isOverBudget ? 'var(--minus-color)' : 'var(--plus-color)',
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