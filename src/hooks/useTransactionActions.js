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
  const getTotalBalance = useTransactionStore((state) => state.getTotalBalance);
  const getIncome = useTransactionStore((state) => state.getIncome);
  const getExpense = useTransactionStore((state) => state.getExpense);

  return {
    transactions,
    totalBalance: getTotalBalance(),
    income: getIncome(),
    expense: getExpense(),
  };
};