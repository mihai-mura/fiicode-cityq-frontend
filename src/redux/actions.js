export const changeModalState = (type, payload) => ({
	type, //* type: login, register, createPost, createAdmin, createModerator, updatePostStatus, editPost
	payload,
});

export const setLoggedUser = (payload) => ({
	type: 'setLoggedUser',
	payload,
});

export const addLoggedUserUpvotes = (payload) => ({
	type: 'addUpvotes',
	payload,
});
export const removeLoggedUserUpvotes = (payload) => ({
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

export const addFavourite = (payload) => ({
	type: 'addFavourite',
	payload,
});

export const removeFavourite = (payload) => ({
	type: 'removeFavourite',
	payload,
});

export const setLanguage = (payload) => ({
	type: 'setLanguage',
	payload,
});
