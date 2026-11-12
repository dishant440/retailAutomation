import {
    DATA,
    LOADING,
    PUMPS,
    RELOAD, PRICETODAY, TRX, EMPLOYEES, SHIFTS_TODAY, SHIFTS, SETTINGS, LASTTRX
} from "./actions";

const StoreReducer = (state, action) => {
    switch (action.type) {

        case LOADING:
            return {...state, loading: action.payload};

        case SHIFTS_TODAY:
            return {...state, shifts_today: action.payload};
        case SHIFTS:
            return {...state, shifts: action.payload};

        case EMPLOYEES:
            return {...state, employees: action.payload};

        case DATA:
            return {...state, data: action.payload};

        case PUMPS:
            return {...state, ticket: action.payload};
        case PRICETODAY:
            return {...state, todayprice: action.payload};
        case TRX:
            return {...state, trx: action.payload};
        case LASTTRX:
            return {...state, last_trx: action.payload};
        case SETTINGS:
            return {...state, settings: action.payload};

        case RELOAD:
            return {...state, reload: action.payload};

        default:
            throw new Error("Action type must be defined.");
    }
};

export default StoreReducer;
