import { useSelector } from 'react-redux';
import './UserCard.scss';
import LANGUAGE from '../../utils/languages.json';
import { Button } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { errorNotification, infoNotification } from '../Notifications/Notifications';
import { useClipboard } from '@mantine/hooks';
import ROLE from '../../utils/roles';

const UserCard = (props) => {
	const modals = useModals();
	const clipboardEmail = useClipboard({ timeout: 500 });
	const clipboardCity = useClipboard({ timeout: 500 });
	const selectedLanguage = useSelector((state) => state.language);

	const handleDeleteUser = async () => {
		if (props.target === ROLE.LOCAL_ADMIN) {
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
		} else if (props.target === ROLE.MODERATOR) {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/moderators/${props._id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('api-token')}`,
				},
			});
			if (res.status === 200) {
				showNotification(infoNotification(LANGUAGE.notification_moderator_deleted[selectedLanguage]));
				setTimeout(() => window.location.reload(false), 1000);
			} else {
				showNotification(errorNotification());
			}
		}
	};

	const openDeleteUserModal = () =>
		modals.openConfirmModal({
			title:
				props.target === ROLE.LOCAL_ADMIN
					? LANGUAGE.delete_admin_modal_title[selectedLanguage]
					: LANGUAGE.delete_moderator_modal_title[selectedLanguage],

			children: (
				<>
					<h4 size='sm'>
						{props.target === ROLE.LOCAL_ADMIN
							? LANGUAGE.delete_admin_modal_text[selectedLanguage]
							: LANGUAGE.delete_moderator_modal_text[selectedLanguage]}
					</h4>
					<div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
						<img
							style={{ width: '50px', height: '50px', borderRadius: '50%' }}
							src={props.profileImg}
							alt='profile'
						/>
						<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
							<p size='md'>
								{props.firstName} {props.lastName}
							</p>
							{props.target === ROLE.LOCAL_ADMIN && <p style={{ color: '#949699' }}>{props.city}</p>}
						</div>
					</div>
				</>
			),
			labels: {
				confirm:
					props.target === ROLE.LOCAL_ADMIN
						? LANGUAGE.delete_admin_modal_confirm[selectedLanguage]
						: LANGUAGE.delete_moderator_modal_confirm[selectedLanguage],
				cancel: LANGUAGE.delete_admin_modal_cancel[selectedLanguage],
			},
			confirmProps: { color: 'red' },
			onConfirm: handleDeleteUser,
		});

	return (
		<div className='user-card'>
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
			{props.target === ROLE.LOCAL_ADMIN && (
				<p
					className='city'
					onClick={() => {
						clipboardCity.copy(props.city);
						showNotification(infoNotification('City copied!'));
					}}>
					{LANGUAGE.admin_card_city[selectedLanguage]}:{' '}
					<span style={{ color: clipboardCity.copied ? '#0ca678' : '#949699' }}>{props.city}</span>
				</p>
			)}

			<div className='footer'>
				<Button color='red' radius='xl' onClick={openDeleteUserModal}>
					Delete
				</Button>
			</div>
		</div>
	);
};
export default UserCard;
