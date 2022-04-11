import './CreatePostModal.scss';
import LANGUAGE from '../../utils/languages.json';
import cities from '../../utils/cities.json';
import { Modal, TextInput, Textarea, NativeSelect } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { IconBuilding } from '@tabler/icons';
import { changeModalState } from '../../redux/actions';
import { useState } from 'react';

const CreatePostModal = () => {
	const dispatch = useDispatch();
	const selectedLanguage = useSelector((state) => state.language);
	const modalState = useSelector((state) => state.modals.createPost);

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [titleError, setTitleError] = useState(null);
	const [descriptionError, setDescriptionError] = useState(null);
	const [city, setCity] = useState('');
	const [cityError, setCityError] = useState(null);

	return (
		<Modal
			centered
			title={LANGUAGE.create_post_modal_modaltitle[selectedLanguage]}
			opened={modalState}
			onClose={() => {
				dispatch(changeModalState('createPost', false));
				setTitle('');
				setDescription('');
				setTitleError(null);
				setDescriptionError(null);
			}}>
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
			{/* //! add file dropzone and submit */}
		</Modal>
	);
};
export default CreatePostModal;
