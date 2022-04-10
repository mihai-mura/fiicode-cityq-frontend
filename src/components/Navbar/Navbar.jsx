import React, { useEffect, useRef, useState } from 'react';
import './Navbar.scss';
import { FiBell } from 'react-icons/fi';
import { BiCommentDetail } from 'react-icons/bi';
// import { FiSearch } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { changeAuthModal, setLanguage } from '../../redux/actions';
import UrlFromNodeImg from '../UrlFromNodeImg';
import LANGUAGE from '../../utils/languages.json';
import UserMenu from '../UserMenu/UserMenu';

const Navbar = () => {
	const dispatch = useDispatch();
	const loggedUser = useSelector((state) => state.loggedUser);
	const selectedLanguage = useSelector((state) => state.language);
	const [userMenuOpen, setUserMenuOpen] = useState(false);

	const userNotLoggedIcons = (
		<>
			<div className='log-in-button' onClick={() => dispatch(changeAuthModal('login', true))}>
				{LANGUAGE.navbar_button_login[selectedLanguage]}
			</div>
			<div className='sign-up-button' onClick={() => dispatch(changeAuthModal('register', true))}>
				{LANGUAGE.navbar_button_register[selectedLanguage]}
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
			{userMenuOpen && <UserMenu closeUserMenu={() => setUserMenuOpen(false)} />}
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
			<div className='fixed-content'>{loggedUser ? userLoggedIcons : userNotLoggedIcons}</div>
		</div>
	);
};

export default Navbar;
