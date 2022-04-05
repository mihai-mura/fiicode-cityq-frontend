import React from 'react';
import './Navbar.scss';
import { FiBell } from 'react-icons/fi';
import { BiCommentDetail } from 'react-icons/bi';
import UserImage from '../../images/user-image.png';
import { FiSearch } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { changeAuthModal } from '../../redux/actions';

const Navbar = () => {
	const dispatch = useDispatch();
	const userLogged = useSelector((state) => state.userLogged);

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
				src={`${process.env.REACT_APP_API_URL}/users/profile-pic/${localStorage.getItem('userId')}`}
				alt='user'
				className='user-profilePic'
			/>
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
