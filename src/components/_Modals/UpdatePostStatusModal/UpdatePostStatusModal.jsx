import { Button, Modal } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { changeModalState } from '../../../redux/actions';
import LANGUAGE from '../../../utils/languages.json';
import { showNotification } from '@mantine/notifications';
import { errorNotification, infoNotification } from '../../Notifications/Notifications';

const UpdatePostStatusModal = () => {
	const dispatch = useDispatch();

	const selectedLanguage = useSelector((store) => store.language);
	const modalState = useSelector((store) => store.modals.updatePostStatus);

	const handleChange = async (status) => {
		const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/status`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('api-token')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: window.location.pathname.split('/').pop(),
				status,
			}),
		});
		if (res.status === 200) {
			dispatch(changeModalState('updatePostStatus', false));
			showNotification(infoNotification(LANGUAGE.notification_status_change_success[selectedLanguage]));
			setTimeout(() => window.location.reload(false), 1000);
		} else {
			showNotification(errorNotification());
		}
	};

	return (
		<Modal
			centered
			title={LANGUAGE.update_post_status_modal_title[selectedLanguage]}
			opened={modalState}
			onClose={() => {
				dispatch(changeModalState('updatePostStatus', false));
			}}>
			<div style={{ display: 'flex', gap: '10px' }}>
				<Button color='gray' radius='lg' onClick={() => handleChange('sent')}>
					Sent
				</Button>
				<Button color='blue' radius='lg' onClick={() => handleChange('seen')}>
					Seen
				</Button>
				<Button color='orange' radius='lg' onClick={() => handleChange('in-progress')}>
					In Progress
				</Button>
				<Button color='green' radius='lg' onClick={() => handleChange('resolved')}>
					Resolved
				</Button>
			</div>
		</Modal>
	);
};
export default UpdatePostStatusModal;
