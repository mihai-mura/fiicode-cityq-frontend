import { useState, useEffect } from 'react';
import './MobileSidebar.scss';
import ROLE from '../../utils/roles';
import { MdOutlineExplore, MdOutlineDashboardCustomize } from 'react-icons/md';
import { AiOutlineUser } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { setLoggedUser } from '../../redux/actions';
import LANGUAGE from '../../utils/languages.json';
import { useDispatch, useSelector } from 'react-redux';
import { changeModalState, setLanguage } from '../../redux/actions';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import UrlFetchImg from '../UrlFetchImage/UrlFetchImg';
import { Button } from '@mantine/core';
import getRoutes from '../../utils/sidebarRoutes';

const MobileSidebar = ({ mobileSidebarOpen, toggleMobileMenu }) => {
	const dispatch = useDispatch();
	const loggedUser = useSelector((state) => state.loggedUser);
	const selectedLanguage = useSelector((state) => state.language);
	const [sidebarRoutes, setSidebarRoutes] = useState([]);

	//setSidebarRoutes according to loggedUser
	useEffect(() => {
		setSidebarRoutes(getRoutes(loggedUser?.role, selectedLanguage));
	}, [loggedUser, selectedLanguage]);

	const handleLoggout = () => {
		dispatch(setLoggedUser(null));
		localStorage.removeItem('api-token');
		toggleMobileMenu();
	};

	const userNotLoggedIcons = (
		<>
			<div className='buttons-container'>
				<Button
					className='log-in-button'
					onClick={() => {
						dispatch(changeModalState('login', true));
						toggleMobileMenu();
					}}>
					{LANGUAGE.navbar_button_login[selectedLanguage]}
				</Button>
				<Button
					className='sign-up-button'
					onClick={() => {
						dispatch(changeModalState('register', true));
						toggleMobileMenu();
					}}>
					{LANGUAGE.navbar_button_register[selectedLanguage]}
				</Button>
			</div>
		</>
	);
	const userLoggedIcons = (
		<div className='userLogged-top'>
			<UrlFetchImg
				url={`${process.env.REACT_APP_API_URL}/users/profile-pic/${loggedUser?._id}`}
				alt='user'
				className='user-icon user-profilePic'
			/>
			<div className='user-menu-link'>{`${loggedUser?.firstName} ${loggedUser?.lastName}`}</div>
		</div>
	);
	const userNotLoggedContent = (
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
			}}>
			<span style={{ color: selectedLanguage === 'en' ? '#000' : '#afb0b3' }}>En</span>
			<span>/</span>
			<span style={{ color: selectedLanguage === 'ro' ? '#000' : '#afb0b3' }}>Ro</span>
		</div>
	);
	const userLoggedContent = (
		<div className='content-mobilesidebar'>
			<section className='routes'>
				{sidebarRoutes?.map((route) => (
					<NavLink to={route.path} key={route.name} className='link' onClick={toggleMobileMenu}>
						<div className='icon'>{route.icon}</div>
						{mobileSidebarOpen && <div className='link_text'>{route.name}</div>}
					</NavLink>
				))}
			</section>
			<div className='bottom-mobilesidebar'>
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
					}}>
					<span style={{ color: selectedLanguage === 'en' ? '#000' : '#afb0b3' }}>En</span>
					<span>/</span>
					<span style={{ color: selectedLanguage === 'ro' ? '#000' : '#afb0b3' }}>Ro</span>
				</div>
				<div className='log-out-button' onClick={handleLoggout}>
					{LANGUAGE.navbar_user_menu_logout[selectedLanguage]}
				</div>
			</div>
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
			{loggedUser ? userLoggedContent : userNotLoggedContent}
		</div>
	);
};

export default MobileSidebar;
