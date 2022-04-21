import './Post.scss';
import { IconArrowBigDownLine, IconArrowBigUpLine } from '@tabler/icons';

const Post = (props) => {
	//! carousel
	return (
		<div className='post-page-container'>
			<div className='post-container'>
				<div className='post-header'>
					<div className='post-user'>{props.user}</div>
					<div className='post-city'>{props.city}</div>
				</div>
				<div className='postcarousel-container'>
					<img src={props.fileUrls[0]} alt='post' />
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
