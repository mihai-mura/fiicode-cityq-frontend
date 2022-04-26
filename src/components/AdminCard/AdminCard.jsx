import { useSelector } from 'react-redux';
import './AdminCard.scss';
import LANGUAGE from '../../utils/languages.json';
import { Button } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { errorNotification, infoNotification } from '../Notifications/Notifications';
import { useClipboard } from '@mantine/hooks';

const AdminCard = (props) => {
	const modals = useModals();
	const clipboardEmail = useClipboard({ timeout: 500 });
	const clipboardCity = useClipboard({ timeout: 500 });
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

	return (
		<div className='admin-card'>
			<div className='header'>
				<img src={props.profileImg} alt='admin profile' />
				<p className='name'>{`${props.firstName} ${props.lastName}`}</p>
			</div>
			<p
				className='email'
				onClick={() => {
					clipboardEmail.copy(props.email);
					showNotification(infoNotification('Email copied!'));
				}}>
				Email: <span style={{ color: clipboardEmail.copied ? '#0ca678' : '#949699' }}>{props.email}</span>
			</p>
			<p
				className='city'
				onClick={() => {
					clipboardCity.copy(props.city);
					showNotification(infoNotification('City copied!'));
				}}>
				{LANGUAGE.admin_card_city[selectedLanguage]}:{' '}
				<span style={{ color: clipboardCity.copied ? '#0ca678' : '#949699' }}>{props.city}</span>
			</p>
			<div className='footer'>
				<Button color='red' radius='xl' onClick={openDeleteAdminModal}>
					Delete
				</Button>
			</div>
		</div>
	);
};
export default AdminCard;
