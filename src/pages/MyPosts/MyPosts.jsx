import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { errorNotification } from '../../components/Notifications/Notifications';
import Post from '../../components/Post/Post';
import './MyPosts.scss';

const MyPosts = () => {
	const [posts, setPosts] = useState([]);

	//get my posts
	useEffect(() => {
		(async () => {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/user/all`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('api-token')}`,
				},
			});
			const response = await res.json();
			if (res.status === 200) {
				//set name and city
				const readyPosts = await Promise.all(
					response.map(async (post) => {
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
			} else if (res.status === 404) {
				setPosts([]);
			} else {
				showNotification(errorNotification());
			}
		})();
	});

	return (
		<div className='page page-my-posts'>
			<div className='header'></div>
			<div className='body'>
				{posts.map((post, index) => (
					<Post
						forme
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
export default MyPosts;
