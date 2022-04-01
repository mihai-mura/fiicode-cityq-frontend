import { combineReducers } from 'redux';

const authModal = (state = { login: false, register: false }, action) => {
	switch (action.type) {
		case 'login':
			return { ...state, login: action.payload };
		case 'register':
			return { ...state, register: action.payload };
		default:
			return state;
	}
};

const Masterducer = combineReducers({
	authModal,
});

export default Masterducer;