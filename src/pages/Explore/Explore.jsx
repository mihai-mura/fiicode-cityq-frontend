import React from 'react';
import Post from '../../components/Post/Post';
import './Explore.scss';
import { PostsData } from '../../components/Post/PostsData';

const Explore = () => {
	return (
		<div className='page page-explore'>
			{PostsData.map((item) => (
				<Post image={item.image} user={item.user} title={item.title} description={item.description} status={item.status} />
			))}
		</div>
	);
};

export default Explore;
