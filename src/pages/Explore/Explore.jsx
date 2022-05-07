import './Explore.scss';
import Post from '../../components/Post/Post';
import { PostsData } from '../../components/Post/PostsData';
import { Button, SegmentedControl } from '@mantine/core';
import { IconCirclePlus } from '@tabler/icons';
import { useDispatch } from 'react-redux';
import { changeModalState } from '../../redux/actions';
import LANGUAGE from '../../utils/languages.json';
import { useSelector } from 'react-redux';
import WritePost from '../../components/WritePost/WritePost';
import { useEffect, useRef, useState } from 'react';
import ROLE from '../../utils/roles';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { errorNotification } from '../../components/Notifications/Notifications';
import SkeletonPost from '../../components/SkeletonPost/SkeletonPost';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import useOnScreen from '../../hooks/useOnScreen';

const Explore = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const selectedLanguage = useSelector((state) => state.language);
	const loggedUser = useSelector((state) => state.loggedUser);

	const lastElementRef = useRef();
	const [sortValue, setSortValue] = useState('date');
	const [pageNumber, setPageNumber] = useState(1);

	const { posts, loading, hasMore } = useInfiniteScroll(pageNumber, 10, sortValue);

	const lastElementVisible = useOnScreen(lastElementRef);

	//redirect users based on their role
	useEffect(() => {
		if (loggedUser?.role === ROLE.GENERAL_ADMIN) navigate('/general-admin');
		else if (loggedUser?.role === ROLE.LOCAL_ADMIN) navigate('/local-admin/requests');
		else if (loggedUser?.role === ROLE.MODERATOR) navigate('/moderator');
	}, [loggedUser]);

	useEffect(() => {
		if (lastElementVisible && hasMore && !loading && posts.length > 0) {
			setPageNumber((prev) => prev + 1);
		}
	}, [posts, hasMore, lastElementVisible, loading]);

	return (
		<div className='page page-explore'>
			<div className='createpost-header'>
				<div
					className='createpost-reactive'
					onClick={() => {
						if (!loggedUser) dispatch(changeModalState('login', true));
						else if (!loggedUser?.verified) {
							showNotification(
								errorNotification(
									LANGUAGE.notification_user_not_verified_title[selectedLanguage],
									LANGUAGE.notification_user_not_verified_message[selectedLanguage]
								)
							);
						} else dispatch(changeModalState('createPost', true));
					}}>
					<WritePost />
				</div>
				<SegmentedControl
					className='sort-controller'
					color='blue'
					radius='lg'
					value={sortValue}
					onChange={(value) => {
						setSortValue(value);
						setPageNumber(1);
					}}
					data={[
						{ label: LANGUAGE.post_sort_new[selectedLanguage], value: 'date' },
						{ label: LANGUAGE.post_sort_upvotes[selectedLanguage], value: 'upvotes' },
						{ label: LANGUAGE.post_sort_downvotes[selectedLanguage], value: 'downvotes' },
						{ label: LANGUAGE.post_sort_sent[selectedLanguage], value: 'sent' },
						{ label: LANGUAGE.post_sort_seen[selectedLanguage], value: 'seen' },
						{ label: LANGUAGE.post_sort_in_progress[selectedLanguage], value: 'in-progress' },
						{ label: LANGUAGE.post_sort_resolved[selectedLanguage], value: 'resolved' },
					]}
				/>
			</div>
			{posts.map((post, index) => (
				<Post
					foruser
					id={post._id}
					title={post.title}
					key={index}
					fileUrls={post.file_urls}
					user={post.user}
					city={post.city}
					description={post.description}
					status={post.status}
					upvotes={post.upvotes.length}
					downvotes={post.downvotes.length}
				/>
			))}
			<SkeletonPost lastElementRef={lastElementRef} />
		</div>
	);
};

export default Explore;
