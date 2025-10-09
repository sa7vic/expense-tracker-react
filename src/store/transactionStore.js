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
            sortBy: 'date', // NEW: Add sort state
            sortOrder: 'desc', // NEW: Add sort order (desc = newest first)
            
            
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

            // NEW: Add sorting method
            setSorting: (sortBy, sortOrder = 'desc') =>
                set(() => ({
                    sortBy,
                    sortOrder
                })),

            // NEW: Add getter for sorted and filtered transactions
            getSortedTransactions: () => {
                const state = get();
                let filtered = state.transactions;

                // Apply filters
                if (state.filterText) {
                    filtered = filtered.filter(transaction =>
                        transaction.text.toLowerCase().includes(state.filterText.toLowerCase())
                    );
                }

                if (state.filterType !== 'all') {
                    filtered = filtered.filter(transaction => {
                        if (state.filterType === 'income') return transaction.amount > 0;
                        if (state.filterType === 'expense') return transaction.amount < 0;
                        return true;
                    });
                }

                // Apply sorting
                const sorted = [...filtered].sort((a, b) => {
                    let comparison = 0;
                    
                    switch (state.sortBy) {
                        case 'date':
                            comparison = new Date(a.date) - new Date(b.date);
                            break;
                        case 'amount':
                            comparison = Math.abs(a.amount) - Math.abs(b.amount);
                            break;
                        case 'text':
                            comparison = a.text.localeCompare(b.text);
                            break;
                        case 'category':
                            comparison = (a.category || '').localeCompare(b.category || '');
                            break;
                        default:
                            comparison = 0;
                    }

                    return state.sortOrder === 'desc' ? -comparison : comparison;
                });

                return sorted;
            }

        }),
        {
            name: 'expense-tracker-storage', 
            
            partialize: (state) => ({
                transactions: state.transactions,
                budget: state.budget,
                budgetPeriod: state.budgetPeriod,
                sortBy: state.sortBy, // NEW: Persist sort preferences
                sortOrder: state.sortOrder
            })
        }
    )
);

export default useTransactionStore;
