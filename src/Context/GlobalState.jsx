import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer'
const initialState = {
    transactions: [
        { id: 1, text: 'Recharge', amount: -20 },
        { id: 2, text: 'Salary', amount: 300 },
        { id: 3, text: 'Book', amount: -10 },
        { id: 4, text: 'Rent', amount: 150 }
    ]
}

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    function deleteTransaction(id){
        dispatch({
        type: 'DELETE_TRANSACTION',
        payload: id
    });
}

    function addTransaction(transaction){
        dispatch({
        type: 'ADD_TRANSACTION',
        payload: transaction
    });
}

    return (<GlobalContext.Provider value = {{transactions: state.transactions, deleteTransaction, addTransaction}}>
        {children}
    </GlobalContext.Provider>);
}