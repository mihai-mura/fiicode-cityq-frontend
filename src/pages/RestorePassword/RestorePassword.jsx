import './RestorePassword.scss';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PasswordInput, Paper, Button, LoadingOverlay } from '@mantine/core';
import { CgPassword } from 'react-icons/cg';
import LANGUAGE from '../../utils/languages.json';
import { showNotification } from '@mantine/notifications';
import { errorNotification, infoNotification } from '../../components/Notifications/Notifications';
import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '../../redux/actions';

//! invalid link page
//! add language button
const RestorePassword = () => {
	const params = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const selectedLanguage = useSelector((state) => state.language);
	const [linkExpired, setLinkExpired] = useState(false);
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState(null);
	const [confirmPasswordError, setConfirmPasswordError] = useState(null);

	//overlay
	const [loadingOverlay, setLoadingOverlay] = useState(false);

	useEffect(() => {
		(async () => {
			//verifies if token expired
			const res = await fetch(`${process.env.REACT_APP_API_URL}/users/restore-password-valid`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${params.token}`,
				},
			});
			if (res.status === 401) setLinkExpired(true);
		})();
	}, [params.token]);
	const handleSubmit = async () => {
		//password format validation
		if (password.length < 8 && password.length > 0) {
			setPasswordError(LANGUAGE.register_modal_invalid_password_format[selectedLanguage]);
		}
		if (password !== confirmPassword) {
			setConfirmPasswordError(LANGUAGE.register_modal_confirm_password_error[selectedLanguage]);
		}
		//empty fields validation
		if (password === '') {
			setPasswordError(LANGUAGE.register_modal_password_error[selectedLanguage]);
		}
		if (confirmPassword === '') {
			setConfirmPasswordError(true);
		}
		if (password !== '' && confirmPassword !== '' && password.length >= 8 && password === confirmPassword) {
			setLoadingOverlay(true);
			try {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users/restore-password`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${params.token}`,
					},
					body: JSON.stringify({
						password: password,
					}),
				});
				if (res.status === 200) {
					showNotification(
						infoNotification(
							LANGUAGE.notification_password_reset_title[selectedLanguage],
							LANGUAGE.notification_password_reset_message[selectedLanguage],
							'green'
						)
					);
					navigate('/');
				}
			} catch (error) {
				console.error(error);
				showNotification(
					errorNotification(
						LANGUAGE.notification_error_title[selectedLanguage],
						LANGUAGE.notification_error_message[selectedLanguage]
					)
				);
			}
		}
	};

	const LinkInvalidPage = (
		<>
			<div>Link invalid</div>
		</>
	);

	const RestorePasswordPage = (
		<Paper className='paper' shadow='md' radius='lg' p='xl' withBorder>
			<LoadingOverlay visible={loadingOverlay} />
			<div className='header'>
				<p>{LANGUAGE.restore_password_title[selectedLanguage]}</p>
				<div
					className='language-switch'
					onClick={() => {
						if (selectedLanguage === 'en') {
							dispatch(setLanguage('ro'));
							localStorage.setItem('language', 'ro');
						} else {
							dispatch(setLanguage('en'));
							localStorage.setItem('language', 'en');
						}
					}}>
					<span style={{ color: selectedLanguage === 'en' ? '#000' : '#afb0b3' }}>En</span>
					<span>/</span>
					<span style={{ color: selectedLanguage === 'ro' ? '#000' : '#afb0b3' }}>Ro</span>
				</div>
			</div>
			<PasswordInput
				className='auth-input'
				icon={<CgPassword />}
				variant='filled'
				placeholder={LANGUAGE.register_modal_password[selectedLanguage]}
				description={LANGUAGE.register_modal_password_description[selectedLanguage]}
				radius='md'
				value={password}
				onChange={(e) => {
					setPassword(e.target.value);
					setPasswordError(false);
				}}
				error={passwordError}
			/>

			<PasswordInput
				className='auth-input'
				icon={<CgPassword />}
				variant='filled'
				placeholder={LANGUAGE.register_modal_confirm_password[selectedLanguage]}
				radius='md'
				value={confirmPassword}
				onChange={(e) => {
					setConfirmPassword(e.target.value);
					setConfirmPasswordError(false);
				}}
				error={confirmPasswordError}
			/>
			<Button radius='md' size='md' onClick={handleSubmit}>
				Submit
			</Button>
		</Paper>
	);

	return <div className='page-restore-password'>{linkExpired ? LinkInvalidPage : RestorePasswordPage}</div>;
};
export default RestorePassword;
