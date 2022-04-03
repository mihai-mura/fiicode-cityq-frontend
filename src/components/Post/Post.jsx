import React from 'react';
import './Post.scss';

const Posts = (props) => {
	return (
		<>
			<div className='posts'>
				<div className='post-container'>
					<div className='post-user'>{props.user}</div>
					<div className='post-imgBx'>
						<img src={props.image} alt='image' />
					</div>
					<div className='post-title'>{props.title}</div>
					<div className='post-description'>{props.description}</div>
					<div className='post-status'>{props.status}</div>
				</div>
			</div>
		</>
	);
};

export default Posts;
