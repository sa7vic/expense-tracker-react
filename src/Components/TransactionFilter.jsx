import React from 'react';
import useTransactionStore from '../store/transactionStore';

export const TransactionFilter = () => {
  const filterText = useTransactionStore((state) => state.filterText);
  const filterType = useTransactionStore((state) => state.filterType);
  const setFilter = useTransactionStore((state) => state.setFilter);
  const allTransactions = useTransactionStore((state) => state.transactions);
  
  // NEW: Add sorting state and methods
  const sortBy = useTransactionStore((state) => state.sortBy);
  const sortOrder = useTransactionStore((state) => state.sortOrder);
  const setSorting = useTransactionStore((state) => state.setSorting);
  const getSortedTransactions = useTransactionStore((state) => state.getSortedTransactions);
  
  // Use the new getSortedTransactions method instead of local filtering
  const filteredTransactions = getSortedTransactions();

  const handleSearchChange = (e) => {
    setFilter(e.target.value, filterType);
  };

  const handleTypeChange = (e) => {
    setFilter(filterText, e.target.value);
  };

  // NEW: Add sorting handler
  const handleSortChange = (e) => {
    const [newSortBy, newSortOrder] = e.target.value.split('-');
    setSorting(newSortBy, newSortOrder);
  };

  const clearFilter = () => {
    setFilter('', 'all');
  };

  return (
    <div className="transaction-filter" style={{
      margin: '20px 0',
      padding: '20px'
    }}>
      <h4 style={{ margin: '0 0 18px 0' }}>
        🔍 Filter & Sort Transactions 
        <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px' }}>
          ({filteredTransactions.length} of {allTransactions.length} shown)
        </span>
      </h4>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <input
            type="text"
            placeholder="Search transactions..."
            value={filterText}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
        
        <select
          value={filterType}
          onChange={handleTypeChange}
          style={{
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            minWidth: '120px'
          }}
        >
          <option value="all">All Types</option>
          <option value="income">Income Only</option>
          <option value="expense">Expenses Only</option>
        </select>

        {/* NEW: Add sorting dropdown */}
        <select
          value={${sortBy}-${sortOrder}}
          onChange={handleSortChange}
          style={{
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            minWidth: '140px'
          }}
        >
          <option value="date-desc">📅 Newest First</option>
          <option value="date-asc">📅 Oldest First</option>
          <option value="amount-desc">💰 Highest Amount</option>
          <option value="amount-asc">💰 Lowest Amount</option>
          <option value="text-asc">🔤 A to Z</option>
          <option value="text-desc">🔤 Z to A</option>
          <option value="category-asc">📂 Category A-Z</option>
          <option value="category-desc">📂 Category Z-A</option>
        </select>
        
        {(filterText || filterType !== 'all') && (
          <button
            onClick={clearFilter}
            className="btn btn-secondary btn-small"
          >
            ✖ Clear Filter
          </button>
        )}
      </div>

      {/* Keep your existing quick filter buttons */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', color: '#666', alignSelf: 'center' }}>Quick filters:</span>
        {['Salary', 'Rent', 'Coffee', 'Groceries'].map(term => (
          <button
            key={term}
            onClick={() => setFilter(term, filterType)}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              border: '1px solid #ddd',
              borderRadius: '12px',
              background: filterText === term ? '#e3f2fd' : 'white',
              cursor: 'pointer'
            }}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
};
