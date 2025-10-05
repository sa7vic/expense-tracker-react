import React from 'react';
import useTransactionStore from '../store/transactionStore';


export const IncomeExpenses = () => {
    const transactions = useTransactionStore((state) => state.transactions);
    
    const income = transactions
        .filter(transaction => transaction.amount > 0)
        .reduce((total, transaction) => total + transaction.amount, 0)
        .toFixed(2);
    
    const expense = transactions
        .filter(transaction => transaction.amount < 0)
        .reduce((total, transaction) => total + Math.abs(transaction.amount), 0)
        .toFixed(2);

    return(
        <div className="inc-exp-container">
            <div>
                <h4>Income</h4>
                <p className="money plus">{income}</p>
            </div>
            <div>
                <h4>Expense</h4>
                <p className="money minus">{expense}</p>
            </div>
        </div>
    )
}