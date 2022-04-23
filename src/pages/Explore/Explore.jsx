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
import { useEffect, useState } from 'react';

const Explore = () => {
	const dispatch = useDispatch();
	const selectedLanguage = useSelector((state) => state.language);
	const loggedUser = useSelector((state) => state.loggedUser);
	const [currentPosts, setCurrentPosts] = useState([]);

	useEffect(() => {
		(async () => {
			await setPosts();
		})();
	}, []);

	const setPosts = async () => {
		const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/all`);
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
		setCurrentPosts(posts);
	};

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
			{currentPosts.map((post, index) => (
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
	);
};

export default Explore;
