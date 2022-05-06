import { useState } from 'react';
import './Navbar.scss';
import { IconBell, IconHeart, IconMessageDots } from '@tabler/icons';
// import { FiSearch } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { changeModalState, setLanguage } from '../../redux/actions';
import UrlFetchImg from '../UrlFetchImage/UrlFetchImg';
import LANGUAGE from '../../utils/languages.json';
import UserMenu from '../UserMenu/UserMenu';
import CityQLogo from '../../images/CityQ.svg';
import MobileHamburger from '../../images/mobile-hamburger.svg';
import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import ROLE from '../../utils/roles';

const Navbar = ({ toggleMobileMenu }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const loggedUser = useSelector((state) => state.loggedUser);
	const selectedLanguage = useSelector((state) => state.language);
	const [userMenuOpen, setUserMenuOpen] = useState(false);

	const userNotLoggedIcons = (
		<>
			<Button className='log-in-button' onClick={() => dispatch(changeModalState('login', true))}>
				{LANGUAGE.navbar_button_login[selectedLanguage]}
			</Button>
			<Button className='sign-up-button' onClick={() => dispatch(changeModalState('register', true))}>
				{LANGUAGE.navbar_button_register[selectedLanguage]}
			</Button>
		</>
	);

	const userLoggedIcons = (
		<>
			{loggedUser?.role === ROLE.USER && <IconHeart className='favourites-icon' onClick={() => navigate('/favourites')} />}
			<UrlFetchImg
				url={`${process.env.REACT_APP_API_URL}/users/profile-pic/${loggedUser?._id}`}
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
			<div className='fixed-content'>
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

				{loggedUser ? userLoggedIcons : userNotLoggedIcons}
			</div>

			<div className='mobile-navigation'>
				<img src={MobileHamburger} onClick={toggleMobileMenu} className='mobile-hamburger' alt='Mobile Hamburger' />
				<img src={CityQLogo} className='cityq-logo' alt='CityQLogo' />
			</div>
		</div>
	);
};

export default Navbar;
