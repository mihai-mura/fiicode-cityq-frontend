import { Button, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ROLE from '../../utils/roles';
import './GeneralAdminPanel.scss';
import { errorNotification } from '../../components/Notifications/Notifications';
import { changeModalState } from '../../redux/actions';
import AdminCard from '../../components/AdminCard/AdminCard';
import { IconSearch } from '@tabler/icons';
import LANGUAGE from '../../utils/languages.json';

const GeneralAdminPanel = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const loggedUser = useSelector((state) => state.loggedUser);
	const selectedLanguage = useSelector((state) => state.language);

	const [searchInput, setSearchInput] = useState('');
	const [admins, setAdmins] = useState([]);
	const [showingAdmins, setShowingAdmins] = useState([]);

	useEffect(() => {
		if (!loggedUser) {
			navigate('/');
		}
		if (loggedUser?.role !== ROLE.GENERAL_ADMIN) {
			navigate('/');
			showNotification(errorNotification('You are not authorized to view this page'));
		}
	}, [loggedUser]);

	//get all admins
	useEffect(() => {
		(async () => {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/local-admins/all`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('api-token')}`,
				},
			});
			if (res.status === 200) {
				const response = await res.json();
				response.reverse();
				setAdmins(response);
				setShowingAdmins(response);
			} else {
				showNotification(errorNotification());
			}
		})();
	}, []);

	const sortAdmins = (input, adminList) => {
		if (input.length >= 3) {
			const finalInput = input.toLowerCase();
			const filteredAdmins = adminList?.filter(
				(admin) =>
					admin.firstName.toLowerCase().includes(finalInput) ||
					admin.lastName.toLowerCase().includes(finalInput) ||
					admin.city.toLowerCase().includes(finalInput)
			);
			setShowingAdmins(filteredAdmins);
		}
		if (input.length === 0) {
			setShowingAdmins(adminList);
		}
	};

	return (
		<div className='page page-general-admin'>
			<div className='page-general-admin-header'>
				<Button
					radius='xl'
					size='md'
					variant='gradient'
					gradient={{ from: 'teal', to: 'blue', deg: 60 }}
					onClick={() => dispatch(changeModalState('createAdmin', true))}>
					{LANGUAGE.create_admin_button[selectedLanguage]}
				</Button>
				<TextInput
					icon={<IconSearch />}
					placeholder='Search'
					radius='xl'
					size='lg'
					value={searchInput}
					onChange={(e) => {
						setSearchInput(e.currentTarget.value);
						sortAdmins(e.currentTarget.value, admins);
					}}
				/>
			</div>
			<div className='page-general-admin-body'>
				{showingAdmins.map((admin, index) => (
					<AdminCard
						key={index}
						_id={admin._id}
						profileImg={admin.profileImg}
						firstName={admin.firstName}
						lastName={admin.lastName}
						email={admin.email}
						city={admin.city}
					/>
				))}
				{showingAdmins.length === 0 && <p>No search result found!</p>}
			</div>
		</div>
	);
};
export default GeneralAdminPanel;
