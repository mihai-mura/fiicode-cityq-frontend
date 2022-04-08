import React, { useState } from 'react';
import './Navbar.scss';
import { FiBell } from 'react-icons/fi';
import { BiCommentDetail } from 'react-icons/bi';
import { FiSearch } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { changeAuthModal, changeUserLogged } from '../../redux/actions';
import getFirebaseFileURL from '../../utils/firebaseFileURL';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);
	const dispatch = useDispatch();
	const userLogged = useSelector((state) => state.userLogged);

	const handleLoggout = () => {
		dispatch(changeUserLogged(false));
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
			<img
				// src={`${process.env.REACT_APP_API_URL}/users/profile-pic/${localStorage.getItem('userId')}`}
				src={getFirebaseFileURL('user-profilePics', `${localStorage.getItem('userId')}.jpg`)}
				alt='user'
				className='user-icon user-profilePic'
				onClick={toggle}
			/>
			{isOpen && (
				<div className='log-out'>
					<div className='logout-top-part'>
						<NavLink className='logout-link' to='/'>
							Profile settings
						</NavLink>
						<NavLink className='logout-link' to='/'>
							View Profile
						</NavLink>
					</div>
					<NavLink className='logout-link' to='/dashboard' onClick={handleLoggout}>
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
			<div className='navbar-buttons'>{userLogged ? userLoggedIcons : userNotLoggedIcons}</div>
		</div>
	);
};

export default Navbar;
