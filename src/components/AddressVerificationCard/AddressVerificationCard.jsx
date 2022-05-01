import './AddressVerificationCard.scss';
import { useModals } from '@mantine/modals';
import LANGUAGE from '../../utils/languages.json';
import { useSelector } from 'react-redux';
import { showNotification } from '@mantine/notifications';
import { errorNotification, infoNotification } from '../Notifications/Notifications';

const AddressVerificationCard = (props) => {
	const modals = useModals();
	const selectedLanguage = useSelector((store) => store.language);

	const handleVerifyAddress = async () => {
		const res = await fetch(`${process.env.REACT_APP_API_URL}/users/verify-address/${props._id}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('api-token')}`,
			},
		});
		console.log(res);
		if (res.status === 200) {
			showNotification(infoNotification(LANGUAGE.address_verified_success[selectedLanguage]));
			props.deleteCard();
		} else {
			showNotification(errorNotification());
		}
	};
	const handleDenyAddress = async () => {
		const res = await fetch(`${process.env.REACT_APP_API_URL}/users/deny-address/${props._id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('api-token')}`,
			},
		});
		if (res.status === 200) {
			showNotification(infoNotification(LANGUAGE.address_denied_success[selectedLanguage]));
			props.deleteCard();
		} else {
			showNotification(errorNotification());
		}
	};

	const openConfirmVerificationModal = () =>
		modals.openConfirmModal({
			title: LANGUAGE.confirm_verification_modal_title[selectedLanguage],

			children: (
				<>
					<h4>{LANGUAGE.confirm_verification_modal_text[selectedLanguage]}</h4>
					<div style={{ marginBottom: '10px', display: 'flex', gap: '10px', marginTop: '10px' }}>
						<img
							style={{ width: '50px', height: '50px', borderRadius: '50%' }}
							src={props.profileImg}
							alt='profile'
						/>
						<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
							<p size='md'>
								{props.firstName} {props.lastName}
							</p>
						</div>
					</div>
					<p style={{ fontSize: '1.2rem' }}>-{props.city}-</p>
					<p style={{ fontSize: '1.2rem' }}>{props.address}</p>
					<img
						style={{ width: '100%', cursor: 'pointer' }}
						src={props.idImg}
						alt='id'
						onClick={() => window.open(props.idImg, '_blank')}
					/>
					<p style={{ color: '#949699' }}>{LANGUAGE.confirm_verification_modal_img_info[selectedLanguage]}</p>
				</>
			),
			confirmProps: { color: 'green' },
			cancelProps: { style: { backgroundColor: '#fa5252', color: 'white' } },
			labels: {
				confirm: LANGUAGE.confirm_verification_modal_confirm[selectedLanguage],
				cancel: LANGUAGE.confirm_verification_modal_deny[selectedLanguage],
			},
			onConfirm: handleVerifyAddress,
			onCancel: handleDenyAddress,
		});

	return (
		<div className='address-verification-card' onClick={openConfirmVerificationModal}>
			<div className='header'>
				<img src={props.profileImg} alt='admin profile' />
				<p className='name'>{`${props.firstName} ${props.lastName}`}</p>
			</div>
			<p className='email'>
				Email: <span>{props.email}</span>
			</p>
			<p className='address'>{LANGUAGE.address_verification_card_address[selectedLanguage]}:</p>
			<p className='address'>{props.address}</p>
		</div>
	);
};
export default AddressVerificationCard;
