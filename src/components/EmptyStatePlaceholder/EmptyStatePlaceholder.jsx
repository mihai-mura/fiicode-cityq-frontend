import EmptyState from '../../images/empty-state.png';
import EmptySearch from '../../images/empty-search.png';
import { Button } from '@mantine/core';
import LANGUAGE from '../../utils/languages.json';
import { useDispatch, useSelector } from 'react-redux';
import { changeModalState } from '../../redux/actions';
import { showNotification } from '@mantine/notifications';
import { errorNotification } from '../Notifications/Notifications';

const EmptyStatePlaceholder = (props) => {
	const dispatch = useDispatch();
	const selectedLanguage = useSelector((store) => store.language);
	const loggedUser = useSelector((store) => store.loggedUser);

	//* put pos relative on the element to make it center
	return (
		<div
			style={{
				width: 'fit-content',
				height: 'fit-content',
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '10px',
			}}>
			<img style={{ width: '200px' }} src={props.search ? EmptySearch : EmptyState} alt='empty state' />
			<p style={{ fontSize: '1.3rem' }}>{props.text}</p>
			{props.createPostButton && (
				<Button
					radius='xl'
					size='xs'
					onClick={() => {
						if (loggedUser?.verified) dispatch(changeModalState('createPost', true));
						else
							showNotification(
								errorNotification(
									LANGUAGE.notification_user_not_verified_title[selectedLanguage],
									LANGUAGE.notification_user_not_verified_message[selectedLanguage]
								)
							);
					}}>
					{LANGUAGE.create_post_button[selectedLanguage]}
				</Button>
			)}
		</div>
	);
};
export default EmptyStatePlaceholder;
