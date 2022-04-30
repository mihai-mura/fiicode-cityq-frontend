import './Sidebar.scss';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons';
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
		<motion.div animate={{ width: isOpen ? '230px' : '90px' }} className='sidebar'>
			<div className='sidebar-top-section'>
				<NavLink to='/'>
					<img src={CityQLogo} alt='logo' to='/' />
				</NavLink>
				{isOpen && <h3 className='logo-name'>cityq</h3>}

				{isOpen ? (
					<div className='arrow'>
						<IconChevronLeft onClick={toggle} />
					</div>
				) : (
					<div className='arrow'>
						<IconChevronRight onClick={toggle} />
					</div>
				)}
			</div>
			<section className='routes'>
				{sidebarRoutes?.map((route) => (
					<NavLink
						to={loggedUser ? route.path : '/'}
						onClick={loggedUser ? null : route.path === '/' ? null : () => dispatch(changeModalState('login', true))}
						key={route.name}
						className='sidebar-link'>
						<div className='sidebar-icon'>{route.icon}</div>
						{isOpen && <div className='sidebar-link-text'>{route.name}</div>}
					</NavLink>
				))}
			</section>
		</motion.div>
	);
};

export default Sidebar;
