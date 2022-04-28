import LANGUAGE from './languages.json';
import { MdOutlineExplore, MdOutlineDashboardCustomize } from 'react-icons/md';
import { AiOutlineUser } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import ROLE from './roles';

//!  language based route name
const getRoutes = (role, selectedLanguage) => {
	switch (role) {
		case ROLE.USER:
			return [
				{
					path: '/',
					name: LANGUAGE.sidebar_explore[selectedLanguage],
					icon: <MdOutlineExplore />,
				},
				{
					path: '/profile',
					name: LANGUAGE.sidebar_profile[selectedLanguage],
					icon: <AiOutlineUser />,
				},
				{
					path: '/settings',
					name: LANGUAGE.sidebar_settings[selectedLanguage],
					icon: <FiSettings />,
				},
			];
		case ROLE.MODERATOR:
			return [
				{
					path: '/',
					name: 'Posts',
					icon: <MdOutlineExplore />,
				},
				{
					path: '/dashboard',
					name: 'Requests',
					icon: <MdOutlineDashboardCustomize />,
				},
				{
					path: '/settings',
					name: 'Settings',
					icon: <FiSettings />,
				},
			];
		case ROLE.LOCAL_ADMIN:
			return [
				{
					path: '/',
					name: 'Explore',
					icon: <MdOutlineExplore />,
				},
				{
					path: '/dashboard',
					name: 'Dashboard',
					icon: <MdOutlineDashboardCustomize />,
				},
				{
					path: '/local-admin/moderators',
					name: 'Moderators',
					icon: <AiOutlineUser />,
				},
				{
					path: '/local-admin/settings',
					name: 'Settings',
					icon: <FiSettings />,
				},
			];
		case ROLE.GENERAL_ADMIN:
			return [
				{
					path: '/general-admin',
					name: 'Local Admins',
					icon: <AiOutlineUser />,
				},
				{
					path: '/general-admin/settings',
					name: 'Settings',
					icon: <FiSettings />,
				},
			];
		default:
			return [
				{
					path: '/',
					name: LANGUAGE.sidebar_explore[selectedLanguage],
					icon: <MdOutlineExplore />,
				},
				{
					path: '/profile',
					name: LANGUAGE.sidebar_profile[selectedLanguage],
					icon: <AiOutlineUser />,
				},
				{
					path: '/settings',
					name: LANGUAGE.sidebar_settings[selectedLanguage],
					icon: <FiSettings />,
				},
			];
	}
};

export default getRoutes;
