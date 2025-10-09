import React from 'react'
import useTransactionStore from '../store/transactionStore'

export const Balance = () => {
    const transactions = useTransactionStore((state) => state.transactions);
    
    const total = transactions.reduce((total, transaction) => total + transaction.amount, 0).toFixed(2);
    return (
        <>
            <h4>Your Total Balance</h4>
            <h1>${total}</h1>
            <p style={{ opacity: 0.8, fontSize: '0.9rem', marginTop: '8px' }}>
                {transactions.length} transactions recorded
            </p>
        </>
    )
}