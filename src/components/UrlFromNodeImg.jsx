import { useEffect, useState } from 'react';

const UrlFromNodeImg = (props) => {
	const [url, setUrl] = useState('');
	useEffect(() => {
		(async () => {
			const res = await fetch(props.imageurl);
			const res2 = await res.text();
			setUrl(res2);
		})();
	}, [props.imageurl]);
	// eslint-disable-next-line jsx-a11y/alt-text
	return <img src={url} {...props} />;
};

export default UrlFromNodeImg;
