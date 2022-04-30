import { showNotification } from '@mantine/notifications';
import { IconArrowBigUpLine, IconArrowBigDownLine } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { errorNotification } from '../../components/Notifications/Notifications';
import ROLE from '../../utils/roles';
import './PostPage.scss';
import {
	addLoggedUserDownvotes,
	addLoggedUserUpotes,
	changeModalState,
	removeLoggedUserDownvotes,
	removeLoggedUserUpotes,
} from '../../redux/actions';
import { Button } from '@mantine/core';

//* to not exceed quota
const loadFirebaseFiles = false;

const PostPage = () => {
	const dispatch = useDispatch();
	const id = useParams().id;
	const loggedUser = useSelector((state) => state.loggedUser);
	const [post, setPost] = useState(null);
	const [upvotes, setUpvotes] = useState(0);
	const [downvotes, setDownvotes] = useState(0);

	//get post
	useEffect(() => {
		(async () => {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/${id}`);
			if (res.status === 200) {
				const data = await res.json();
				setPost(data);
			} else {
				showNotification(errorNotification());
			}
		})();
	}, [id]);

	useEffect(() => {
		if (post?.upvotes) {
			setUpvotes(post.upvotes.length);
		}
		if (post?.downvotes) {
			setDownvotes(post.downvotes.length);
		}
	}, [post]);

	const handleUpvote = async () => {
		if (loggedUser) {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/upvote/${post?._id}`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('api-token')}`,
				},
			});
			const response = await res.text();
			if (res.status === 200) {
				if (response === 'added upvote') {
					//add upvote
					setUpvotes((prev) => prev + 1);
					dispatch(addLoggedUserUpotes(post?._id));
				} else if (response === 'removed upvote') {
					// remove upvote
					setUpvotes((prev) => prev - 1);
					dispatch(removeLoggedUserUpotes(post?._id));
				} else if (response === 'added upvote and removed downvote') {
					//add upvote and remove downvote
					setUpvotes((prev) => prev + 1);
					setDownvotes((prev) => prev - 1);
					dispatch(addLoggedUserUpotes(post?._id));
					dispatch(removeLoggedUserDownvotes(post?._id));
				}
			} else {
				showNotification(errorNotification());
			}
		} else dispatch(changeModalState('login', true));
	};
	const handleDownvote = async () => {
		if (loggedUser) {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/downvote/${post?._id}`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('api-token')}`,
				},
			});
			const response = await res.text();
			if (res.status === 200) {
				if (response === 'added downvote') {
					//add downvote
					setDownvotes((prev) => prev + 1);
					dispatch(addLoggedUserDownvotes(post?._id));
				} else if (response === 'removed downvote') {
					//remove downvote
					setDownvotes((prev) => prev - 1);
					dispatch(removeLoggedUserDownvotes(post?._id));
				} else if (response === 'added downvote and removed upvote') {
					//add downvote and remove upvote
					setUpvotes((prev) => prev - 1);
					setDownvotes((prev) => prev + 1);
					dispatch(addLoggedUserDownvotes(post?._id));
					dispatch(removeLoggedUserUpotes(post?._id));
				}
			} else {
				showNotification(errorNotification());
			}
		} else dispatch(changeModalState('login', true));
	};

	return (
		<div className={`page page-post ${loggedUser?.role !== ROLE.USER ? 'page-for-admin' : ''}`}>
			<div className='post-carousel-container'>
				<Swiper autoHeight slidesPerView={1}>
					{post?.file_urls.map((file, index) => (
						<SwiperSlide className='carousel-slide' key={index}>
							{file.includes('.mp4?') ? (
								<video controls src={loadFirebaseFiles ? file : 'https://source.unsplash.com/random'} />
							) : (
								<img src={loadFirebaseFiles ? file : 'https://source.unsplash.com/random'} alt='post' />
							)}
						</SwiperSlide>
					))}
				</Swiper>
			</div>
			<div className='body'>
				<p className='title'>{post?.title}</p>
				<p className='description'>{post?.description}</p>
				<div className='votes'>
					<IconArrowBigUpLine
						className='upvote-icon'
						style={{ color: loggedUser?.upvotedPosts?.includes(post?._id) ? '#00a8ff' : '#bdbac0' }}
						onClick={loggedUser?.role === ROLE.USER ? handleUpvote : null}
					/>
					<p>{upvotes}</p>
					<IconArrowBigDownLine
						className='downvote-icon'
						style={{ color: loggedUser?.downvotedPosts?.includes(post?._id) ? '#f5342e' : '#bdbac0' }}
						onClick={loggedUser?.role === ROLE.USER ? handleDownvote : null}
					/>
					<p>{downvotes}</p>
				</div>
				<p className='status'>Status: {post?.status}</p>
				{loggedUser?.role === ROLE.LOCAL_ADMIN && (
					<Button color='green' radius='lg' onClick={() => dispatch(changeModalState('updatePostStatus', true))}>
						Update Status
					</Button>
				)}
			</div>
		</div>
	);
};
export default PostPage;
