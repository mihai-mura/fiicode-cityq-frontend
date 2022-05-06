import './Favourites.scss';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { errorNotification } from '../../components/Notifications/Notifications';
import LANGUAGE from '../../utils/languages.json';
import Post from '../../components/Post/Post';
import EmptyStatePlaceholder from '../../components/EmptyStatePlaceholder/EmptyStatePlaceholder';

const Favourites = () => {
	const selectedLanguage = useSelector((store) => store.language);
	const loggedUser = useSelector((store) => store.loggedUser);

	const [posts, setPosts] = useState([]);

	//get posts for this city
	useEffect(() => {
		(async () => {
			await getPosts();
		})();
	}, [loggedUser]);

	const getPosts = async () => {
		const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/favourites`, {
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
		<div className='page page-favourites'>
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
					deleteCard={() => setPosts((prev) => prev.filter((u) => u._id !== post._id))}
				/>
			))}
			{posts.length === 0 && <EmptyStatePlaceholder text={LANGUAGE.no_favourite_posts[selectedLanguage]} />}
		</div>
	);
};
export default Favourites;
