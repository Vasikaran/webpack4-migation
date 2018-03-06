import { createStore, combineReducers } from 'redux';

let initialState = {
	count: 0
};

let count = (state = 0, action = {}) => {
	let { type } = action;
	switch (type) {
		case 'INCREASE':
			return state + 1;
		case 'DECREASE':
			return state - 1;
		default:
			return state;
	}
};

let reducers = combineReducers({ count });

let store = createStore(reducers, initialState);

export default store;
