import { useEffect, useState } from 'react';
import { Loader } from '@mantine/core';

const UrlFetchImg = (props) => {
	const [url, setUrl] = useState('');
	useEffect(() => {
		(async () => {
			const res = await fetch(props.imageurl);
			if (res.status === 200) {
				const res2 = await res.text();
				setUrl(res2);
			}
		})();
	}, [props.imageurl]);
	return url ? (
		// eslint-disable-next-line jsx-a11y/alt-text
		<img
			src={url}
			onError={({ currentTarget }) => {
				currentTarget.onerror = null; // prevents looping
				currentTarget.src = url;
			}}
			{...props}
		/>
	) : (
		<Loader {...props} />
	);
};

export default UrlFetchImg;
