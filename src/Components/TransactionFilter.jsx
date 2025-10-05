import React from 'react';
import useTransactionStore from '../store/transactionStore';

export const TransactionFilter = () => {
  const filterText = useTransactionStore((state) => state.filterText);
  const filterType = useTransactionStore((state) => state.filterType);
  const setFilter = useTransactionStore((state) => state.setFilter);
  const getFilteredTransactions = useTransactionStore((state) => state.getFilteredTransactions);
  
  const filteredTransactions = getFilteredTransactions();
  const allTransactions = useTransactionStore((state) => state.transactions);

  const handleSearchChange = (e) => {
    setFilter(e.target.value, filterType);
  };

  const handleTypeChange = (e) => {
    setFilter(filterText, e.target.value);
  };

  const clearFilter = () => {
    setFilter('', 'all');
  };

  return (
    <div className="transaction-filter" style={{
      margin: '20px 0',
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa'
    }}>
      <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
        Filter Transactions 
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
        
        {(filterText || filterType !== 'all') && (
          <button
            onClick={clearFilter}
            style={{
              padding: '8px 12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Quick filter buttons */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', color: '#666', alignSelf: 'center' }}>Quick filters:</span>
        {['Salary', 'Rent', 'Coffee', 'Groceries'].map(term => (
          <button
            key={term}
            onClick={() => setFilter(term, filterType)}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              backgroundColor: filterText === term ? '#007bff' : '#e9ecef',
              color: filterText === term ? 'white' : '#333',
              border: '1px solid #ccc',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            {term}
          </button>
        ))}
      </div>

      {/* Filter summary */}
      {filteredTransactions.length !== allTransactions.length && (
        <div style={{
          marginTop: '10px',
          padding: '8px',
          backgroundColor: '#d1ecf1',
          border: '1px solid #bee5eb',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#0c5460'
        }}>
          <strong>Filter Active:</strong> 
          {filterText && ` Text: "${filterText}"`}
          {filterText && filterType !== 'all' && ', '}
          {filterType !== 'all' && ` Type: ${filterType}`}
        </div>
      )}
    </div>
  );
};