import { showNotification } from '@mantine/notifications';
import { IconArrowBigUpLine, IconArrowBigDownLine, IconHeart, IconChevronLeft, IconChevronRight } from '@tabler/icons';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { errorNotification, infoNotification } from '../../components/Notifications/Notifications';
import ROLE from '../../utils/roles';
import './PostPage.scss';
import {
	addLoggedUserDownvotes,
	addLoggedUserUpvotes,
	changeModalState,
	removeLoggedUserDownvotes,
	removeLoggedUserUpvotes,
	addFavourite,
	removeFavourite,
} from '../../redux/actions';
import { Button } from '@mantine/core';
import LANGUAGE from '../../utils/languages.json';
import { useModals } from '@mantine/modals';
import { Pagination } from 'swiper';

//* to not exceed quota
const loadFirebaseFiles = false;

const PostPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const modals = useModals();
	const id = useParams().id;
	const selectedLanguage = useSelector((store) => store.language);
	const loggedUser = useSelector((state) => state.loggedUser);
	const swiperRef = useRef(null);
	const [notFound, setNotFound] = useState(false);
	const [post, setPost] = useState(null);
	const [upvotes, setUpvotes] = useState(0);
	const [downvotes, setDownvotes] = useState(0);

	//get post
	useEffect(() => {
		(async () => {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/${id}`);
			if (res.status === 200) {
				const data = await res.json();
				if (!data.verified && (loggedUser?.role === ROLE.USER || !loggedUser) && data.user !== loggedUser?._id) {
					setNotFound(true);
				} else {
					setNotFound(false);
					switch (data.status) {
						case 'sent':
							data.status = LANGUAGE.post_status_sent[selectedLanguage];
							break;
						case 'seen':
							data.status = LANGUAGE.post_status_seen[selectedLanguage];
							break;
						case 'in-progress':
							data.status = LANGUAGE.post_status_in_progress[selectedLanguage];
							break;
						case 'resolved':
							data.status = LANGUAGE.post_status_resolved[selectedLanguage];
							break;
						default:
							break;
					}
					setPost(data);
				}
			} else if (res.status === 404) {
				setNotFound(true);
			} else {
				showNotification(errorNotification());
			}
		})();
	}, [id, loggedUser, selectedLanguage]);

	useEffect(() => {
		if (post?.upvotes) {
			setUpvotes(post.upvotes.length);
		}
		if (post?.downvotes) {
			setDownvotes(post.downvotes.length);
		}
	}, [post]);

	const handleDeletepost = async () => {
		const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('api-token')}`,
			},
		});
		if (res.status === 200) {
			if (loggedUser?.role === ROLE.USER) navigate('/my-posts');
			else if (loggedUser?.role === ROLE.LOCAL_ADMIN) navigate('/local-admin/requests');
			else if (loggedUser?.role === ROLE.MODERATOR) navigate('/moderator');
		} else {
			showNotification(errorNotification());
		}
	};

	const openDeletePostModal = () =>
		modals.openConfirmModal({
			title: LANGUAGE.delete_post_modal_title[selectedLanguage],

			children: <h4 size='sm'>{LANGUAGE.delete_post_modal_text[selectedLanguage]}</h4>,
			labels: {
				confirm: LANGUAGE.delete_post_modal_confirm[selectedLanguage],
				cancel: LANGUAGE.delete_post_modal_cancel[selectedLanguage],
			},
			confirmProps: { color: 'red' },
			onConfirm: handleDeletepost,
		});

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
					dispatch(addLoggedUserUpvotes(post?._id));
				} else if (response === 'removed upvote') {
					// remove upvote
					setUpvotes((prev) => prev - 1);
					dispatch(removeLoggedUserUpvotes(post?._id));
				} else if (response === 'added upvote and removed downvote') {
					//add upvote and remove downvote
					setUpvotes((prev) => prev + 1);
					setDownvotes((prev) => prev - 1);
					dispatch(addLoggedUserUpvotes(post?._id));
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
					dispatch(removeLoggedUserUpvotes(post?._id));
				}
			} else {
				showNotification(errorNotification());
			}
		} else dispatch(changeModalState('login', true));
	};

	const handleFavourite = async () => {
		if (loggedUser && loggedUser.role === ROLE.USER) {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/favourite/${post?._id}`, {
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
					dispatch(addFavourite(post?._id));
				} else if (response === 'removed from favourites') {
					//remove downvote
					showNotification(infoNotification(LANGUAGE.notification_removed_from_favourites[selectedLanguage], 'blue'));
					dispatch(removeFavourite(post?._id));
				}
			} else {
				showNotification(errorNotification());
			}
		} else dispatch(changeModalState('login', true));
	};

	const handleDenyPostRequest = async () => {
		const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/deny/${post?._id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('api-token')}`,
			},
		});
		if (res.status === 200) {
			showNotification(infoNotification(LANGUAGE.post_request_denied[selectedLanguage]));
			navigate('/moderator');
		} else {
			showNotification(errorNotification());
		}
	};
	const handleApprovePostRequest = async () => {
		const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/approve/${post?._id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('api-token')}`,
			},
		});
		if (res.status === 200) {
			showNotification(infoNotification(LANGUAGE.notification_post_approved[selectedLanguage]));
			window.location.reload(false);
		} else {
			showNotification(errorNotification());
		}
	};

	return (
		<div className={`page page-post ${loggedUser?.role !== ROLE.USER ? 'page-for-admin' : ''}`}>
			{!notFound ? (
				<>
					<div className='post-carousel-container'>
						<Swiper
							ref={swiperRef}
							modules={[Pagination]}
							pagination={{ clickable: true }}
							autoHeight
							slidesPerView={1}>
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
						<div className='swiper-button previous-button' onClick={() => swiperRef.current.swiper.slidePrev()}>
							<IconChevronLeft className='button-icon' />
						</div>
						<div className='swiper-button next-button' onClick={() => swiperRef.current.swiper.slideNext()}>
							<IconChevronRight className='button-icon' />
						</div>
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
							<IconHeart
								className='favourite-icon'
								style={{ color: loggedUser?.favouritePosts?.includes(post?._id) ? 'red' : 'black' }}
								onClick={handleFavourite}
							/>
						</div>
						<p className='status'>Status: {post?.status}</p>
						{(loggedUser?._id === post?.user || loggedUser?.role === ROLE.LOCAL_ADMIN) && (
							<p style={{ marginBottom: '10px', color: post?.verified ? '#40c057' : '#fa5252' }}>
								{post?.verified
									? LANGUAGE.post_approved[selectedLanguage]
									: LANGUAGE.post_not_approved[selectedLanguage]}
							</p>
						)}
						{loggedUser?.role === ROLE.LOCAL_ADMIN && (
							<div className='buttons'>
								<Button
									color='green'
									radius='lg'
									onClick={() => dispatch(changeModalState('updatePostStatus', true))}>
									{LANGUAGE.update_status_button[selectedLanguage]}
								</Button>
								<Button color='red' radius='lg' onClick={() => openDeletePostModal()}>
									{LANGUAGE.delete_post_button[selectedLanguage]}
								</Button>
							</div>
						)}
						{loggedUser?.role === ROLE.USER && (
							<div className='buttons'>
								<Button color='red' radius='lg' onClick={() => openDeletePostModal()}>
									{LANGUAGE.delete_post_button[selectedLanguage]}
								</Button>
								<Button color='green' radius='lg' onClick={() => dispatch(changeModalState('editPost', true))}>
									{LANGUAGE.edit_post_button[selectedLanguage]}
								</Button>
							</div>
						)}
						{loggedUser?.role === ROLE.MODERATOR && !post?.verified && (
							<div className='buttons'>
								<Button color='red' radius='xl' onClick={handleDenyPostRequest}>
									{LANGUAGE.deny_post_request_button[selectedLanguage]}
								</Button>
								<Button color='green' radius='xl' onClick={handleApprovePostRequest}>
									{LANGUAGE.approve_post_request_button[selectedLanguage]}
								</Button>
							</div>
						)}
					</div>
				</>
			) : (
				<div style={{ marginTop: '50px', fontSize: '1.5rem' }}>{LANGUAGE.post_not_found[selectedLanguage]}</div>
			)}
		</div>
	);
};
export default PostPage;
