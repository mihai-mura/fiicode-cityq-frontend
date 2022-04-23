import { useEffect, useState } from 'react';
import { Loader } from '@mantine/core';

const UrlFetchImg = (props) => {
	const [url, setUrl] = useState('');
	useEffect(() => {
		(async () => {
			const res = await fetch(props.url);
			if (res.status === 200) {
				const res2 = await res.text();
				setUrl(res2);
			}
		})();
	}, [props.url]);
	return url ? (
		// eslint-disable-next-line jsx-a11y/alt-text
		<img
			style={{ objectFit: 'cover' }}
			src={url}
			// onError={(e) => {
			// 	e.currentTarget.onerror = null; // prevents looping
			// 	e.currentTarget.src = url; //! network looping
			// }}
			{...props}
		/>
	) : (
		<Loader {...props} />
	);
};

export default UrlFetchImg;
