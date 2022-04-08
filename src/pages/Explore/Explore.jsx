import React from 'react';
import Post from '../../components/Post/Post';
import './Explore.scss';
import { PostsData } from '../../components/Post/PostsData';

const Explore = () => {
	return (
		<div className='page page-explore'>
			{PostsData.map((item, index) => (
				<Post
					key={index}
					image={item.image}
					user={item.user}
					city={item.city}
					title={item.title}
					description={item.description}
					status={item.status}
					upvotes={item.upvotes}
					downvotes={item.downvotes}
				/>
			))}
		</div>
	);
};

export default Explore;
