import './Authentification.scss';
import { Modal, TextInput, Button, PasswordInput, LoadingOverlay, NativeSelect } from '@mantine/core';
import { MdAlternateEmail } from 'react-icons/md';
import { CgRename, CgPassword } from 'react-icons/cg';
import { FaRegAddressCard } from 'react-icons/fa';
import { IconBuilding } from '@tabler/icons';
import { useSelector, useDispatch } from 'react-redux';
import { changeAuthModal, setLoggedUser } from '../../redux/actions';
import { useEffect, useState } from 'react';
import imageCompression from 'browser-image-compression';
import FileDropzone from './FileDropzone';
import cities from './cities';
import LANGUAGE from '../../utils/languages.json';
import PasswordStrength from './PasswordStrength';

const Authentification = () => {
	const dispatch = useDispatch();
	const authModal = useSelector((state) => state.authModal);

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
	const [loading, setLoading] = useState(false);

	const [inputFile, setInputFile] = useState(null);

	//stop overlay
	useEffect(() => {
		if (!authModal.login && !authModal.register) {
			setLoading(false);
		}
	}, [authModal]);

	const handleRegister = async () => {
		if (firstName === '') {
			setFirstNameError(LANGUAGE.register_modal_first_name_error.en);
		}
		if (lastName === '') {
			setLastNameError(LANGUAGE.register_modal_last_name_error.en);
		}
		if (registerEmail === '') {
			setRegisterEmailError(LANGUAGE.register_modal_email_error.en);
		}
		if (registerPassword === '') {
			setRegisterPasswordError(LANGUAGE.register_modal_password_error.en);
		}
		if (confirmPassword === '') {
			setConfirmPasswordError(true);
		}
		if (address === '') {
			setAddressError(LANGUAGE.register_modal_address_error.en);
		}
		if (city === '' || city === 'Select city') {
			setCityError(LANGUAGE.register_modal_city_error.en);
		}
		//email format verification
		if (registerEmail.indexOf('@') === -1 || registerEmail.lastIndexOf('.') < registerEmail.indexOf('@')) {
			setRegisterEmailError(LANGUAGE.register_modal_invaid_email_format.en);
		}
		//password format verification
		if (registerPassword.length < 8 && registerPassword.length > 0) {
			setRegisterPasswordError(LANGUAGE.register_modal_invalid_password_format.en);
		}
		if (registerPassword !== confirmPassword) {
			setConfirmPasswordError(LANGUAGE.register_modal_confirm_password_error.en);
		}
		if (inputFile === null) {
			setNoFileError(true);
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
			setLoading(true);
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
			if (res.status === 201) {
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
					dispatch(changeAuthModal('register', false));
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
				setLoading(false);
				setRegisterEmailError(LANGUAGE.register_modal_email_already_exists.en);
			}
		}
	};
	const handleLogin = async () => {
		if (loginEmail === '') {
			setLoginEmailError('Email is required');
		}
		//password format verification
		if (loginPassword.length < 8 && loginPassword.length > 0) {
			setLoginPasswordError(LANGUAGE.login_modal_password_too_short.en);
		}
		if (loginPassword === '') {
			setLoginPasswordError(LANGUAGE.login_modal_password_empty.en);
		}
		//email format verification
		if (loginEmail.indexOf('@') === -1 || loginEmail.lastIndexOf('.') < loginEmail.indexOf('@')) {
			setLoginEmailError(LANGUAGE.login_modal_invalid_email_format.en);
		}

		if (
			loginEmail !== '' &&
			loginPassword !== '' &&
			loginEmail.indexOf('@') !== -1 &&
			loginEmail.lastIndexOf('.') > loginEmail.indexOf('@') &&
			loginPassword.length >= 8
		) {
			//togle overlay
			setLoading(true);
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
				dispatch(changeAuthModal('login', false));
				dispatch(setLoggedUser(response.user));
				setLoginEmail('');
				setLoginPassword('');
			} else if (res.status === 403) {
				setLoading(false);
				setLoginPasswordError(LANGUAGE.login_modal_password_wrong.en);
			} else if (res.status === 404) {
				setLoading(false);
				setLoginEmailError(LANGUAGE.login_modal_email_not_found.en);
			}
		}
	};

	return (
		<>
			<Modal
				centered
				opened={authModal.login}
				onClose={() => {
					dispatch(changeAuthModal('login', false));
					setLoginEmail('');
					setLoginPassword('');
					setLoginEmailError(false);
					setLoginPasswordError(false);
				}}
				title={LANGUAGE.login_modal_title.en}>
				<div style={{ width: '100%', position: 'relative' }}>
					<LoadingOverlay visible={loading} />
					<TextInput
						className='auth-input'
						icon={<MdAlternateEmail />}
						variant='filled'
						placeholder={LANGUAGE.login_modal_email.en}
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
						placeholder={LANGUAGE.login_modal_password.en}
						radius='md'
						value={loginPassword}
						onChange={(e) => {
							setLoginPassword(e.target.value);
							setLoginPasswordError(false);
						}}
						error={loginPasswordError}
					/>
					<div className='auth-footer'>
						<div>
							<p>{LANGUAGE.login_modal_no_account.en}</p>
							<Button
								size='xs'
								variant='subtle'
								color='#3378F7'
								radius='md'
								onClick={() => {
									dispatch(changeAuthModal('register', true));
									dispatch(changeAuthModal('login', false));
									setLoginEmail('');
									setLoginPassword('');
									setLoginEmailError(false);
									setLoginPasswordError(false);
								}}>
								{LANGUAGE.login_modal_go_to_register.en}
							</Button>
						</div>
						<Button variant='filled' color='#3378F7' radius='md' onClick={handleLogin}>
							{LANGUAGE.login_modal_submit.en}
						</Button>
					</div>
				</div>
			</Modal>
			<Modal
				size='lg'
				centered
				opened={authModal.register}
				onClose={() => {
					dispatch(changeAuthModal('register', false));
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
				title={LANGUAGE.register_modal_title.en}>
				<div style={{ width: '100%', position: 'relative' }}>
					<LoadingOverlay visible={loading} />
					<div className='register-field-row'>
						<TextInput
							className='auth-input'
							icon={<CgRename />}
							variant='filled'
							placeholder={LANGUAGE.register_modal_first_name.en}
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
							placeholder={LANGUAGE.register_modal_last_name.en}
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
							placeholder={LANGUAGE.register_modal_email.en}
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
							data={cities}
							placeholder={LANGUAGE.register_modal_city.en}
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
						placeholder={LANGUAGE.register_modal_password.en}
						description={LANGUAGE.register_modal_password_description.en}
						radius='md'
						value={registerPassword}
						onChange={(e) => {
							setRegisterPassword(e.target.value);
							setRegisterPasswordError(false);
						}}
						error={registerPasswordError}
					/>
					{/*//* ⬇️⬇️pretty cool⬇️⬇️ */}
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
						placeholder={LANGUAGE.register_modal_confirm_password.en}
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
						placeholder={LANGUAGE.register_modal_address.en}
						radius='md'
						value={address}
						onChange={(e) => {
							setAddress(e.target.value);
							setAddressError(false);
						}}
						error={addressError}
					/>
					<p>{LANGUAGE.register_modal_add_id_pic_title.en}</p>
					<FileDropzone setInputFile={setInputFile} noFileError={noFileError} />
					<div className='auth-footer'>
						<div>
							<p>{LANGUAGE.register_modal_already_have_account.en}</p>
							<Button
								size='xs'
								variant='subtle'
								color='#3378F7'
								radius='md'
								onClick={() => {
									dispatch(changeAuthModal('login', true));
									dispatch(changeAuthModal('register', false));
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
								{LANGUAGE.register_modal_go_to_login.en}
							</Button>
						</div>
						<Button variant='filled' color='#3378F7' radius='md' onClick={handleRegister}>
							{LANGUAGE.register_modal_submit.en}
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};
export default Authentification;
