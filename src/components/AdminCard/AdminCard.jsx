import { useSelector } from 'react-redux';
import './AdminCard.scss';
import LANGUAGE from '../../utils/languages.json';
import { Button } from '@mantine/core';

const AdminCard = (props) => {
	const selectedLanguage = useSelector((state) => state.language);

	//! email copy on click
	return (
		<div className='admin-card'>
			<div className='header'>
				<img src={props.profileImg} alt='admin profile' />
				<p className='name'>{`${props.firstName} ${props.lastName}`}</p>
			</div>
			<p className='email'>
				Email: <span>{props.email}</span>
			</p>
			<p className='city'>
				{LANGUAGE.admin_card_city[selectedLanguage]}: <span>{props.city}</span>
			</p>
			<div className='footer'>
				<Button color='red' radius='xl'>
					Delete
				</Button>
				<Button color='blue' radius='xl'>
					Edit
				</Button>
			</div>
		</div>
	);
};
export default AdminCard;
