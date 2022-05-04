import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { errorNotification } from '../../components/Notifications/Notifications';
import Post from '../../components/Post/Post';
import LANGUAGE from '../../utils/languages.json';
import './PostVerification.scss';

const PostVerification = () => {
	const loggedUser = useSelector((store) => store.loggedUser);
	const selectedLanguage = useSelector((store) => store.language);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		(async () => {
			await getPosts();
		})();
	}, [loggedUser]);

	const getPosts = async () => {
		const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/unverified`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('api-token')}`,
			},
		});
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
	};

	return (
		<div className='page  page-post-verification'>
			<div className='header'>
				<p>{loggedUser?.city}</p>
				<p>{`${posts.length} ${LANGUAGE.posts_count[selectedLanguage]}`}</p>
			</div>
			<div className='body'>
				{posts.map((post, index) => (
					<Post
						formoderator
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
						deleteCard={() => setPosts((prev) => prev.filter((u) => u._id !== post._id))}
					/>
				))}
			</div>
		</div>
	);
};
export default PostVerification;
