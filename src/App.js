import React from 'react';
import { Header } from './Components/Header';
import { Balance } from './Components/Balance'
import { IncomeExpenses } from './Components/IncomeExpenses'
import { BudgetManager } from './Components/BudgetManager';
import { TransactionFilter } from './Components/TransactionFilter';
import { TransactionList } from './Components/TransactionList'
import { AddTransaction } from './Components/AddTransaction';
import { TransactionStats } from './Components/TransactionStats';
import { AnalyticsDashboard } from './Components/AnalyticsDashboard';
import './App.css';

function App() {
  return (
    <>
      <div className="app-header">
        <Header />
      </div>
      <div className='container'>
        {/* Top Row - Balance and Quick Stats */}
        <div className="dashboard-top-row">
          <div className="dashboard-card balance-card">
            <Balance />
          </div>
          <div className="dashboard-card quick-stats-card">
            <h3 className="card-title">Quick Stats</h3>
            <TransactionStats />
          </div>
        </div>

        {/* Income/Expenses Row */}
        <div className="dashboard-card income-expenses-card">
          <IncomeExpenses />
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-main-grid">
          {/* Left Column - Transactions */}
          <div className="transactions-column">
            <div className="dashboard-card">
              <h3 className="card-title">Recent Transactions</h3>
              <TransactionFilter />
              <TransactionList />
            </div>
          </div>
          
          {/* Right Column - Actions and Management */}
          <div className="actions-column">
            <div className="dashboard-card">
              <h3 className="card-title">Add Transaction</h3>
              <AddTransaction />
            </div>
            
            <div className="dashboard-card">
              <h3 className="card-title">Budget Management</h3>
              <BudgetManager />
            </div>
          </div>
        </div>

        {/* Analytics Dashboard - Full Width */}
        <div className="dashboard-card analytics-card">
          <h3 className="card-title">Analytics Dashboard</h3>
          <AnalyticsDashboard />
        </div>
      </div>
    </>
  );
}

export default App;
