import './Post.scss';
import { IconArrowBigDownLine, IconArrowBigUpLine } from '@tabler/icons';
import 'swiper/scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { errorNotification } from '../Notifications/Notifications';
import { useDispatch, useSelector } from 'react-redux';
import {
	addLoggedUserUpotes,
	addLoggedUserDownvotes,
	removeLoggedUserUpotes,
	removeLoggedUserDownvotes,
	changeModalState,
} from '../../redux/actions';
import { Button } from '@mantine/core';

//* to not exceed quota
const loadFirebaseFiles = false;

const Post = (props) => {
	const dispatch = useDispatch();
	const loggedUser = useSelector((state) => state.loggedUser);
	const [upvotes, setUpvotes] = useState(0);
	const [downvotes, setDownvotes] = useState(0);

	useEffect(() => {
		if (props.upvotes) {
			setUpvotes(props.upvotes);
		}
		if (props.downvotes) {
			setDownvotes(props.downvotes);
		}
	}, [props.upvotes, props.downvotes]);

	const handleUpvote = async () => {
		if (loggedUser) {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/upvote/${props.id}`, {
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
					dispatch(addLoggedUserUpotes(props.id));
				} else if (response === 'removed upvote') {
					// remove upvote
					setUpvotes((prev) => prev - 1);
					dispatch(removeLoggedUserUpotes(props.id));
				} else if (response === 'added upvote and removed downvote') {
					//add upvote and remove downvote
					setUpvotes((prev) => prev + 1);
					setDownvotes((prev) => prev - 1);
					dispatch(addLoggedUserUpotes(props.id));
					dispatch(removeLoggedUserDownvotes(props.id));
				}
			} else {
				showNotification(errorNotification());
			}
		} else dispatch(changeModalState('login', true));
	};
	const handleDownvote = async () => {
		if (loggedUser) {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/downvote/${props.id}`, {
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
					dispatch(addLoggedUserDownvotes(props.id));
				} else if (response === 'removed downvote') {
					//remove downvote
					setDownvotes((prev) => prev - 1);
					dispatch(removeLoggedUserDownvotes(props.id));
				} else if (response === 'added downvote and removed upvote') {
					//add downvote and remove upvote
					setUpvotes((prev) => prev - 1);
					setDownvotes((prev) => prev + 1);
					dispatch(addLoggedUserDownvotes(props.id));
					dispatch(removeLoggedUserUpotes(props.id));
				}
			} else {
				showNotification(errorNotification());
			}
		} else dispatch(changeModalState('login', true));
	};

	return (
		<div className={`post-container ${!props.foruser && 'post-for-admin'}`}>
			<div className='post-header'>
				<div className='post-user'>{props.user}</div>
				{props.foruser && <div className='post-city'>{props.city}</div>}
			</div>
			<div className='post-carousel-container'>
				<Swiper autoHeight slidesPerView={1}>
					{props.fileUrls.map((file, index) => (
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
			<div className='post-title'>{props.title}</div>
			<div className='post-description'>{props.description}</div>
			<div className='post-footer'>
				<div className='votes'>
					<IconArrowBigUpLine
						className='upvote-icon'
						style={{ color: loggedUser?.upvotedPosts?.includes(props.id) ? '#00a8ff' : '#bdbac0' }}
						onClick={props.foruser ? handleUpvote : null}
					/>
					<p>{upvotes}</p>
					<IconArrowBigDownLine
						className='downvote-icon'
						style={{ color: loggedUser?.downvotedPosts?.includes(props.id) ? '#f5342e' : '#bdbac0' }}
						onClick={props.foruser ? handleDownvote : null}
					/>
					<p>{downvotes}</p>
				</div>
				{/* //!popst page */}
				{props.foruser ? <div className='post-status'>{props.status}</div> : <Button radius='lg'>View</Button>}
			</div>
		</div>
	);
};

export default Post;
