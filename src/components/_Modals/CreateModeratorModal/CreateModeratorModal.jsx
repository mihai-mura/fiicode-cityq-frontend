import './CreateModeratorModal.scss';
import { Button, LoadingOverlay, Modal, PasswordInput, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeModalState } from '../../../redux/actions';
import LANGUAGE from '../../../utils/languages.json';
import { CgRename, CgPassword } from 'react-icons/cg';
import { MdAlternateEmail } from 'react-icons/md';
import { showNotification } from '@mantine/notifications';
import { errorNotification, infoNotification } from '../../Notifications/Notifications';

const CreateModeratorModal = () => {
	const dispatch = useDispatch();
	const createModeratorModal = useSelector((state) => state.modals.createModerator);
	const selectedLanguage = useSelector((state) => state.language);

	//inputs
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	//errors
	const [firstNameError, setFirstNameError] = useState(false);
	const [lastNameError, setLastNameError] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [confirmPasswordError, setConfirmPasswordError] = useState(false);

	//overlay
	const [loadingOverlay, setLoadingOverlay] = useState(false);

	const handleCreateModerator = async () => {
		//email format verification
		if (email.indexOf('@') === -1 || email.lastIndexOf('.') < email.indexOf('@')) {
			setEmailError(LANGUAGE.register_modal_invaid_email_format[selectedLanguage]);
		}
		//password format verification
		if (password.length < 8 && password.length > 0) {
			setPasswordError(LANGUAGE.register_modal_invalid_password_format[selectedLanguage]);
		}
		if (password !== confirmPassword) {
			setConfirmPasswordError(LANGUAGE.register_modal_confirm_password_error[selectedLanguage]);
		}
		//empty fields verification

		if (firstName === '') {
			setFirstNameError(LANGUAGE.register_modal_first_name_error[selectedLanguage]);
		}
		if (lastName === '') {
			setLastNameError(LANGUAGE.register_modal_last_name_error[selectedLanguage]);
		}
		if (email === '') {
			setEmailError(LANGUAGE.register_modal_email_error[selectedLanguage]);
		}
		if (password === '') {
			setPasswordError(LANGUAGE.register_modal_password_error[selectedLanguage]);
		}
		if (confirmPassword === '') {
			setConfirmPasswordError(true);
		}

		if (
			firstName !== '' &&
			lastName !== '' &&
			email !== '' &&
			password !== '' &&
			confirmPassword !== '' &&
			email.indexOf('@') !== -1 &&
			email.lastIndexOf('.') > email.indexOf('@') &&
			password.length >= 8 &&
			password === confirmPassword
		) {
			//togle overlay
			setLoadingOverlay(true);
			const res = await fetch(`${process.env.REACT_APP_API_URL}/moderators`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('api-token')}`,
				},
				body: JSON.stringify({
					firstName,
					lastName,
					email,
					password,
				}),
			});
			if (res.status === 201) {
				dispatch(changeModalState('createModerator', false));
				setLoadingOverlay(false);
				setFirstName('');
				setLastName('');
				setEmail('');
				setPassword('');
				setConfirmPassword('');
				setEmailError(false);
				setPasswordError(false);
				setConfirmPasswordError(false);
				setFirstNameError(false);
				setLastNameError(false);
				showNotification(infoNotification(LANGUAGE.create_moderator_modal_success[selectedLanguage]));
				setTimeout(() => window.location.reload(false), 1000);
			} else if (res.status === 409) {
				setEmailError(LANGUAGE.register_modal_email_already_exists[selectedLanguage]);
				setLoadingOverlay(false);
			} else {
				showNotification(errorNotification());
				setLoadingOverlay(false);
			}
		}
	};

	return (
		<Modal
			size='lg'
			centered
			opened={createModeratorModal}
			onClose={() => {
				dispatch(changeModalState('createModerator', false));
				setFirstName('');
				setLastName('');
				setEmail('');
				setPassword('');
				setConfirmPassword('');
				setEmailError(false);
				setPasswordError(false);
				setConfirmPasswordError(false);
				setFirstNameError(false);
				setLastNameError(false);
				setLoadingOverlay(false);
			}}
			title={LANGUAGE.create_moderator_modal_title[selectedLanguage]}>
			<div style={{ width: '100%', position: 'relative' }}>
				<LoadingOverlay visible={loadingOverlay} />
				<div className='register-field-row'>
					<TextInput
						className='auth-input'
						icon={<CgRename />}
						variant='filled'
						placeholder={LANGUAGE.register_modal_first_name[selectedLanguage]}
						radius='md'
						value={firstName}
						onChange={(e) => {
							setFirstName(e.target.value);
							setFirstNameError(false);
						}}
						error={firstNameError}
					/>
					<TextInput
						className='auth-input'
						icon={<CgRename />}
						variant='filled'
						placeholder={LANGUAGE.register_modal_last_name[selectedLanguage]}
						radius='md'
						value={lastName}
						onChange={(e) => {
							setLastName(e.target.value);
							setLastNameError(false);
						}}
						error={lastNameError}
					/>
				</div>
				<div className='register-field-row'>
					<TextInput
						className='auth-input'
						icon={<MdAlternateEmail />}
						variant='filled'
						placeholder={LANGUAGE.create_admin_modal_email[selectedLanguage]}
						radius='md'
						type={'email'}
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setEmailError(false);
						}}
						error={emailError}
					/>
				</div>
				<PasswordInput
					className='auth-input'
					icon={<CgPassword />}
					variant='filled'
					placeholder={LANGUAGE.create_admin_modal_password[selectedLanguage]}
					description={LANGUAGE.register_modal_password_description[selectedLanguage]}
					radius='md'
					value={password}
					onChange={(e) => {
						setPassword(e.target.value);
						setPasswordError(false);
					}}
					error={passwordError}
				/>
				{/*//* ⬇️⬇️🐣⬇️⬇️ */}
				{/* <PasswordStrength
						value={registerPassword}
						setRegisterPassword={setRegisterPassword}
						setRegisterPasswordError={setRegisterPasswordError}
						error={registerPasswordError}
					/> */}
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

				<div className='create-admin-footer'>
					<Button variant='filled' color='#3378F7' radius='xl' onClick={handleCreateModerator}>
						{LANGUAGE.create_moderator_modal_submit[selectedLanguage]}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
export default CreateModeratorModal;
