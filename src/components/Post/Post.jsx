import './Post.scss';
import { IconArrowBigDownLine, IconArrowBigUpLine } from '@tabler/icons';
import 'swiper/scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { errorNotification } from '../Notifications/Notifications';

const Post = (props) => {
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
		const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/upvote/${props.id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('api-token')}`,
			},
		});
		if (res.status === 200) {
			setUpvotes((prev) => prev + 1);
		} else if (res.status === 204) {
			// removed upvote
			setUpvotes((prev) => prev - 1);
		} else {
			showNotification(errorNotification());
		}
	};
	const handleDownvote = async () => {
		const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/downvote/${props.id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('api-token')}`,
			},
		});
		if (res.status === 200) {
			setDownvotes((prev) => prev + 1);
		} else if (res.status === 204) {
			// removed downvote
			setDownvotes((prev) => prev - 1);
		} else {
			showNotification(errorNotification());
		}
	};

	//! carousel
	//! vote post icon color
	return (
		<div className='post-container'>
			<div className='post-header'>
				<div className='post-user'>{props.user}</div>
				<div className='post-city'>{props.city}</div>
			</div>
			<div className='post-carousel-container'>
				<Swiper autoHeight slidesPerView={1}>
					{props.fileUrls.map((file, index) => (
						<SwiperSlide className='carousel-slide' key={index}>
							{file.includes('.mp4?') ? <video controls src={file} /> : <img src={file} alt='post' />}
						</SwiperSlide>
					))}
				</Swiper>
			</div>
			<div className='post-title'>{props.title}</div>
			<div className='post-description'>{props.description}</div>
			<div className='post-footer'>
				<div className='votes'>
					<IconArrowBigUpLine className='upvote-icon' style={{ color: '#00a8ff' }} onClick={handleUpvote} />
					<p>{upvotes}</p>
					<IconArrowBigDownLine className='downvote-icon' style={{ color: '#f5342e' }} onClick={handleDownvote} />
					<p>{downvotes}</p>
				</div>
				<div className='post-status'>{props.status}</div>
			</div>
		</div>
	);
};

export default Post;
