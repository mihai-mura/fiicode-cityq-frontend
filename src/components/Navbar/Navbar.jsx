import React from 'react';
import './Navbar.scss';
import { FiBell } from 'react-icons/fi';
import { BiCommentDetail } from 'react-icons/bi';
import UserImage from '../../images/user-image.png';
import { FiSearch } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { changeAuthModal } from '../../redux/actions';

const Navbar = () => {
	const dispatch = useDispatch();
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
			<div className='navbar-buttons'>
				{/* //! style user logged buttons */}
				{/* <div className='comments'>
					<BiCommentDetail />
				</div>
				<div className='bell'>
					<FiBell />
				</div>
				<div className='user'>
					<div className='user-image'>
						<img src={UserImage} alt='user' />
					</div>
				</div> */}
				<div className='log-in-button' onClick={() => dispatch(changeAuthModal('login', true))}>
					Log In
				</div>
				<div className='sign-up-button' onClick={() => dispatch(changeAuthModal('register', true))}>
					Sign Up
				</div>
			</div>
		</div>
	);
};

export default Navbar;
