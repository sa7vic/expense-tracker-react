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
import { TransactionSummary } from './Components/TransactionSummary'; // ADD THIS LINE
import './App.css';

function App() {
  return (
    <>
      <div className="app-header">
        <Header />
      </div>
      <div className='container'>
        <div className="dashboard-card balance-card">
          <Balance />
        </div>
        
        <div className="dashboard-stats-row">
          <div className="dashboard-card">
            <IncomeExpenses />
          </div>
          <div className="dashboard-card">
            <h3 className="card-title">Quick Stats</h3>
            <TransactionStats />
          </div>
        </div>

        {/* ADD THIS NEW SECTION */}
        <div className="dashboard-card">
          <TransactionSummary />
        </div>

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

        <div className="dashboard-card full-width">
          <h3 className="card-title">Analytics Dashboard</h3>
          <AnalyticsDashboard />
        </div>
      </div>
    </>
  );
}

export default App;
