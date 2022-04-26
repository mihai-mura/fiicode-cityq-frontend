import { useSelector } from 'react-redux';
import './AdminCard.scss';
import LANGUAGE from '../../utils/languages.json';
import { Button } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { errorNotification, infoNotification } from '../Notifications/Notifications';

const AdminCard = (props) => {
	const modals = useModals();
	const selectedLanguage = useSelector((state) => state.language);

	const handleDeleteAdmin = async () => {
		const res = await fetch(`${process.env.REACT_APP_API_URL}/local-admins/${props._id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('api-token')}`,
			},
		});
		if (res.status === 200) {
			showNotification(infoNotification(LANGUAGE.notification_admin_deleted[selectedLanguage]));
			setTimeout(() => window.location.reload(false), 1000);
		} else {
			showNotification(errorNotification());
		}
	};

	const openDeleteAdminModal = () =>
		modals.openConfirmModal({
			title: LANGUAGE.delete_admin_modal_title[selectedLanguage],

			children: (
				<>
					<h4 size='sm'>{LANGUAGE.delete_admin_modal_text[selectedLanguage]}</h4>
					<div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
						<img
							style={{ width: '50px', height: '50px', borderRadius: '50%' }}
							src={props.profileImg}
							alt='profile'
						/>
						<div>
							<p size='md'>
								{props.firstName} {props.lastName}
							</p>
							<p style={{ color: '#949699' }}>{props.city}</p>
						</div>
					</div>
				</>
			),
			labels: {
				confirm: LANGUAGE.delete_admin_modal_confirm[selectedLanguage],
				cancel: LANGUAGE.delete_admin_modal_cancel[selectedLanguage],
			},
			confirmProps: { color: 'red' },
			onConfirm: handleDeleteAdmin,
		});

	//! email copy on click
	return (
		<div className='admin-card'>
			<div className='header'>
				<img src={props.profileImg} alt='admin profile' />
				<p className='name'>{`${props.firstName} ${props.lastName}`}</p>
			</div>
			<p className='email'>
				Email: <span>{props.email}</span>
			</p>
			<p className='city'>
				{LANGUAGE.admin_card_city[selectedLanguage]}: <span>{props.city}</span>
			</p>
			<div className='footer'>
				<Button color='red' radius='xl' onClick={openDeleteAdminModal}>
					Delete
				</Button>
				<Button color='blue' radius='xl'>
					Edit
				</Button>
			</div>
		</div>
	);
};
export default AdminCard;
