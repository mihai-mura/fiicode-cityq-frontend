import { Modal, Input, Button } from '@mantine/core';
import { MdAlternateEmail } from 'react-icons/md';
import { CgRename, CgPassword } from 'react-icons/cg';
import { FaRegAddressCard } from 'react-icons/fa';
import './Authentification.scss';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { changeAuthModal } from '../../redux/actions';
import FileDropzone from './FileDropzone';
import { useState } from 'react';

const Authentification = () => {
	const dispatch = useDispatch();
	const authModal = useSelector((state) => state.authModal);

	//inputs
	const [firstName, setFirstName] = useState('');
	const [firstNameInvalid, setFirstNameInvalid] = useState(false);
	const [lastName, setLastName] = useState('');
	const [lastNameInvalid, setLastNameInvalid] = useState(false);
	const [registerEmail, setRegisterEmail] = useState('');
	const [registerEmailInvalid, setRegisterEmailInvalid] = useState(false);
	const [registerPassword, setRegisterPassword] = useState('');
	const [registerPasswordInvalid, setRegisterPasswordInvalid] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState('');
	const [confirmPasswordInvalid, setConfirmPasswordInvalid] = useState(false);
	const [address, setAddress] = useState('');
	const [addressInvalid, setAddressInvalid] = useState(false);
	const [loginEmail, setLoginEmail] = useState('');
	const [loginEmailInvalid, setLoginEmailInvalid] = useState(false);
	const [loginPassword, setLoginPassword] = useState('');
	const [loginPasswordInvalid, setLoginPasswordInvalid] = useState(false);

	const [inputFile, setInputFile] = useState(null);

	const handleRegister = async () => {
		if (firstName === '') {
			setFirstNameInvalid(true);
		}
		if (lastName === '') {
			setLastNameInvalid(true);
		}
		if (registerEmail === '') {
			setRegisterEmailInvalid(true);
		}
		if (registerPassword === '') {
			setRegisterPasswordInvalid(true);
		}
		if (confirmPassword === '') {
			setConfirmPasswordInvalid(true);
		}
		if (address === '') {
			setAddressInvalid(true);
		}
		//email format verification
		if (registerEmail.indexOf('@') === -1 || registerEmail.lastIndexOf('.') < registerEmail.indexOf('@')) {
			setRegisterEmailInvalid(true);
			//! alert invalid email format
		}
		//password format verification
		if (registerPassword.length < 8) {
			setRegisterPasswordInvalid(true);
			//! alert password too short
		}
		if (registerPassword !== confirmPassword) {
			setConfirmPasswordInvalid(true);
			//!alert password mismatch
		}
		if (inputFile === null) {
			//! alert no image selected
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
				//* send id to backend
				//!compress picture
				const idPicture = new FormData();
				idPicture.append('idPic', inputFile);
				const res2 = await fetch(`${process.env.REACT_APP_API_URL}/users/register/id`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: idPicture,
				});
				if (res2.status === 200) {
					//! user logged in
					dispatch(changeAuthModal('register', false));
				} else {
					//! alert something went wrong
				}
			} else if (res.status === 409) {
				setRegisterEmailInvalid(true);
				//! alert user already exists
			}
		}
	};
	const handleLogin = async () => {
		if (loginEmail === '') {
			setLoginEmailInvalid(true);
		}
		if (loginPassword === '') {
			setLoginPasswordInvalid(true);
		}
		//email format verification
		if (loginEmail.indexOf('@') === -1 || loginEmail.lastIndexOf('.') < loginEmail.indexOf('@')) {
			setLoginEmailInvalid(true);
			//! alert invalid email format
		}
		//password format verification
		if (loginPassword.length < 8) {
			setLoginPasswordInvalid(true);
			//! alert password too short
		}

		if (
			loginEmail !== '' &&
			loginPassword !== '' &&
			loginEmail.indexOf('@') !== -1 &&
			loginEmail.lastIndexOf('.') > loginEmail.indexOf('@') &&
			loginPassword.length >= 8
		) {
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
				//! user logged in
				dispatch(changeAuthModal('login', false));
			} else if (res.status === 403) {
				setLoginPasswordInvalid(true);
				//! alert invalid password
			} else if (res.status === 404) {
				setLoginEmailInvalid(true);
				//! alert invalid email
			}
		}
	};

	return (
		<>
			<Modal centered opened={authModal.login} onClose={() => dispatch(changeAuthModal('login', false))} title='Login'>
				<Input
					className='auth-input'
					icon={<MdAlternateEmail />}
					variant='filled'
					placeholder='Your email'
					radius='md'
					value={loginEmail}
					onChange={(e) => {
						setLoginEmail(e.target.value);
						setLoginEmailInvalid(false);
					}}
					invalid={loginEmailInvalid}
				/>
				<Input
					className='auth-input'
					icon={<CgPassword />}
					variant='filled'
					placeholder='Password'
					radius='md'
					value={loginPassword}
					onChange={(e) => {
						setLoginPassword(e.target.value);
						setLoginPasswordInvalid(false);
					}}
					invalid={loginPasswordInvalid}
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
								setLoginEmailInvalid(false);
								setLoginPasswordInvalid(false);
							}}>
							Register here
						</Button>
					</div>
					<Button variant='filled' color='#3378F7' radius='md' onClick={handleLogin}>
						Login
					</Button>
				</div>
			</Modal>
			<Modal
				size='lg'
				centered
				opened={authModal.register}
				onClose={() => dispatch(changeAuthModal('register', false))}
				title='Register'>
				<div className='register-name-field'>
					<Input
						className='auth-input'
						icon={<CgRename />}
						variant='filled'
						placeholder='First Name'
						radius='md'
						value={firstName}
						onChange={(e) => {
							setFirstName(e.target.value);
							setFirstNameInvalid(false);
						}}
						invalid={firstNameInvalid}
					/>
					<Input
						className='auth-input'
						icon={<CgRename />}
						variant='filled'
						placeholder='Last Name'
						radius='md'
						value={lastName}
						onChange={(e) => {
							setLastName(e.target.value);
							setLastNameInvalid(false);
						}}
						invalid={lastNameInvalid}
					/>
				</div>
				<Input
					className='auth-input'
					icon={<MdAlternateEmail />}
					variant='filled'
					placeholder='Your email'
					radius='md'
					type={'email'}
					value={registerEmail}
					onChange={(e) => {
						setRegisterEmail(e.target.value);
						setRegisterEmailInvalid(false);
					}}
					invalid={registerEmailInvalid}
				/>
				<Input
					className='auth-input'
					icon={<CgPassword />}
					variant='filled'
					placeholder='Password'
					radius='md'
					value={registerPassword}
					onChange={(e) => {
						setRegisterPassword(e.target.value);
						setRegisterPasswordInvalid(false);
					}}
					invalid={registerPasswordInvalid}
				/>
				<Input
					className='auth-input'
					icon={<CgPassword />}
					variant='filled'
					placeholder='Confirm Password'
					radius='md'
					value={confirmPassword}
					onChange={(e) => {
						setConfirmPassword(e.target.value);
						setConfirmPasswordInvalid(false);
					}}
					invalid={confirmPasswordInvalid}
				/>
				<Input
					className='auth-input'
					icon={<FaRegAddressCard />}
					variant='filled'
					placeholder='Address'
					radius='md'
					value={address}
					onChange={(e) => {
						setAddress(e.target.value);
						setAddressInvalid(false);
					}}
					invalid={addressInvalid}
				/>
				<p>Add ID/Driving licence photo:</p>
				<FileDropzone setInputFile={setInputFile} />
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
								setRegisterEmailInvalid(false);
								setRegisterPasswordInvalid(false);
								setConfirmPasswordInvalid(false);
								setAddressInvalid(false);
								setFirstNameInvalid(false);
								setLastNameInvalid(false);
							}}>
							Go to login
						</Button>
					</div>
					<Button variant='filled' color='#3378F7' radius='md' onClick={handleRegister}>
						Register
					</Button>
				</div>
			</Modal>
		</>
	);
};
export default Authentification;
