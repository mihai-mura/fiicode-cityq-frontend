import { useEffect, useState } from 'react';
import { Loader } from '@mantine/core';
import defaulPic from '../../images/basic-user.png';

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
			onError={(e) => {
				e.currentTarget.onerror = null;
				e.currentTarget.src = defaulPic;
			}}
			{...props}
		/>
	) : (
		<Loader {...props} />
	);
};

export default UrlFetchImg;
