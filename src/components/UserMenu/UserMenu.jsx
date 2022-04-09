import './UserMenu.scss';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedUser } from '../../redux/actions';
import { useClickOutside } from '@mantine/hooks';
import LANGUAGE from '../../utils/languages.json';

const UserMenu = (props) => {
	const dispatch = useDispatch();
	const selectedLanguage = useSelector((state) => state.language);
	const loggedUser = useSelector((state) => state.loggedUser);

	const userMenuRef = useClickOutside(() => props.closeUserMenu(), ['mouseup', 'touchend']);

	const handleLoggout = () => {
		props.closeUserMenu();
		dispatch(setLoggedUser(null));
		localStorage.removeItem('api-token');
	};

	return (
		<div className='user-menu' ref={userMenuRef}>
			<div className='user-menu-top-part'>
				<div className='user-menu-link'>{`${loggedUser.firstName} ${loggedUser.lastName}`}</div>
				<NavLink className='user-menu-link' to='/settings'>
					{LANGUAGE.navbar_user_menu_profile_settings[selectedLanguage]}
				</NavLink>
			</div>
			<NavLink className='user-menu-link' to='/' onClick={handleLoggout}>
				{LANGUAGE.navbar_user_menu_logout[selectedLanguage]}
			</NavLink>
		</div>
	);
};
export default UserMenu;
