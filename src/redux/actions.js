export const changeModalState = (type, payload) => ({
	type, //* type: login, register, createPost
	payload,
});

export const setLoggedUser = (payload) => ({
	type: 'setLoggedUser',
	payload,
});

export const addLoggedUserUpotes = (payload) => ({
	type: 'addUpvotes',
	payload,
});
export const removeLoggedUserUpotes = (payload) => ({
	type: 'removeUpvotes',
	payload,
});
export const addLoggedUserDownvotes = (payload) => ({
	type: 'addDownvotes',
	payload,
});
export const removeLoggedUserDownvotes = (payload) => ({
	type: 'removeDownvotes',
	payload,
});

export const setLanguage = (payload) => ({
	type: 'setLanguage',
	payload,
});
