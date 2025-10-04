import React from 'react';
import useTransactionStore from '../store/transactionStore';


export const IncomeExpenses = () => {
    const getIncome = useTransactionStore((state) => state.getIncome);
    const getExpense = useTransactionStore((state) => state.getExpense);
    
    const income = getIncome().toFixed(2);
    const expense = getExpense().toFixed(2);

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