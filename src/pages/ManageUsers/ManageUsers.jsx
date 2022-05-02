import { Button, LoadingOverlay, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ROLE from '../../utils/roles';
import './ManageUsers.scss';
import { errorNotification } from '../../components/Notifications/Notifications';
import { changeModalState } from '../../redux/actions';
import UserCard from '../../components/UserCard/UserCard';
import { IconPlus, IconSearch } from '@tabler/icons';
import LANGUAGE from '../../utils/languages.json';
import EmptyStatePlaceholder from '../../components/EmptyStatePlaceholder/EmptyStatePlaceholder';

const GeneralAdminPanel = (props) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const loggedUser = useSelector((state) => state.loggedUser);
	const selectedLanguage = useSelector((state) => state.language);

	const [searchInput, setSearchInput] = useState('');
	const [users, setUsers] = useState([]);
	const [showingUsers, setShowingUsers] = useState([]);
	const [loadingOverlay, setLoadingOverlay] = useState(false);

	useEffect(() => {
		(async () => {
			if (loggedUser) {
				setLoadingOverlay(true);
				if (props.target === ROLE.LOCAL_ADMIN) {
					//get all admins
					const res = await fetch(`${process.env.REACT_APP_API_URL}/local-admins/all`, {
						method: 'GET',
						headers: {
							Authorization: `Bearer ${localStorage.getItem('api-token')}`,
						},
					});
					if (res.status === 200) {
						const response = await res.json();
						response.reverse();
						setUsers(response);
						setShowingUsers(response);
					} else {
						showNotification(errorNotification());
					}
				} else if (props.target === ROLE.MODERATOR) {
					//get all moderators
					const res = await fetch(`${process.env.REACT_APP_API_URL}/moderators/all`, {
						method: 'GET',
						headers: {
							Authorization: `Bearer ${localStorage.getItem('api-token')}`,
						},
					});
					if (res.status === 200) {
						const response = await res.json();
						response.reverse();
						setUsers(response);
						setShowingUsers(response);
					} else {
						showNotification(errorNotification());
					}
				}
				setLoadingOverlay(false);
			}
		})();
	}, [loggedUser, props.target]);

	const sortUsers = (input, userList) => {
		if (input.length >= 3) {
			let filteredUsers;
			if (input.includes(' ') && input.split(' ')[1]) {
				const finalInput = input.split(' ').map((word) => word.toLowerCase());
				if (props.target === ROLE.LOCAL_ADMIN) {
					filteredUsers = userList?.filter(
						(user) =>
							user.firstName.toLowerCase().includes(finalInput[0]) ||
							user.lastName.toLowerCase().includes(finalInput[0]) ||
							user.email.toLowerCase().includes(finalInput[0]) ||
							user.city.toLowerCase().includes(finalInput[0]) ||
							user.firstName.toLowerCase().includes(finalInput[1]) ||
							user.lastName.toLowerCase().includes(finalInput[1]) ||
							user.email.toLowerCase().includes(finalInput[1]) ||
							user.city.toLowerCase().includes(finalInput[1])
					);
				} else if (props.target === ROLE.MODERATOR) {
					filteredUsers = userList?.filter(
						(user) =>
							user.firstName.toLowerCase().includes(finalInput[0]) ||
							user.lastName.toLowerCase().includes(finalInput[0]) ||
							user.email.toLowerCase().includes(finalInput[0]) ||
							user.firstName.toLowerCase().includes(finalInput[1]) ||
							user.lastName.toLowerCase().includes(finalInput[1]) ||
							user.email.toLowerCase().includes(finalInput[1])
					);
				}
			} else {
				const finalInput = input.toLowerCase();
				if (props.target === ROLE.LOCAL_ADMIN) {
					filteredUsers = userList?.filter(
						(user) =>
							user.firstName.toLowerCase().includes(finalInput) ||
							user.lastName.toLowerCase().includes(finalInput) ||
							user.email.toLowerCase().includes(finalInput) ||
							user.city.toLowerCase().includes(finalInput)
					);
				} else if (props.target === ROLE.MODERATOR) {
					filteredUsers = userList?.filter(
						(user) =>
							user.firstName.toLowerCase().includes(finalInput) ||
							user.lastName.toLowerCase().includes(finalInput) ||
							user.email.toLowerCase().includes(finalInput)
					);
				}
			}
			setShowingUsers(filteredUsers);
		}
		if (input.length === 0) {
			setShowingUsers(userList);
		}
	};

	return (
		<div className='page page-manage-users'>
			<LoadingOverlay visible={loadingOverlay} />
			<div className='page-manage-users-header'>
				<Button
					className='add-user-button'
					radius='xl'
					size='md'
					variant='gradient'
					gradient={{ from: 'teal', to: 'blue', deg: 60 }}
					onClick={() => {
						if (props.target === ROLE.LOCAL_ADMIN) dispatch(changeModalState('createAdmin', true));
						if (props.target === ROLE.MODERATOR) dispatch(changeModalState('createModerator', true));
					}}>
					{props.target === ROLE.LOCAL_ADMIN && LANGUAGE.create_admin_button[selectedLanguage]}
					{props.target === ROLE.MODERATOR && LANGUAGE.create_moderator_button[selectedLanguage]}
				</Button>
				<Button
					className='add-user-button-mobile'
					radius='xl'
					size='md'
					variant='gradient'
					gradient={{ from: 'teal', to: 'blue', deg: 60 }}
					onClick={() => dispatch(changeModalState('createAdmin', true))}>
					<IconPlus style={{ width: '30px', height: '30px' }} />
				</Button>
				<TextInput
					icon={<IconSearch />}
					placeholder={LANGUAGE.search_placeholder[selectedLanguage]}
					radius='xl'
					size='lg'
					value={searchInput}
					onChange={(e) => {
						setSearchInput(e.currentTarget.value);
						sortUsers(e.currentTarget.value, users);
					}}
				/>
				{/* //! somewhere to show what city is the admin managing */}
				{props.target === ROLE.MODERATOR && <p>{loggedUser?.city}</p>}
			</div>
			<div className='page-manage-users-body'>
				{showingUsers.map((user, index) => (
					<UserCard
						key={index}
						target={props.target}
						_id={user._id}
						profileImg={user.profileImg}
						firstName={user.firstName}
						lastName={user.lastName}
						email={user.email}
						city={props.target === ROLE.LOCAL_ADMIN && user.city}
					/>
				))}
				{showingUsers.length === 0 && users.length > 0 && (
					<EmptyStatePlaceholder search text={LANGUAGE.no_search_results[selectedLanguage]} />
				)}
				{users.length === 0 && (
					<p>
						{props.target === ROLE.LOCAL_ADMIN && (
							<EmptyStatePlaceholder text={LANGUAGE.no_admins_created[selectedLanguage]} />
						)}
						{props.target === ROLE.MODERATOR && (
							<EmptyStatePlaceholder text={LANGUAGE.no_moderators_created[selectedLanguage]} />
						)}
					</p>
				)}
			</div>
		</div>
	);
};
export default GeneralAdminPanel;
