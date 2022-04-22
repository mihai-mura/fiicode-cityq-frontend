import './Post.scss';
import { IconArrowBigDownLine, IconArrowBigUpLine } from '@tabler/icons';
import 'swiper/scss';
import { Swiper, SwiperSlide } from 'swiper/react';

const Post = (props) => {
	//! carousel
	return (
		<div className='post-page-container'>
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
						<IconArrowBigUpLine className='upvote-icon' />
						<p>{props.upvotes}</p>
						<IconArrowBigDownLine className='downvote-icon' />
						<p>{props.downvotes}</p>
					</div>
					<div className='post-status'>{props.status}</div>
				</div>
			</div>
		</div>
	);
};

export default Post;
