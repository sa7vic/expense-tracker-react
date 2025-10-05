import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialTransactions = [
    { id: 1, text: 'Recharge', amount: -20, category: 'Other', date: new Date().toISOString() },
    { id: 2, text: 'Salary', amount: 300, category: 'Income', date: new Date().toISOString() },
    { id: 3, text: 'Book', amount: -10, category: 'Education', date: new Date().toISOString() },
    { id: 4, text: 'Rent', amount: -150, category: 'Bills & Utilities', date: new Date().toISOString() }
];

const useTransactionStore = create(
    persist(
        (set, get) => ({
            
            transactions: initialTransactions,
            budget: 1000,
            budgetPeriod: 'monthly',
            filterText: '',
            filterType: 'all',
            
            
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
            
            
            
            clearAllTransactions: () =>
                set(() => ({
                    transactions: []
                })),
            
            
            resetToInitial: () =>
                set(() => ({
                    transactions: initialTransactions
                })),

            setBudget: (amount, period = 'monthly') =>
                set(() => ({
                    budget: amount,
                    budgetPeriod: period
                })),

            setFilter: (text, type = 'all') =>
                set(() => ({
                    filterText: text,
                    filterType: type
                })),

        }),
        {
            name: 'expense-tracker-storage', 
            
            partialize: (state) => ({
                transactions: state.transactions,
                budget: state.budget,
                budgetPeriod: state.budgetPeriod
            })
        }
    )
);

export default useTransactionStore;