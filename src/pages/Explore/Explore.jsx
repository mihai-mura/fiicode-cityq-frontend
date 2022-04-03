import React from 'react';
import Post from '../../components/Post/Post';
import './Explore.scss';
import { PostsData } from '../../components/Post/PostsData';

const Explore = () => {
	return (
		<div className='explore' style={{ marginTop: '80px' }}>
			{PostsData.map((slide) => (
				<Post image={slide.image} user={slide.user} title={slide.title} description={slide.description} status={slide.status} />
			))}
		</div>
	);
};

export default Explore;
