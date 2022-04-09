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

const loggedUser = (state = null, action) => {
	switch (action.type) {
		case 'setLoggedUser':
			return action.payload;

		default:
			return state;
	}
};

const language = (state = 'en', action) => {
	switch (action.type) {
		case 'setLanguage':
			return action.payload;
		default:
			return state;
	}
};

const Masterducer = combineReducers({
	language,
	authModal,
	loggedUser,
});

export default Masterducer;
