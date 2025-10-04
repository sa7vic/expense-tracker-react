import React from "react";
import useTransactionStore from "../store/transactionStore";
import { Transaction } from "./Transaction";
export const TransactionList = () => {
    const transactions = useTransactionStore((state) => state.transactions);
    return (
        <>
            <h3>History</h3>
            <ul className="list">
                {transactions.map(transaction => (<Transaction key={transaction.id} transaction={transaction} />))}
            </ul>
        </>
    )
}