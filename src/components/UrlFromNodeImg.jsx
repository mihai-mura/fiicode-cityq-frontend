import { useEffect, useState } from 'react';
import { Loader } from '@mantine/core';

const UrlFromNodeImg = (props) => {
	const [url, setUrl] = useState('');
	useEffect(() => {
		(async () => {
			while (true) {
				const res = await fetch(props.imageurl);
				if (res.status === 200) {
					const res2 = await res.text();
					setUrl(res2);
					break;
				}
			}
		})();
	}, [props.imageurl]);
	// eslint-disable-next-line jsx-a11y/alt-text
	return url ? <img src={url} {...props} /> : <Loader {...props} />;
};

export default UrlFromNodeImg;
