import useTransactionStore from '../store/transactionStore';

export const useTransactionActions = () => {
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);
  const clearAllTransactions = useTransactionStore((state) => state.clearAllTransactions);
  const resetToInitial = useTransactionStore((state) => state.resetToInitial);

  return {
    addTransaction,
    deleteTransaction,
    clearAllTransactions,
    resetToInitial,
  };
};

export const useTransactionData = () => {
  const transactions = useTransactionStore((state) => state.transactions);

  const totalBalance = transactions.reduce((total, transaction) => total + transaction.amount, 0);
  const income = transactions
    .filter(transaction => transaction.amount > 0)
    .reduce((total, transaction) => total + transaction.amount, 0);
  const expense = transactions
    .filter(transaction => transaction.amount < 0)
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);

  return {
    transactions,
    totalBalance,
    income,
    expense,
  };
};