import './Sidebar.scss';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import CityQLogo from '../../images/logo-cityq.svg';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeModalState } from '../../redux/actions';
import getRoutes from '../../utils/sidebarRoutes';

const Sidebar = () => {
	const dispatch = useDispatch();
	const selectedLanguage = useSelector((state) => state.language);
	const loggedUser = useSelector((state) => state.loggedUser);
	const [isOpen, setIsOpen] = useState(true);
	const [sidebarRoutes, setSidebarRoutes] = useState(null);

	const toggle = () => setIsOpen(!isOpen);

	//setSidebarRoutes according to loggedUser
	useEffect(() => {
		setSidebarRoutes(getRoutes(loggedUser?.role, selectedLanguage));
	}, [loggedUser, selectedLanguage]);

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
				{sidebarRoutes?.map((route) => (
					<NavLink
						to={loggedUser ? route.path : '/'}
						onClick={loggedUser ? null : route.path === '/' ? null : () => dispatch(changeModalState('login', true))}
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
