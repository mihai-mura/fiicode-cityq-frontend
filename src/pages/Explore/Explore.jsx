import './Explore.scss';
import Post from '../../components/Post/Post';
import { PostsData } from '../../components/Post/PostsData';
import { Button } from '@mantine/core';
import { IconCirclePlus } from '@tabler/icons';
import { useDispatch } from 'react-redux';
import { changeModalState } from '../../redux/actions';
import LANGUAGE from '../../utils/languages.json';
import { useSelector } from 'react-redux';
import WritePost from '../../components/WritePost/WritePost';

const Explore = () => {
	const dispatch = useDispatch();
	const selectedLanguage = useSelector((state) => state.language);
	const loggedUser = useSelector((state) => state.loggedUser);

	return (
		<div className='page page-explore'>
			<div className='createpost-header'>
				<div
					className='createpost-reactive'
					onClick={() => {
						if (!loggedUser) dispatch(changeModalState('login', true));
						else dispatch(changeModalState('createPost', true));
					}}>
					<WritePost></WritePost>
				</div>
			</div>
			{PostsData.map((item, index) => (
				<Post
					key={index}
					image={item.image}
					user={item.user}
					city={item.city}
					title={item.title}
					description={item.description}
					status={item.status}
					upvotes={item.upvotes}
					downvotes={item.downvotes}
				/>
			))}
		</div>
	);
};

export default Explore;
