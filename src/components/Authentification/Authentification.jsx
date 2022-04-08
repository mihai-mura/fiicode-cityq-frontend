import './Authentification.scss';
import { Modal, TextInput, Button, PasswordInput, LoadingOverlay, NativeSelect } from '@mantine/core';
import { MdAlternateEmail } from 'react-icons/md';
import { CgRename, CgPassword } from 'react-icons/cg';
import { FaRegAddressCard } from 'react-icons/fa';
import { IconBuilding } from '@tabler/icons';
import { useSelector, useDispatch } from 'react-redux';
import { changeAuthModal, changeUserLogged } from '../../redux/actions';
import { useEffect, useState } from 'react';
import imageCompression from 'browser-image-compression';
import FileDropzone from './FileDropzone';
import cities from './cities';
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
		if (city === '' || city === 'Select city') {
			setCityError('City is required');
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
				const response = await res.text();
				localStorage.setItem('api-token', response);
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
						Authorization: `Bearer ${response}`,
					},
					body: idPicture,
				});
				if (res2.status === 200) {
					dispatch(changeAuthModal('register', false));
					dispatch(changeUserLogged(true));
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
				const response = await res.text();
				localStorage.setItem('api-token', response);
				dispatch(changeAuthModal('login', false));
				dispatch(changeUserLogged(true));
				setLoginEmail('');
				setLoginPassword('');
			} else if (res.status === 403) {
				setLoading(false);
				setLoginPasswordError('Incorrect password');
			} else if (res.status === 404) {
				setLoading(false);
				setLoginEmailError('User not found');
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
				title='Login'>
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
									dispatch(changeAuthModal('register', true));
									dispatch(changeAuthModal('login', false));
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
				title='Register'>
				<div style={{ width: '100%', position: 'relative' }}>
					<LoadingOverlay visible={loading} />
					<div className='register-field-row'>
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
					<div className='register-field-row'>
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
						<NativeSelect
							data={cities}
							placeholder='Select city'
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
