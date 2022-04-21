import './CreatePostModal.scss';
import LANGUAGE from '../../utils/languages.json';
import cities from '../../utils/cities.json';
import { Modal, TextInput, Textarea, NativeSelect, Button, LoadingOverlay } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { IconBuilding } from '@tabler/icons';
import { changeModalState } from '../../redux/actions';
import { useEffect, useState } from 'react';
import FileDropzone from '../FileDropzone/FileDropzone';
import { showNotification } from '@mantine/notifications';
import { errorNotification, infoNotification } from '../Notifications/Notifications';

const CreatePostModal = () => {
	const dispatch = useDispatch();
	const selectedLanguage = useSelector((state) => state.language);
	const modalState = useSelector((state) => state.modals.createPost);

	const [loadingOverlay, setLoadingOverlay] = useState(false);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [titleError, setTitleError] = useState(null);
	const [descriptionError, setDescriptionError] = useState(null);
	const [city, setCity] = useState('');
	const [cityError, setCityError] = useState(null);
	const [files, setFiles] = useState([]);
	const [noFilesError, setNoFilesError] = useState(false);
	const [tooManyFilesError, setTooManyFilesError] = useState(false);

	//set no file error false when files added
	useEffect(() => {
		if (files.length > 0) {
			setNoFilesError(false);
		}
	}, [files]);

	const deleteFiles = () => {
		setFiles([]);
		setNoFilesError(false);
		setTooManyFilesError(false);
	};

	const handleCreatePost = async () => {
		if (title.length === 0) {
			setTitleError(LANGUAGE.create_post_modal_title_required_error[selectedLanguage]);
		}
		if (description.length === 0) {
			setDescriptionError(LANGUAGE.create_post_modal_description_required_error[selectedLanguage]);
		}
		if (city === '') {
			setCityError(LANGUAGE.create_post_modal_city_required_error[selectedLanguage]);
		}
		if (files.length === 0) {
			setNoFilesError(true);
		}
		if (files.length > 4) {
			setTooManyFilesError(true);
			showNotification(errorNotification(LANGUAGE.notification_create_post_too_many_files[selectedLanguage]));
		}
		if (title.length > 0 && description.length > 0 && city.length > 0 && files.length > 0 && files.length <= 4) {
			setLoadingOverlay(true);
			const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('api-token')}`,
				},
				body: JSON.stringify({
					title,
					description,
					city,
				}),
			});
			if (res.status === 201) {
				console.log(res);
				const resJson = await res.json();
				const postId = resJson.postId;
				console.log(postId);
				const formData = new FormData();
				files.forEach((file, index) => {
					formData.append(index, file);
				});
				const res2 = await fetch(`${process.env.REACT_APP_API_URL}/posts/create/files/${postId}`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('api-token')}`,
					},
					body: formData,
				});
				if (res2.status === 200) {
					dispatch(changeModalState('createPost', false));
					setTitle('');
					setDescription('');
					setCity('');
					setTitleError(null);
					setDescriptionError(null);
					setCityError(null);
					setFiles([]);
					setNoFilesError(false);
					setTooManyFilesError(false);
					setLoadingOverlay(false);
					showNotification(infoNotification('Success', LANGUAGE.notification_post_created[selectedLanguage], 'green'));
				}
			}
		}
	};

	return (
		<Modal
			centered
			title={LANGUAGE.create_post_modal_modaltitle[selectedLanguage]}
			opened={modalState}
			onClose={() => {
				dispatch(changeModalState('createPost', false));
				setTitle('');
				setDescription('');
				setCity('');
				setTitleError(null);
				setDescriptionError(null);
				setCityError(null);
				setFiles([]);
				setNoFilesError(false);
				setTooManyFilesError(false);
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
			<NativeSelect
				className='create-post-modal-city'
				data={cities.cities}
				placeholder={LANGUAGE.register_modal_city[selectedLanguage]}
				radius='md'
				size='md'
				variant='filled'
				icon={<IconBuilding style={{ width: 25 }} />}
				onChange={(e) => {
					setCity(e.currentTarget.value);
					setCityError(false);
				}}
				error={cityError}
			/>
			<FileDropzone
				modal='createPost'
				setInputFile={setFiles}
				noFileError={noFilesError}
				tooManyFilesError={tooManyFilesError}
				files={files}
			/>
			<div className='create-post-modal-footer'>
				<Button variant='subtle' radius='xl' compact onClick={deleteFiles}>
					Delete Files
				</Button>
				<Button size='md' variant='filled' radius='md' onClick={handleCreatePost}>
					Submit
				</Button>
			</div>
		</Modal>
	);
};
export default CreatePostModal;
