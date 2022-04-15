import React from 'react';
import './MobileSidebar.scss';
import { MdOutlineExplore, MdOutlineDashboardCustomize } from 'react-icons/md';
import { AiOutlineUser } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import LANGUAGE from '../../utils/languages.json';
import { useDispatch, useSelector } from 'react-redux';
import { changeModalState, setLanguage } from '../../redux/actions';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import UrlFetchImg from '../UrlFetchImage/UrlFetchImg';

const MobileSidebar = ({ mobileSidebarOpen, toggleMobileMenu }) => {
	const dispatch = useDispatch();
	const loggedUser = useSelector((state) => state.loggedUser);
	const selectedLanguage = useSelector((state) => state.language);
	const UserRoutes = [
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

	const ModeratorRoutes = [
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

	const AdminRoutes = [
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
			path: '/users',
			name: 'Users',
			icon: <AiOutlineUser />,
		},
		{
			path: '/settings',
			name: 'Settings',
			icon: <FiSettings />,
		},
	];
	const userNotLoggedIcons = (
		<>
			<div className='log-in-button' onClick={() => dispatch(changeModalState('login', true))}>
				{LANGUAGE.navbar_button_login[selectedLanguage]}
			</div>
			<div className='sign-up-button' onClick={() => dispatch(changeModalState('register', true))}>
				{LANGUAGE.navbar_button_register[selectedLanguage]}
			</div>
		</>
	);
	const userLoggedIcons = (
		<div className='userLogged-top'>
			<UrlFetchImg
				imageurl={`${process.env.REACT_APP_API_URL}/users/profile-pic/${loggedUser && loggedUser._id}`}
				alt='user'
				className='user-icon user-profilePic'
			/>
			{/* <div className='user-menu-link'>{`${loggedUser.firstName} ${loggedUser.lastName}`}</div> */} //!mihai redux
		</div>
	);
	return (
		<div
			style={{ opacity: mobileSidebarOpen ? '100%' : '0', left: mobileSidebarOpen ? '0' : '-100%' }}
			className='mobilesidebar-container'>
			<div className='top-section'>
				<div className='mobilesidebar-logo'>{loggedUser ? userLoggedIcons : userNotLoggedIcons}</div>
				<div className='mobile-arrow'>
					<MdOutlineKeyboardArrowLeft onClick={toggleMobileMenu} />
				</div>
			</div>
			<section className='routes'>
				{UserRoutes.map((route) => (
					<NavLink to={route.path} key={route.name} className='link' onClick={toggleMobileMenu}>
						<div className='icon'>{route.icon}</div>
						{mobileSidebarOpen && <div className='link_text'>{route.name}</div>}
					</NavLink>
				))}
			</section>
			<div
				className='language-switch'
				onClick={() => {
					if (selectedLanguage === 'en') {
						dispatch(setLanguage('ro'));
						localStorage.setItem('language', 'ro');
					} else {
						dispatch(setLanguage('en'));
						localStorage.setItem('language', 'en');
					}
				}}></div>
		</div>
	);
};

export default MobileSidebar;
