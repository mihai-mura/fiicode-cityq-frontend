import { useEffect, useState } from 'react';

const UrlFromNodeImg = (props) => {
	const [url, setUrl] = useState('');
	useEffect(async () => {
		const res = await fetch(`${process.env.REACT_APP_API_URL}/profile-pic/:id`); //!mihai redux
		const res2 = await res.text();
		setUrl(res2);
	}, []);
	return <img src={url} {...props} />;
};

export default UrlFromNodeImg;
