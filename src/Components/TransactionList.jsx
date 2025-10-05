import React from "react";
import useTransactionStore from "../store/transactionStore";
import { Transaction } from "./Transaction";
export const TransactionList = () => {
    const transactions = useTransactionStore((state) => state.transactions);
    const filterText = useTransactionStore((state) => state.filterText);
    const filterType = useTransactionStore((state) => state.filterType);
    
    const filteredTransactions = transactions.filter(transaction => {
        const matchesText = filterText === '' || 
            transaction.text.toLowerCase().includes(filterText.toLowerCase());
        
        let matchesType = true;
        if (filterType === 'income') {
            matchesType = transaction.amount > 0;
        } else if (filterType === 'expense') {
            matchesType = transaction.amount < 0;
        }
        
        return matchesText && matchesType;
    });
    return (
        <>
            <h3>History</h3>
            <ul className="list">
                {filteredTransactions.map(transaction => (<Transaction key={transaction.id} transaction={transaction} />))}
            </ul>
        </>
    )
}