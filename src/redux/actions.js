export const changeAuthModal = (type, payload) => ({
	type,
	payload,
});

//!for later
export const changeLoggedUser = (payload) => ({
	type: 'changeLoggedUser',
	payload,
});

export const setLoggedUser = (payload) => ({
	type: 'setLoggedUser',
	payload,
});
