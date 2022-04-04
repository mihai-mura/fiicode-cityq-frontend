import React from 'react';
import './Post.scss';

const Posts = (props) => {
	return (
		<div className='post-container'>
			<div className='post-user'>{props.user}</div>
			<div className='post-display'>
				<img src={props.image} alt='post' />
			</div>
			<div className='post-title'>{props.title}</div>
			<div className='post-description'>{props.description}</div>
			<div className='post-status'>{props.status}</div>
		</div>
	);
};

export default Posts;
