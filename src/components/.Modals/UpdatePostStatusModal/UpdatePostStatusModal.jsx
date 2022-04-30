import { Modal } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { changeModalState } from '../../../redux/actions';
import LANGUAGE from '../../../utils/languages.json';

const UpdatePostStatusModal = () => {
	const dispatch = useDispatch();

	const selectedLanguage = useSelector((state) => state.language);
	const modalState = useSelector((state) => state.modals.updatePostStatus);

	return (
		<Modal
			centered
			title={LANGUAGE.update_post_status_modal_title[selectedLanguage]}
			opened={modalState}
			onClose={() => {
				dispatch(changeModalState('updatePostStatus', false));
			}}></Modal>
	);
};
export default UpdatePostStatusModal;
