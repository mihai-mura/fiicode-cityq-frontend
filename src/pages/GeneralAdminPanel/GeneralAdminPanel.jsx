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

const GeneralAdminPanel = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const loggedUser = useSelector((state) => state.loggedUser);

	//! sort admins based on search
	const [searchInput, setSearchInput] = useState('');
	const [admins, setAdmins] = useState([]);

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
				setAdmins(response);
			} else {
				showNotification(errorNotification());
			}
		})();
	}, []);

	return (
		<div className='page page-general-admin'>
			<div className='page-general-admin-header'>
				<Button
					radius='xl'
					size='md'
					variant='gradient'
					gradient={{ from: 'teal', to: 'blue', deg: 60 }}
					onClick={() => dispatch(changeModalState('createAdmin', true))}>
					Add Admin
				</Button>
				<TextInput
					icon={<IconSearch />}
					placeholder='Search'
					radius='xl'
					size='lg'
					value={searchInput}
					onChange={(e) => setSearchInput(e.currentTarget.value)}
				/>
			</div>
			<div className='page-general-admin-body'>
				{admins.map((admin, index) => (
					<AdminCard
						key={index}
						profileImg={admin.profileImg}
						firstName={admin.firstName}
						lastName={admin.lastName}
						email={admin.email}
						city={admin.city}
					/>
				))}
			</div>
		</div>
	);
};
export default GeneralAdminPanel;
