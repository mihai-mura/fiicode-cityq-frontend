import React from 'react';
import './WritePost.scss';
import UrlFetchImg from '../UrlFetchImage/UrlFetchImg';
import LANGUAGE from '../../utils/languages.json';
import { useSelector } from 'react-redux';
import CreatePostUtils from '../../images/postutils.png';
import BasicUser from '../../images/basic-user.png';

const WritePost = () => {
	const selectedLanguage = useSelector((state) => state.language);
	const loggedUser = useSelector((state) => state.loggedUser);
	return (
		<div className='createpost-container'>
			<div className='createpost-top-section'>
				{loggedUser ? (
					<UrlFetchImg
						url={`${process.env.REACT_APP_API_URL}/users/profile-pic/${loggedUser?._id}`}
						alt='user'
						className='createpost-image'
					/>
				) : (
					<img className='createpost-image' src={BasicUser} alt='basic-user' />
				)}
				<div className='createpost-text'>{LANGUAGE.create_post_modal_title[selectedLanguage]}</div>
			</div>
			<div className='createpost-bottom-section'>
				<img src={CreatePostUtils} alt='post-utils' />
				<div className='createpost-button'>Post</div>
			</div>
		</div>
	);
};

export default WritePost;
