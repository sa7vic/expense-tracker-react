import React from 'react'
import useTransactionStore from '../store/transactionStore'

export const Balance = () => {
    const getTotalBalance = useTransactionStore((state) => state.getTotalBalance);
    
    const total = getTotalBalance().toFixed(2);
    return (
        <>
            <h4>Your Balance</h4>
            <h1>${total}</h1>
        </>
    )
}