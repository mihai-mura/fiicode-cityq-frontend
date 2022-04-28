import './Authentification.scss';
import { Modal, TextInput, Button, PasswordInput, LoadingOverlay, NativeSelect } from '@mantine/core';
import { MdAlternateEmail } from 'react-icons/md';
import { CgRename, CgPassword } from 'react-icons/cg';
import { FaRegAddressCard } from 'react-icons/fa';
import { IconBuilding } from '@tabler/icons';
import { useSelector, useDispatch } from 'react-redux';
import { changeModalState, setLoggedUser } from '../../redux/actions';
import { useEffect, useState } from 'react';
import imageCompression from 'browser-image-compression';
import FileDropzone from '../FileDropzone/FileDropzone';
import cities from '../../utils/cities';
import LANGUAGE from '../../utils/languages.json';
import { showNotification } from '@mantine/notifications';
import PasswordStrength from './PasswordStrength';
import { errorNotification, infoNotification } from '../Notifications/Notifications';
import ROLE from '../../utils/roles';
import { useNavigate } from 'react-router-dom';

const Authentification = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const modals = useSelector((state) => state.modals);
	const selectedLanguage = useSelector((state) => state.language);

	//inputs
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [registerEmail, setRegisterEmail] = useState('');
	const [registerPassword, setRegisterPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [address, setAddress] = useState('');
	const [loginEmail, setLoginEmail] = useState('');
	const [loginPassword, setLoginPassword] = useState('');
	const [city, setCity] = useState('');
	//errors
	const [firstNameError, setFirstNameError] = useState(false);
	const [lastNameError, setLastNameError] = useState(false);
	const [registerEmailError, setRegisterEmailError] = useState(false);
	const [addressError, setAddressError] = useState(false);
	const [loginEmailError, setLoginEmailError] = useState(false);
	const [registerPasswordError, setRegisterPasswordError] = useState(false);
	const [confirmPasswordError, setConfirmPasswordError] = useState(false);
	const [loginPasswordError, setLoginPasswordError] = useState(false);
	const [cityError, setCityError] = useState(false);
	const [noFileError, setNoFileError] = useState(false);

	//overlay
	const [loadingOverlay, setLoadingOverlay] = useState(false);

	const [inputFile, setInputFile] = useState(null);

	//stop overlay
	useEffect(() => {
		if (!modals.login && !modals.register) {
			setLoadingOverlay(false);
		}
	}, [modals]);

	//handle enter key
	//! switching forms too slow
	useEffect(() => {
		const listener = (event) => {
			if (event.code === 'Enter' || event.code === 'NumpadEnter') {
				event.preventDefault();
				if (modals.login) {
					handleLogin();
				} else if (modals.register) {
					handleRegister();
				}
			}
		};
		document.addEventListener('keydown', listener);
		return () => {
			document.removeEventListener('keydown', listener);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		modals.login,
		modals.register,
		firstName,
		lastName,
		registerEmail,
		registerPassword,
		confirmPassword,
		address,
		loginEmail,
		loginPassword,
		city,
	]);

	const handleRegister = async () => {
		//email format verification
		if (registerEmail.indexOf('@') === -1 || registerEmail.lastIndexOf('.') < registerEmail.indexOf('@')) {
			setRegisterEmailError(LANGUAGE.register_modal_invaid_email_format[selectedLanguage]);
		}
		//password format verification
		if (registerPassword.length < 8 && registerPassword.length > 0) {
			setRegisterPasswordError(LANGUAGE.register_modal_invalid_password_format[selectedLanguage]);
		}
		if (registerPassword !== confirmPassword) {
			setConfirmPasswordError(LANGUAGE.register_modal_confirm_password_error[selectedLanguage]);
		}
		//empty fields verification
		if (inputFile === null) {
			setNoFileError(true);
		}
		if (firstName === '') {
			setFirstNameError(LANGUAGE.register_modal_first_name_error[selectedLanguage]);
		}
		if (lastName === '') {
			setLastNameError(LANGUAGE.register_modal_last_name_error[selectedLanguage]);
		}
		if (registerEmail === '') {
			setRegisterEmailError(LANGUAGE.register_modal_email_error[selectedLanguage]);
		}
		if (registerPassword === '') {
			setRegisterPasswordError(LANGUAGE.register_modal_password_error[selectedLanguage]);
		}
		if (confirmPassword === '') {
			setConfirmPasswordError(true);
		}
		if (address === '') {
			setAddressError(LANGUAGE.register_modal_address_error[selectedLanguage]);
		}
		if (city === '' || city === 'Select city') {
			setCityError(LANGUAGE.register_modal_city_error[selectedLanguage]);
		}

		if (
			firstName !== '' &&
			lastName !== '' &&
			registerEmail !== '' &&
			registerPassword !== '' &&
			confirmPassword !== '' &&
			address !== '' &&
			registerEmail.indexOf('@') !== -1 &&
			registerEmail.lastIndexOf('.') > registerEmail.indexOf('@') &&
			city !== '' &&
			registerPassword.length >= 8 &&
			registerPassword === confirmPassword &&
			inputFile !== null
		) {
			//togle overlay
			setLoadingOverlay(true);
			try {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: registerEmail,
						city: city,
						firstName: firstName,
						lastName: lastName,
						address: address,
						password: registerPassword,
					}),
				});
				if (res?.status === 201) {
					const response = await res.json();
					localStorage.setItem('api-token', response.token);
					//* send id picture to backend compressed
					const options = {
						maxSizeMB: 1,
					};
					const compressedFile = await imageCompression(inputFile, options);
					const idPicture = new FormData();
					idPicture.append('idPic', compressedFile);
					const res2 = await fetch(`${process.env.REACT_APP_API_URL}/users/register/id`, {
						method: 'POST',
						headers: {
							Authorization: `Bearer ${response.token}`,
						},
						body: idPicture,
					});
					if (res2.status === 200) {
						dispatch(changeModalState('register', false));
						dispatch(setLoggedUser(response.user));
						setFirstName('');
						setLastName('');
						setRegisterEmail('');
						setRegisterPassword('');
						setConfirmPassword('');
						setAddress('');
						setCity('');
						setInputFile(null);
					}
				} else if (res.status === 409) {
					setLoadingOverlay(false);
					setRegisterEmailError(LANGUAGE.register_modal_email_already_exists[selectedLanguage]);
				}
			} catch (error) {
				console.error(error);
				showNotification(
					errorNotification(
						LANGUAGE.notification_error_title[selectedLanguage],
						LANGUAGE.notification_error_message[selectedLanguage]
					)
				);
				setLoadingOverlay(false);
			}
		}
	};
	const handleLogin = async () => {
		//password format verification
		if (loginPassword.length < 8 && loginPassword.length > 0) {
			setLoginPasswordError(LANGUAGE.login_modal_password_too_short[selectedLanguage]);
		}
		//email format verification
		if (loginEmail.indexOf('@') === -1 || loginEmail.lastIndexOf('.') < loginEmail.indexOf('@')) {
			setLoginEmailError(LANGUAGE.login_modal_invalid_email_format[selectedLanguage]);
		}
		//empty fields verification
		if (loginEmail === '') {
			setLoginEmailError('Email is required');
		}
		if (loginPassword === '') {
			setLoginPasswordError(LANGUAGE.login_modal_password_empty[selectedLanguage]);
		}

		if (
			loginEmail !== '' &&
			loginPassword !== '' &&
			loginEmail.indexOf('@') !== -1 &&
			loginEmail.lastIndexOf('.') > loginEmail.indexOf('@') &&
			loginPassword.length >= 8
		) {
			//togle overlay
			setLoadingOverlay(true);
			try {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: loginEmail,
						password: loginPassword,
					}),
				});
				if (res.status === 200) {
					const response = await res.json();
					localStorage.setItem('api-token', response.token);
					dispatch(changeModalState('login', false));
					dispatch(setLoggedUser(response.user));
					setLoginEmail('');
					setLoginPassword('');
					if (response.user.role === ROLE.GENERAL_ADMIN) {
						navigate('/general-admin');
					}
				} else if (res.status === 403) {
					setLoadingOverlay(false);
					setLoginPasswordError(LANGUAGE.login_modal_password_wrong[selectedLanguage]);
				} else if (res.status === 404) {
					setLoadingOverlay(false);
					setLoginEmailError(LANGUAGE.login_modal_email_not_found[selectedLanguage]);
				}
			} catch (error) {
				console.error(error);
				showNotification(
					errorNotification(
						LANGUAGE.notification_error_title[selectedLanguage],
						LANGUAGE.notification_error_message[selectedLanguage]
					)
				);
				setLoadingOverlay(false);
			}
		}
	};

	const handleForgotPassword = async () => {
		//email format verification
		if (loginEmail.indexOf('@') === -1 || loginEmail.lastIndexOf('.') < loginEmail.indexOf('@')) {
			setLoginEmailError(LANGUAGE.login_modal_invalid_email_format[selectedLanguage]);
		}
		if (loginEmail === '') {
			setLoginEmailError(LANGUAGE.login_modal_email_empty[selectedLanguage]);
		}
		if (loginEmail !== '' && loginEmail.indexOf('@') !== -1 && loginEmail.lastIndexOf('.') > loginEmail.indexOf('@')) {
			//togle overlay
			setLoadingOverlay(true);
			try {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users/restore-password-email`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: loginEmail,
					}),
				});
				if (res.status === 200) {
					showNotification(
						infoNotification(
							LANGUAGE.notification_recovery_email_sent_title[selectedLanguage],
							LANGUAGE.notification_recovery_email_sent_message[selectedLanguage],
							'green'
						)
					);
					setLoginEmail('');
					setLoadingOverlay(false);
				} else if (res.status === 404) {
					setLoadingOverlay(false);
					setLoginEmailError(LANGUAGE.login_modal_email_not_found[selectedLanguage]);
				}
			} catch (error) {
				console.error(error);
				showNotification(
					errorNotification(
						LANGUAGE.notification_error_title[selectedLanguage],
						LANGUAGE.notification_error_message[selectedLanguage]
					)
				);
				setLoadingOverlay(false);
			}
		}
	};

	return (
		<>
			<Modal
				centered
				opened={modals.login}
				onClose={() => {
					dispatch(changeModalState('login', false));
					setLoginEmail('');
					setLoginPassword('');
					setLoginEmailError(false);
					setLoginPasswordError(false);
				}}
				title={LANGUAGE.login_modal_title[selectedLanguage]}>
				<div style={{ width: '100%', position: 'relative' }}>
					<LoadingOverlay visible={loadingOverlay} />
					<TextInput
						className='auth-input'
						icon={<MdAlternateEmail />}
						variant='filled'
						placeholder={LANGUAGE.login_modal_email[selectedLanguage]}
						radius='md'
						value={loginEmail}
						onChange={(e) => {
							setLoginEmail(e.target.value);
							setLoginEmailError(false);
						}}
						error={loginEmailError}
					/>
					<PasswordInput
						className='auth-input'
						icon={<CgPassword />}
						variant='filled'
						placeholder={LANGUAGE.login_modal_password[selectedLanguage]}
						radius='md'
						value={loginPassword}
						onChange={(e) => {
							setLoginPassword(e.target.value);
							setLoginPasswordError(false);
						}}
						error={loginPasswordError}
					/>
					<Button variant='subtle' radius='lg' size='xs' compact onClick={handleForgotPassword}>
						{LANGUAGE.login_modal_forgot_password[selectedLanguage]}
					</Button>
					<div className='auth-footer'>
						<div>
							<p>{LANGUAGE.login_modal_no_account[selectedLanguage]}</p>
							<Button
								size='xs'
								variant='subtle'
								compact
								color='#3378F7'
								radius='lg'
								onClick={() => {
									dispatch(changeModalState('register', true));
									dispatch(changeModalState('login', false));
									setLoginEmail('');
									setLoginPassword('');
									setLoginEmailError(false);
									setLoginPasswordError(false);
								}}>
								{LANGUAGE.login_modal_go_to_register[selectedLanguage]}
							</Button>
						</div>
						<Button variant='filled' color='#3378F7' radius='md' onClick={handleLogin}>
							{LANGUAGE.login_modal_submit[selectedLanguage]}
						</Button>
					</div>
				</div>
			</Modal>
			<Modal
				size='lg'
				centered
				opened={modals.register}
				onClose={() => {
					dispatch(changeModalState('register', false));
					setFirstName('');
					setLastName('');
					setRegisterEmail('');
					setCity('');
					setRegisterPassword('');
					setConfirmPassword('');
					setAddress('');
					setInputFile(null);
					setRegisterEmailError(false);
					setCityError(false);
					setRegisterPasswordError(false);
					setConfirmPasswordError(false);
					setAddressError(false);
					setFirstNameError(false);
					setLastNameError(false);
					setNoFileError(false);
				}}
				title={LANGUAGE.register_modal_title[selectedLanguage]}>
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
							placeholder={LANGUAGE.register_modal_email[selectedLanguage]}
							radius='md'
							type={'email'}
							value={registerEmail}
							onChange={(e) => {
								setRegisterEmail(e.target.value);
								setRegisterEmailError(false);
							}}
							error={registerEmailError}
						/>
						<NativeSelect
							data={cities.cities}
							placeholder={LANGUAGE.register_modal_city[selectedLanguage]}
							radius='md'
							variant='filled'
							icon={<IconBuilding style={{ width: 20 }} />}
							onChange={(e) => {
								setCity(e.currentTarget.value);
								setCityError(false);
							}}
							error={cityError}
						/>
					</div>
					<PasswordInput
						className='auth-input'
						icon={<CgPassword />}
						variant='filled'
						placeholder={LANGUAGE.register_modal_password[selectedLanguage]}
						description={LANGUAGE.register_modal_password_description[selectedLanguage]}
						radius='md'
						value={registerPassword}
						onChange={(e) => {
							setRegisterPassword(e.target.value);
							setRegisterPasswordError(false);
						}}
						error={registerPasswordError}
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
					<TextInput
						className='auth-input'
						icon={<FaRegAddressCard />}
						variant='filled'
						placeholder={LANGUAGE.register_modal_address[selectedLanguage]}
						radius='md'
						value={address}
						onChange={(e) => {
							setAddress(e.target.value);
							setAddressError(false);
						}}
						error={addressError}
					/>
					<p>{LANGUAGE.register_modal_add_id_pic_title[selectedLanguage]}</p>
					<FileDropzone setInputFile={setInputFile} noFileError={noFileError} modal='register' />
					<div className='auth-footer'>
						<div>
							<p>{LANGUAGE.register_modal_already_have_account[selectedLanguage]}</p>
							<Button
								size='xs'
								variant='subtle'
								color='#3378F7'
								radius='lg'
								compact
								onClick={() => {
									dispatch(changeModalState('login', true));
									dispatch(changeModalState('register', false));
									setFirstName('');
									setLastName('');
									setRegisterEmail('');
									setCity('');
									setRegisterPassword('');
									setConfirmPassword('');
									setAddress('');
									setInputFile(null);
									setRegisterEmailError(false);
									setCityError(false);
									setRegisterPasswordError(false);
									setConfirmPasswordError(false);
									setAddressError(false);
									setFirstNameError(false);
									setLastNameError(false);
									setNoFileError(false);
								}}>
								{LANGUAGE.register_modal_go_to_login[selectedLanguage]}
							</Button>
						</div>
						<Button variant='filled' color='#3378F7' radius='md' onClick={handleRegister}>
							{LANGUAGE.register_modal_submit[selectedLanguage]}
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};
export default Authentification;
