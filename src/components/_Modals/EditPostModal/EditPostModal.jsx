import './EditPostModal.scss';
import LANGUAGE from '../../../utils/languages.json';
import cities from '../../../utils/cities.json';
import { Modal, TextInput, Textarea, NativeSelect, Button, LoadingOverlay } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { IconBuilding } from '@tabler/icons';
import { changeModalState } from '../../../redux/actions';
import { useState } from 'react';
import FileDropzone from '../../FileDropzone/FileDropzone';
import { showNotification } from '@mantine/notifications';
import { errorNotification, infoNotification } from '../../Notifications/Notifications';

const CreatePostModal = () => {
	const dispatch = useDispatch();
	const selectedLanguage = useSelector((state) => state.language);
	const modalState = useSelector((state) => state.modals.editPost);

	const [loadingOverlay, setLoadingOverlay] = useState(false);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [titleError, setTitleError] = useState(null);
	const [descriptionError, setDescriptionError] = useState(null);

	const handleEditPost = async () => {
		if (title.length === 0) {
			setTitleError(LANGUAGE.create_post_modal_title_required_error[selectedLanguage]);
		}
		if (description.length === 0) {
			setDescriptionError(LANGUAGE.create_post_modal_description_required_error[selectedLanguage]);
		}

		if (title.length > 0 && description.length > 0) {
			setLoadingOverlay(true);
			const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/edit/${window.location.pathname.split('/').pop()}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('api-token')}`,
				},
				body: JSON.stringify({
					title,
					description,
				}),
			});
			if (res.status === 200) {
				dispatch(changeModalState('editPost', false));
				showNotification(infoNotification(LANGUAGE.edit_post_modal_success[selectedLanguage]));
				window.location.reload(false);
			} else {
				showNotification(errorNotification());
			}
		}
	};

	return (
		<Modal
			centered
			title={LANGUAGE.edit_post_modal_title[selectedLanguage]}
			opened={modalState}
			onClose={() => {
				dispatch(changeModalState('editPost', false));
				setTitle('');
				setDescription('');
				setTitleError(null);
				setDescriptionError(null);
				setLoadingOverlay(false);
			}}>
			<LoadingOverlay visible={loadingOverlay} />
			<TextInput
				radius='md'
				size='md'
				maxLength={30}
				placeholder={LANGUAGE.create_post_modal_title_placeholder[selectedLanguage]}
				label={LANGUAGE.create_post_modal_title_label[selectedLanguage]}
				value={title}
				onChange={(event) => {
					setTitle(event.currentTarget.value);
					if (event.currentTarget.value.length === 30)
						setTitleError(LANGUAGE.create_post_modal_title_error[selectedLanguage]);
					else setTitleError(null);
				}}
				error={titleError}
			/>
			<Textarea
				radius='md'
				size='md'
				autosize
				minRows={2}
				maxRows={4}
				maxLength={200}
				placeholder={LANGUAGE.create_post_modal_description_placeholder[selectedLanguage]}
				label={LANGUAGE.create_post_modal_description_label[selectedLanguage]}
				value={description}
				onChange={(event) => {
					setDescription(event.currentTarget.value);
					if (event.currentTarget.value.length === 200)
						setDescriptionError(LANGUAGE.create_post_modal_description_error[selectedLanguage]);
					else setDescriptionError(null);
				}}
				error={descriptionError}
			/>

			<div className='edit-post-modal-footer'>
				<Button size='md' color='green' variant='filled' radius='lg' onClick={handleEditPost}>
					Submit
				</Button>
			</div>
		</Modal>
	);
};
export default CreatePostModal;
