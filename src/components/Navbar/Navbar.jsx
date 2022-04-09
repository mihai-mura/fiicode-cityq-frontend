import React, { useEffect, useRef, useState } from 'react';
import './Navbar.scss';
import { FiBell } from 'react-icons/fi';
import { BiCommentDetail } from 'react-icons/bi';
// import { FiSearch } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { changeAuthModal, setLoggedUser } from '../../redux/actions';
import { NavLink } from 'react-router-dom';
import UrlFromNodeImg from '../UrlFromNodeImg';
import { useClickOutside } from '@mantine/hooks';

const Navbar = () => {
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const dispatch = useDispatch();
	const loggedUser = useSelector((state) => state.loggedUser);
	const userModalRef = useClickOutside(() => setUserMenuOpen(false));

	const handleLoggout = () => {
		dispatch(setLoggedUser(null));
		localStorage.removeItem('api-token');
	};

	const userNotLoggedIcons = (
		<>
			<div className='log-in-button' onClick={() => dispatch(changeAuthModal('login', true))}>
				Log In
			</div>
			<div className='sign-up-button' onClick={() => dispatch(changeAuthModal('register', true))}>
				Sign Up
			</div>
		</>
	);

	const userLoggedIcons = (
		<>
			<BiCommentDetail className='user-icon comments' />
			<FiBell className='user-icon notifications' />
			<UrlFromNodeImg
				imageurl={`${process.env.REACT_APP_API_URL}/users/profile-pic/${loggedUser && loggedUser._id}`}
				alt='user'
				className='user-icon user-profilePic'
				onClick={() => {
					if (!userMenuOpen) setUserMenuOpen(true);
				}}
			/>
			{userMenuOpen && (
				<div className='log-out' ref={userModalRef}>
					<div className='logout-top-part'>
						<NavLink className='logout-link' to='/'>
							Profile settings
						</NavLink>
						<NavLink className='logout-link' to='/'>
							View Profile
						</NavLink>
					</div>
					<NavLink className='logout-link' to='/' onClick={handleLoggout}>
						Log out
					</NavLink>
				</div>
			)}
		</>
	);

	return (
		<div className='navbar'>
			{/* <div className='slide-content'>
				<div className='search'>
					<div className='search-icon'>
						<FiSearch />
					</div>
					<input className='search-input' placeholder='Search anything' />
				</div>
			</div> */}
			<div className='navbar-buttons'>{loggedUser ? userLoggedIcons : userNotLoggedIcons}</div>
		</div>
	);
};

export default Navbar;
