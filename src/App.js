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
        {/* Balance Card - Featured prominently */}
        <div className="dashboard-card balance-card">
          <Balance />
        </div>
        
        {/* Stats Overview Row */}
        <div className="dashboard-stats-row">
          <div className="dashboard-card">
            <IncomeExpenses />
          </div>
          <div className="dashboard-card">
            <h3 className="card-title">Quick Stats</h3>
            <TransactionStats />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="dashboard-main-content">
          <div className="transactions-section">
            <div className="dashboard-card">
              <h3 className="card-title">Recent Transactions</h3>
              <TransactionFilter />
              <TransactionList />
            </div>
          </div>
          
          <div className="sidebar-section">
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
        <div className="dashboard-card full-width">
          <h3 className="card-title">Analytics Dashboard</h3>
          <AnalyticsDashboard />
        </div>
      </div>
    </>
  );
}

export default App;
