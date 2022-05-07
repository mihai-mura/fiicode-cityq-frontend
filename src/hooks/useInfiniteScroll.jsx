import { useEffect, useState } from 'react';

const useInfiniteScroll = (page, limit, sort = 'date') => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	useEffect(() => {
		setPosts([]);
	}, [sort]);

	useEffect(() => {
		(async () => {
			setLoading(true);
			const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/all?limit=${limit}&page=${page}&sort=${sort}`);
			const data = await res.json();
			//set name and city
			const readyPosts = await Promise.all(
				data.posts.map(async (post) => {
					const rawName = await fetch(`${process.env.REACT_APP_API_URL}/users/${post.user}/full-name`);
					const name = await rawName.json();
					return {
						...post,
						user: `${name.firstName} ${name.lastName}`,
						city: `@${post.city.toLowerCase()}`,
					};
				})
			);

			setPosts((prev) => [...prev, ...readyPosts]);
			setHasMore(data.posts.length > 0);
			setLoading(false);
		})();
	}, [page, sort]);

	return { posts, loading, hasMore };
};
export default useInfiniteScroll;
