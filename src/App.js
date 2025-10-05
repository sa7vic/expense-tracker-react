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
      <Header />
      <div className='container'>
        <Balance />
        <IncomeExpenses />
        <BudgetManager />
        <AnalyticsDashboard />
        <TransactionFilter />
        <TransactionList />
        <AddTransaction />
        <TransactionStats />
      </div>
    </>
  );
}

export default App;
