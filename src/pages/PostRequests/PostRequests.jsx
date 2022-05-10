import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import './PostRequests.scss';
import Post from '../../components/Post/Post';
import { showNotification } from '@mantine/notifications';
import { errorNotification } from '../../components/Notifications/Notifications';
import LANGUAGE from '../../utils/languages.json';
import { LoadingOverlay, SegmentedControl } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { motion } from 'framer-motion';

const PostRequests = () => {
	const selectedLanguage = useSelector((store) => store.language);
	const loggedUser = useSelector((store) => store.loggedUser);

	const { width: windowWidth, height: windowHeight } = useViewportSize();

	const segmentedControlContainer = useRef();
	const [segmentedControlWidth, setSegmentedControlWidth] = useState(0);

	const [loadingOverlay, setLoadingOverlay] = useState(false);
	const [sortValue, setSortValue] = useState('date');
	const [posts, setPosts] = useState([]);

	//set the drag width
	useEffect(() => {
		setSegmentedControlWidth(segmentedControlContainer.current.scrollWidth - segmentedControlContainer.current.offsetWidth);
	}, [windowWidth, windowHeight]);

	//get posts for this city
	useEffect(() => {
		(async () => {
			await getPosts();
		})();
	}, [loggedUser, sortValue]);

	const getPosts = async () => {
		setLoadingOverlay(true);
		const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/city/${loggedUser?.city}?sort=${sortValue}`);
		if (res.status === 200) {
			const rawPosts = await res.json();
			//set name and city
			const readyPosts = await Promise.all(
				rawPosts.map(async (post) => {
					const rawName = await fetch(`${process.env.REACT_APP_API_URL}/users/${post.user}/full-name`);
					const name = await rawName.json();
					return {
						...post,
						user: `${name.firstName} ${name.lastName}`,
						city: `@${post.city.toLowerCase()}`,
					};
				})
			);
			setPosts(readyPosts);
		} else {
			showNotification(errorNotification());
		}
		setLoadingOverlay(false);
	};

	return (
		<div className='page page-post-requests'>
			<LoadingOverlay visible={loadingOverlay} />
			<div className='header'>
				<p>{loggedUser?.city}</p>
				<p>{`${posts.length} ${LANGUAGE.posts_count[selectedLanguage]}`}</p>
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

			<div className='body'>
				{posts.map((post, index) => (
					<Post
						foradmin
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
			</div>
		</div>
	);
};
export default PostRequests;
