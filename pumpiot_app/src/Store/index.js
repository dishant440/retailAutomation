import React from "react";

import {AppContext} from "./context";

import StoreReducer from "./reducer";

const initialValues = {
    loading: false,
    reload: false,
    ticket: false,
    settings: {
        alpg_color: '#0afec0',
        petrol_color: '#c9f2d0',
        diesel_color: '#9b923e'
    }
};

const Store = ({children}) => {

    // also set to the state.
    initialValues.user = localStorage.getItem('USER') ? JSON.parse(localStorage.getItem('USER')) : false;

    const [state, dispatch] = React.useReducer(StoreReducer, initialValues);

    return (
        <AppContext.Provider value={{state, dispatch}}>
            {children}
        </AppContext.Provider>
    );
};

export default Store;
