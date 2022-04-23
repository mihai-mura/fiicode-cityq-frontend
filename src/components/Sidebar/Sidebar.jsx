import './Sidebar.scss';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { MdOutlineExplore, MdOutlineDashboardCustomize } from 'react-icons/md';
import { AiOutlineUser } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import CityQLogo from '../../images/logo-cityq.svg';
import { useState } from 'react';
import LANGUAGE from '../../utils/languages.json';
import { useDispatch, useSelector } from 'react-redux';
import { changeModalState } from '../../redux/actions';

const Sidebar = () => {
	const dispatch = useDispatch();
	const selectedLanguage = useSelector((state) => state.language);
	const loggedUser = useSelector((state) => state.loggedUser);
	const [isOpen, setIsOpen] = useState(true);

	const toggle = () => setIsOpen(!isOpen);

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

	//! when user not logged in show login modal
	return (
		<motion.div animate={{ width: isOpen ? '210px' : '90px' }} className='sidebar'>
			<div className='top-section'>
				<NavLink to='/'>
					<img src={CityQLogo} alt='logo' to='/' />
				</NavLink>
				{isOpen && <h3 className='logo-name'>cityq</h3>}

				{isOpen ? (
					<div className='arrow'>
						<MdOutlineKeyboardArrowLeft onClick={toggle} />
					</div>
				) : (
					<div className='arrow'>
						<MdOutlineKeyboardArrowRight onClick={toggle} />
					</div>
				)}
			</div>
			<section className='routes'>
				{UserRoutes.map((route) => (
					<NavLink
						to={loggedUser ? route.path : '/'}
						onClick={loggedUser ? null : () => dispatch(changeModalState('login', true))}
						key={route.name}
						className='link'>
						<div className='icon'>{route.icon}</div>
						{isOpen && <div className='link_text'>{route.name}</div>}
					</NavLink>
				))}
			</section>
		</motion.div>
	);
};

export default Sidebar;
