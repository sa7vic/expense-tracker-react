import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialTransactions = [
    { id: 1, text: 'Recharge', amount: -20 },
    { id: 2, text: 'Salary', amount: 300 },
    { id: 3, text: 'Book', amount: -10 },
    { id: 4, text: 'Rent', amount: 150 }
];

const useTransactionStore = create(
    persist(
        (set, get) => ({
            
            transactions: initialTransactions,
            
            
            addTransaction: (transaction) =>
                set((state) => ({
                    transactions: [transaction, ...state.transactions]
                })),
            
            deleteTransaction: (id) =>
                set((state) => ({
                    transactions: state.transactions.filter(
                        (transaction) => transaction.id !== id
                    )
                })),
            
            // 
            getTotalBalance: () => {
                const { transactions } = get();
                return transactions.reduce((total, transaction) => total + transaction.amount, 0);
            },
            
            getIncome: () => {
                const { transactions } = get();
                return transactions
                    .filter(transaction => transaction.amount > 0)
                    .reduce((total, transaction) => total + transaction.amount, 0);
            },
            
            getExpense: () => {
                const { transactions } = get();
                return transactions
                    .filter(transaction => transaction.amount < 0)
                    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
            },
            
            
            clearAllTransactions: () =>
                set(() => ({
                    transactions: []
                })),
            
            
            resetToInitial: () =>
                set(() => ({
                    transactions: initialTransactions
                }))
        }),
        {
            name: 'expense-tracker-storage', 
            partialize: (state) => ({
                transactions: state.transactions
            })
        }
    )
);

export default useTransactionStore;