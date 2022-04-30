import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './PostRequests.scss';
import Post from '../../components/Post/Post';
import { showNotification } from '@mantine/notifications';
import { errorNotification } from '../../components/Notifications/Notifications';

const PostRequests = () => {
	const loggedUser = useSelector((store) => store.loggedUser);

	const [posts, setPosts] = useState([]);

	//get posts for this city
	useEffect(() => {
		(async () => {
			await getPosts();
		})();
	}, [loggedUser]);

	const getPosts = async () => {
		const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/city/${loggedUser?.city}`);
		if (res.status === 200) {
			const rawPosts = await res.json();
			//set name and city
			const posts = await Promise.all(
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
			setPosts(posts);
		} else {
			showNotification(errorNotification());
		}
	};

	return (
		<div className='page page-post-requests'>
			<div className='header'>
				<p>{loggedUser?.city}</p>
			</div>
			<div className='body'>
				{posts.map((post, index) => (
					<Post
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
