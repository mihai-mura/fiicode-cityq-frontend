import './Explore.scss';
import Post from '../../components/Post/Post';
import { SegmentedControl } from '@mantine/core';
import { motion } from 'framer-motion';
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
import { useViewportSize } from '@mantine/hooks';

const Explore = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const selectedLanguage = useSelector((state) => state.language);
	const loggedUser = useSelector((state) => state.loggedUser);

	const { width: windowWidth, height: windowHeight } = useViewportSize();

	const lastElementRef = useRef();
	const segmentedControlContainer = useRef();
	const [segmentedControlWidth, setSegmentedControlWidth] = useState(0);
	const [sortValue, setSortValue] = useState('date');
	const [pageNumber, setPageNumber] = useState(1);

	const { posts, loading, hasMore } = useInfiniteScroll(pageNumber, 10, sortValue);

	const lastElementVisible = useOnScreen(lastElementRef);

	//set the drag width
	useEffect(() => {
		setSegmentedControlWidth(segmentedControlContainer.current.scrollWidth - segmentedControlContainer.current.offsetWidth);
	}, [windowWidth, windowHeight]);

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
				<motion.div className='sort-controller-container' ref={segmentedControlContainer}>
					<motion.div
						className='sort-controller-inner'
						drag='x'
						dragConstraints={{ right: 0, left: -segmentedControlWidth }}>
						<SegmentedControl
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
					</motion.div>
				</motion.div>
				<SegmentedControl
					className='segmented-control-default'
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
