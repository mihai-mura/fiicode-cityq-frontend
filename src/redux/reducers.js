import { combineReducers } from 'redux';

const modals = (
	state = {
		login: false,
		register: false,
		createPost: false,
		createAdmin: false,
		createModerator: false,
		updatePostStatus: false,
		editPost: false,
	},
	action
) => {
	switch (action.type) {
		case 'login':
			return { ...state, login: action.payload };
		case 'register':
			return { ...state, register: action.payload };
		case 'createPost':
			return { ...state, createPost: action.payload };
		case 'createAdmin':
			return { ...state, createAdmin: action.payload };
		case 'createModerator':
			return { ...state, createModerator: action.payload };
		case 'updatePostStatus':
			return { ...state, updatePostStatus: action.payload };
		case 'editPost':
			return { ...state, editPost: action.payload };
		default:
			return state;
	}
};

const loggedUser = (state = null, action) => {
	switch (action.type) {
		case 'setLoggedUser':
			return action.payload;
		case 'addUpvotes':
			return {
				...state,
				upvotedPosts: [...state.upvotedPosts, action.payload],
			};
		case 'removeUpvotes':
			return {
				...state,
				upvotedPosts: state.upvotedPosts.filter((post) => post !== action.payload),
			};
		case 'addDownvotes':
			return {
				...state,
				downvotedPosts: [...state.downvotedPosts, action.payload],
			};
		case 'removeDownvotes':
			return {
				...state,
				downvotedPosts: state.downvotedPosts.filter((post) => post !== action.payload),
			};
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
	modals,
	loggedUser,
});

export default Masterducer;
