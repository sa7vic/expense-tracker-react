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
                })),

            // Budget Management Features
            setBudget: (amount, period = 'monthly') =>
                set(() => ({
                    budget: amount,
                    budgetPeriod: period
                })),

            getBudgetStatus: () => {
                const { transactions, budget, budgetPeriod } = get();
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                const currentWeek = Math.ceil(now.getDate() / 7);

                let periodTransactions = transactions;

                // Filter transactions by budget period
                if (budgetPeriod === 'monthly') {
                    periodTransactions = transactions.filter(t => {
                        const transactionDate = new Date(t.date || Date.now());
                        return transactionDate.getMonth() === currentMonth && 
                               transactionDate.getFullYear() === currentYear;
                    });
                } else if (budgetPeriod === 'weekly') {
                    periodTransactions = transactions.filter(t => {
                        const transactionDate = new Date(t.date || Date.now());
                        const transactionWeek = Math.ceil(transactionDate.getDate() / 7);
                        return transactionWeek === currentWeek && 
                               transactionDate.getMonth() === currentMonth &&
                               transactionDate.getFullYear() === currentYear;
                    });
                }

                const totalExpenses = periodTransactions
                    .filter(t => t.amount < 0)
                    .reduce((total, t) => total + Math.abs(t.amount), 0);

                const remaining = budget - totalExpenses;
                const percentageUsed = budget > 0 ? (totalExpenses / budget) * 100 : 0;

                return {
                    budget,
                    spent: totalExpenses,
                    remaining,
                    percentageUsed,
                    isOverBudget: totalExpenses > budget,
                    period: budgetPeriod
                };
            },

            // Filtering and Search Features
            setFilter: (text, type = 'all') =>
                set(() => ({
                    filterText: text,
                    filterType: type
                })),

            getFilteredTransactions: () => {
                const { transactions, filterText, filterType } = get();
                
                return transactions.filter(transaction => {
                    // Text filter
                    const matchesText = filterText === '' || 
                        transaction.text.toLowerCase().includes(filterText.toLowerCase());
                    
                    // Type filter
                    let matchesType = true;
                    if (filterType === 'income') {
                        matchesType = transaction.amount > 0;
                    } else if (filterType === 'expense') {
                        matchesType = transaction.amount < 0;
                    }
                    
                    return matchesText && matchesType;
                });
            },

            // Advanced Analytics
            getTransactionAnalytics: () => {
                const { transactions } = get();
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

                const currentMonthTransactions = transactions.filter(t => {
                    const date = new Date(t.date || Date.now());
                    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
                });

                const lastMonthTransactions = transactions.filter(t => {
                    const date = new Date(t.date || Date.now());
                    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
                });

                const currentMonthExpenses = currentMonthTransactions
                    .filter(t => t.amount < 0)
                    .reduce((total, t) => total + Math.abs(t.amount), 0);

                const lastMonthExpenses = lastMonthTransactions
                    .filter(t => t.amount < 0)
                    .reduce((total, t) => total + Math.abs(t.amount), 0);

                const expenseChange = lastMonthExpenses > 0 ? 
                    ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;

                // Category analysis
                const categoryTotals = {};
                transactions.forEach(t => {
                    const category = t.category || 'Uncategorized';
                    if (!categoryTotals[category]) {
                        categoryTotals[category] = { income: 0, expense: 0 };
                    }
                    if (t.amount > 0) {
                        categoryTotals[category].income += t.amount;
                    } else {
                        categoryTotals[category].expense += Math.abs(t.amount);
                    }
                });

                return {
                    currentMonthExpenses,
                    lastMonthExpenses,
                    expenseChange,
                    categoryTotals,
                    totalTransactions: transactions.length,
                    averageTransaction: transactions.length > 0 ? 
                        transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length : 0
                };
            }
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