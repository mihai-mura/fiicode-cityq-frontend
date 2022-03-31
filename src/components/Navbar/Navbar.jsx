import React from 'react';
import './Navbar.scss';
import { FiBell } from 'react-icons/fi';
import { BiCommentDetail } from 'react-icons/bi';
import UserImage from '../../images/user-image.png';
import { FiSearch } from 'react-icons/fi';

const Navbar = () => {
	return (
		<>
			<div className='navbar'>
				<div className='comments'>
					<BiCommentDetail />
				</div>
				<div className='bell'>
					<FiBell />
				</div>
				<div className='user'>
					<div className='user-image'>
						<img src={UserImage} alt='user image' />
					</div>
				</div>
			</div>
		</>
	);
};

export default Navbar;
