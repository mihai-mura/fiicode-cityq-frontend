import './Post.scss';
import { IconArrowBigDownLine, IconArrowBigUpLine, IconChevronLeft, IconChevronRight, IconHeart } from '@tabler/icons';
import 'swiper/scss';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useRef, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { errorNotification, infoNotification } from '../Notifications/Notifications';
import { useDispatch, useSelector } from 'react-redux';
import {
	addLoggedUserUpvotes,
	addLoggedUserDownvotes,
	removeLoggedUserUpvotes,
	removeLoggedUserDownvotes,
	changeModalState,
	addFavourite,
	removeFavourite,
} from '../../redux/actions';
import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import LANGUAGE from '../../utils/languages.json';
import ROLE from '../../utils/roles.js';
import { Pagination } from 'swiper';

//* to not exceed quota
const loadPostFiles = true;

const Post = (props) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const selectedLanguage = useSelector((store) => store.language);
	const loggedUser = useSelector((state) => state.loggedUser);
	const swiperRef = useRef(null);
	const [status, setStatus] = useState('');
	const [upvotes, setUpvotes] = useState(0);
	const [downvotes, setDownvotes] = useState(0);

	useEffect(() => {
		switch (props.status) {
			case 'sent':
				setStatus(LANGUAGE.post_status_sent[selectedLanguage]);
				break;
			case 'seen':
				setStatus(LANGUAGE.post_status_seen[selectedLanguage]);
				break;
			case 'in-progress':
				setStatus(LANGUAGE.post_status_in_progress[selectedLanguage]);
				break;
			case 'resolved':
				setStatus(LANGUAGE.post_status_resolved[selectedLanguage]);
				break;
			default:
				break;
		}
	}, [props.status, selectedLanguage]);

	useEffect(() => {
		if (props.upvotes) {
			setUpvotes(props.upvotes);
		}
		if (props.downvotes) {
			setDownvotes(props.downvotes);
		}
	}, [props.upvotes, props.downvotes]);

	const handleUpvote = async () => {
		if (loggedUser && loggedUser.role === ROLE.USER) {
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
					dispatch(addLoggedUserUpvotes(props.id));
				} else if (response === 'removed upvote') {
					// remove upvote
					setUpvotes((prev) => prev - 1);
					dispatch(removeLoggedUserUpvotes(props.id));
				} else if (response === 'added upvote and removed downvote') {
					//add upvote and remove downvote
					setUpvotes((prev) => prev + 1);
					setDownvotes((prev) => prev - 1);
					dispatch(addLoggedUserUpvotes(props.id));
					dispatch(removeLoggedUserDownvotes(props.id));
				}
			} else {
				showNotification(errorNotification());
			}
		} else dispatch(changeModalState('login', true));
	};
	const handleDownvote = async () => {
		if (loggedUser && loggedUser.role === ROLE.USER) {
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
					dispatch(removeLoggedUserUpvotes(props.id));
				}
			} else {
				showNotification(errorNotification());
			}
		} else dispatch(changeModalState('login', true));
	};

	const handleFavourite = async () => {
		if (loggedUser && loggedUser.role === ROLE.USER) {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/favourite/${props.id}`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('api-token')}`,
				},
			});
			const response = await res.text();
			if (res.status === 200) {
				if (response === 'added to favourites') {
					//add favourite
					showNotification(infoNotification(LANGUAGE.notification_added_to_favourites[selectedLanguage], 'blue'));
					dispatch(addFavourite(props.id));
				} else if (response === 'removed from favourites') {
					//remove downvote
					props.deleteCard && props.deleteCard();
					showNotification(infoNotification(LANGUAGE.notification_removed_from_favourites[selectedLanguage], 'blue'));
					dispatch(removeFavourite(props.id));
				}
			} else {
				showNotification(errorNotification());
			}
		} else dispatch(changeModalState('login', true));
	};

	const handleDenyPostRequest = async () => {
		const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/deny/${props.id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('api-token')}`,
			},
		});
		if (res.status === 200) {
			showNotification(infoNotification(LANGUAGE.post_request_denied[selectedLanguage], 'red'));
			props.deleteCard();
		} else {
			showNotification(errorNotification());
		}
	};
	const handleApprovePostRequest = async () => {
		const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/approve/${props.id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('api-token')}`,
			},
		});
		if (res.status === 200) {
			props.deleteCard();
		} else {
			showNotification(errorNotification());
		}
	};

	return (
		<div
			className={`post-container ${props.foradmin ? 'post-for-admin' : ''} ${props.forme ? 'post-for-me' : ''} ${
				props.formoderator ? 'post-for-moderator' : ''
			}`}>
			<div className='post-header'>
				<div>
					<div className='post-user'>{props.user}</div>
					{props.foruser && <div className='post-city'>{props.city}</div>}
				</div>
				<IconHeart
					className='favourite-icon'
					style={{ color: loggedUser?.favouritePosts?.includes(props.id) ? 'red' : 'black' }}
					onClick={handleFavourite}
				/>
			</div>
			<div className='post-carousel-container'>
				<Swiper ref={swiperRef} modules={[Pagination]} pagination={{ clickable: true }} autoHeight slidesPerView={1}>
					{props.fileUrls?.map((file, index) => (
						<SwiperSlide className='carousel-slide' key={index}>
							{file.includes('.mp4') ? (
								<video controls src={loadPostFiles ? file : 'https://source.unsplash.com/random'} />
							) : (
								<img src={loadPostFiles ? file : 'https://source.unsplash.com/random'} alt='post' />
							)}
						</SwiperSlide>
					))}
				</Swiper>
				{props.fileUrls?.length !== 1 && (
					<>
						<div className='swiper-button previous-button' onClick={() => swiperRef.current.swiper.slidePrev()}>
							<IconChevronLeft className='button-icon' />
						</div>
						<div className='swiper-button next-button' onClick={() => swiperRef.current.swiper.slideNext()}>
							<IconChevronRight className='button-icon' />
						</div>
					</>
				)}
			</div>
			<div className='post-title'>{props.title}</div>
			<div className='post-description'>
				{!props.foruser &&
					(props.description?.length > 50 ? `${props.description?.substring(0, 50)}...` : props.description)}
				{props.foruser &&
					(props.description?.length > 100 ? `${props.description?.substring(0, 100)}...` : props.description)}
			</div>
			<div className='post-footer'>
				<div className='votes'>
					<IconArrowBigUpLine
						className='upvote-icon'
						style={{ color: loggedUser?.upvotedPosts?.includes(props.id) ? '#00a8ff' : '#bdbac0' }}
						onClick={props.foruser || props.forme ? handleUpvote : null}
					/>
					<p>{upvotes}</p>
					<IconArrowBigDownLine
						className='downvote-icon'
						style={{ color: loggedUser?.downvotedPosts?.includes(props.id) ? '#f5342e' : '#bdbac0' }}
						onClick={props.foruser || props.forme ? handleDownvote : null}
					/>
					<p>{downvotes}</p>
				</div>
				{props.foruser && (
					<>
						<Button
							style={{ marginRight: '3.2rem' }}
							variant='subtle'
							radius='xl'
							size='xs'
							onClick={() => navigate(`/post/${props.id}`)}>
							{LANGUAGE.post_card_view_button[selectedLanguage]}
						</Button>
						<div className='post-status'>{status}</div>
					</>
				)}
				{props.foradmin && (
					<>
						<Button
							style={{ marginRight: '3.2rem' }}
							variant='subtle'
							radius='xl'
							size='xs'
							onClick={() => navigate(`/post/${props.id}`)}>
							{LANGUAGE.post_card_view_button[selectedLanguage]}
						</Button>
						<div className='post-status'>{status}</div>
					</>
				)}
				{props.forme && (
					<Button onClick={() => navigate(`/post/${props.id}`)} variant='subtle' radius='xl'>
						{LANGUAGE.post_card_edit_button[selectedLanguage]}
					</Button>
				)}
				{props.formoderator && (
					<>
						<Button color='blue' radius='xl' onClick={() => navigate(`/post/${props.id}`)}>
							{LANGUAGE.post_card_view_button[selectedLanguage]}
						</Button>
						<Button color='red' radius='xl' onClick={handleDenyPostRequest}>
							{LANGUAGE.deny_post_request_button[selectedLanguage]}
						</Button>
						<Button color='green' radius='xl' onClick={handleApprovePostRequest}>
							{LANGUAGE.approve_post_request_button[selectedLanguage]}
						</Button>
					</>
				)}
			</div>
		</div>
	);
};

export default Post;
