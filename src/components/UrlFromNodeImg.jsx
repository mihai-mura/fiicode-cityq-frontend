import { useEffect, useState } from 'react';
import { Loader } from '@mantine/core';

const UrlFromNodeImg = (props) => {
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
<<<<<<< HEAD
=======
	// eslint-disable-next-line jsx-a11y/alt-text
>>>>>>> 92da9d61902df421f0364a1d070cadd11e731c64
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

export default UrlFromNodeImg;
