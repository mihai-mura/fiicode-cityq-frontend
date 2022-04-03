import './Authentification.scss';
import { Modal, TextInput, Button, PasswordInput, LoadingOverlay } from '@mantine/core';
import { MdAlternateEmail } from 'react-icons/md';
import { CgRename, CgPassword } from 'react-icons/cg';
import { FaRegAddressCard } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { changeAuthModal } from '../../redux/actions';
import { useEffect, useState } from 'react';
import FileDropzone from './FileDropzone';
import imageCompression from 'browser-image-compression';

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
	//errors
	const [firstNameError, setFirstNameError] = useState(false);
	const [lastNameError, setLastNameError] = useState(false);
	const [registerEmailError, setRegisterEmailError] = useState(false);
	const [addressError, setAddressError] = useState(false);
	const [loginEmailError, setLoginEmailError] = useState(false);
	const [registerPasswordError, setRegisterPasswordError] = useState(false);
	const [confirmPasswordError, setConfirmPasswordError] = useState(false);
	const [loginPasswordError, setLoginPasswordError] = useState(false);
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
			setFirstNameError('First name is required');
		}
		if (lastName === '') {
			setLastNameError('Last name is required');
		}
		if (registerEmail === '') {
			setRegisterEmailError('Email is required');
		}
		if (registerPassword === '') {
			setRegisterPasswordError('Password is required');
		}
		if (confirmPassword === '') {
			setConfirmPasswordError(true);
		}
		if (address === '') {
			setAddressError('Address is required');
		}
		//email format verification
		if (registerEmail.indexOf('@') === -1 || registerEmail.lastIndexOf('.') < registerEmail.indexOf('@')) {
			setRegisterEmailError('Invalid email format');
		}
		//password format verification
		if (registerPassword.length < 8 && registerPassword.length > 0) {
			setRegisterPasswordError('Password has less than 8 characters');
		}
		if (registerPassword !== confirmPassword) {
			setConfirmPasswordError('Passwords do not match');
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
					firstName: firstName,
					lastName: lastName,
					address: address,
					password: registerPassword,
				}),
			});
			if (res.status === 201) {
				const token = await res.text();
				localStorage.setItem('api-token', token);
				//* send id picture to backend compressed
				const options = {
					maxSizeMB: 1,
				};
				const compressedFile = await imageCompression(inputFile, options);
				console.log(compressedFile);
				const idPicture = new FormData();
				idPicture.append('idPic', compressedFile);
				const res2 = await fetch(`${process.env.REACT_APP_API_URL}/users/register/id`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: idPicture,
				});
				if (res2.status === 200) {
					dispatch(changeAuthModal('register', false));
					//! user logged in
				}
			} else if (res.status === 409) {
				setRegisterEmailError('Email already in use');
			}
		}
	};
	const handleLogin = async () => {
		if (loginEmail === '') {
			setLoginEmailError('Email is required');
		}
		//password format verification
		if (loginPassword.length < 8) {
			setLoginPasswordError('Password has less than 8 characters');
		}
		if (loginPassword === '') {
			setLoginPasswordError('Password is required');
		}
		//email format verification
		if (loginEmail.indexOf('@') === -1 || loginEmail.lastIndexOf('.') < loginEmail.indexOf('@')) {
			setLoginEmailError('Invalid email format');
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
				const token = await res.text();
				localStorage.setItem('api-token', token);
				dispatch(changeAuthModal('login', false));
				//! user logged in
			} else if (res.status === 403) {
				setLoginPasswordError('Incorrect password');
			} else if (res.status === 404) {
				setLoginEmailError('User not found');
			}
		}
	};

	return (
		<>
			<Modal centered opened={authModal.login} onClose={() => dispatch(changeAuthModal('login', false))} title='Login'>
				<div style={{ width: '100%', position: 'relative' }}>
					<LoadingOverlay visible={loading} />
					<TextInput
						className='auth-input'
						icon={<MdAlternateEmail />}
						variant='filled'
						placeholder='Your email'
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
						placeholder='Password'
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
							<p>Don't have an account?</p>
							<Button
								size='xs'
								variant='subtle'
								color='#3378F7'
								radius='md'
								onClick={() => {
									dispatch(changeAuthModal('login', false));
									dispatch(changeAuthModal('register', true));
									setLoginEmail('');
									setLoginPassword('');
									setLoginEmailError(false);
									setLoginPasswordError(false);
								}}>
								Register here
							</Button>
						</div>
						<Button variant='filled' color='#3378F7' radius='md' onClick={handleLogin}>
							Login
						</Button>
					</div>
				</div>
			</Modal>
			<Modal
				size='lg'
				centered
				opened={authModal.register}
				onClose={() => dispatch(changeAuthModal('register', false))}
				title='Register'>
				<div style={{ width: '100%', position: 'relative' }}>
					<LoadingOverlay visible={loading} />
					<div className='register-name-field'>
						<TextInput
							className='auth-input'
							icon={<CgRename />}
							variant='filled'
							placeholder='First Name'
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
							placeholder='Last Name'
							radius='md'
							value={lastName}
							onChange={(e) => {
								setLastName(e.target.value);
								setLastNameError(false);
							}}
							error={lastNameError}
						/>
					</div>
					<TextInput
						className='auth-input'
						icon={<MdAlternateEmail />}
						variant='filled'
						placeholder='Your email'
						radius='md'
						type={'email'}
						value={registerEmail}
						onChange={(e) => {
							setRegisterEmail(e.target.value);
							setRegisterEmailError(false);
						}}
						error={registerEmailError}
					/>
					<PasswordInput
						className='auth-input'
						icon={<CgPassword />}
						variant='filled'
						placeholder='Password'
						description='Password must be at least 8 characters long'
						radius='md'
						value={registerPassword}
						onChange={(e) => {
							setRegisterPassword(e.target.value);
							setRegisterPasswordError(false);
						}}
						error={registerPasswordError}
					/>
					<PasswordInput
						className='auth-input'
						icon={<CgPassword />}
						variant='filled'
						placeholder='Confirm Password'
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
						placeholder='Address'
						radius='md'
						value={address}
						onChange={(e) => {
							setAddress(e.target.value);
							setAddressError(false);
						}}
						error={addressError}
					/>
					<p>Add ID/Driving licence photo:</p>
					<FileDropzone setInputFile={setInputFile} noFileError={noFileError} />
					<div className='auth-footer'>
						<div>
							<p>Already have an account?</p>
							<Button
								size='xs'
								variant='subtle'
								color='#3378F7'
								radius='md'
								onClick={() => {
									dispatch(changeAuthModal('register', false));
									dispatch(changeAuthModal('login', true));
									setFirstName('');
									setLastName('');
									setRegisterEmail('');
									setRegisterPassword('');
									setConfirmPassword('');
									setAddress('');
									setInputFile(null);
									setRegisterEmailError(false);
									setRegisterPasswordError(false);
									setConfirmPasswordError(false);
									setAddressError(false);
									setFirstNameError(false);
									setLastNameError(false);
									setNoFileError(false);
								}}>
								Go to login
							</Button>
						</div>
						<Button variant='filled' color='#3378F7' radius='md' onClick={handleRegister}>
							Register
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};
export default Authentification;
