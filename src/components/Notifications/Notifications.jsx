export const errorNotification = (title = 'Something went wrong', message = '') => ({
	title: title,
	message: message,
	disallowClose: true,
	autoClose: 3000,
	color: 'red',
	loading: false,
	styles: (theme) => ({
		root: {
			backgroundColor: theme.colors.gray,
			borderColor: theme.colors.gray,
			borderRadius: '16px',
			paddingLeft: '18px',

			'&::before': { borderRadius: '16px', top: '13.3333px', bottom: '13.3333px', left: '5px' },
		},

		title: { color: theme.white },
		description: { color: '#afb0b3' },
	}),
});

export const infoNotification = (title, message = '', color = 'green') => ({
	title: title,
	message: message,
	disallowClose: true,
	autoClose: 3000,
	color: color,
	loading: false,
	styles: (theme) => ({
		root: {
			backgroundColor: theme.colors.gray,
			borderColor: theme.colors.gray,
			borderRadius: '16px',
			paddingLeft: '18px',

			'&::before': { borderRadius: '16px', top: '13.3333px', bottom: '13.3333px', left: '5px' },
		},

		title: { color: theme.white },
		description: { color: '#afb0b3' },
	}),
});
