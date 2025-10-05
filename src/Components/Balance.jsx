import React from 'react'
import useTransactionStore from '../store/transactionStore'

export const Balance = () => {
    const transactions = useTransactionStore((state) => state.transactions);
    
    const total = transactions.reduce((total, transaction) => total + transaction.amount, 0).toFixed(2);
    return (
        <>
            <h4>Your Balance</h4>
            <h1>${total}</h1>
        </>
    )
}