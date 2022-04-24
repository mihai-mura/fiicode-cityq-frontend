import LANGUAGE from '../../utils/languages.json';
import { useSelector } from 'react-redux';
import './UserSettings.scss';
import { Button, PasswordInput, TextInput } from '@mantine/core';
import UrlFetchImg from '../../components/UrlFetchImage/UrlFetchImg';
import { useEffect, useRef, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { infoNotification, errorNotification } from '../../components/Notifications/Notifications';
import imageCompression from 'browser-image-compression';
import { useNavigate } from 'react-router-dom';
import ROLE from '../../utils/roles';

const Settings = () => {
	const navigate = useNavigate();
	const selectedLanguage = useSelector((state) => state.language);
	const loggedUser = useSelector((state) => state.loggedUser);

	const profilePicInput = useRef();

	//fields
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [address, setAddress] = useState('');

	//field errors
	const [firstNameError, setFirstNameError] = useState(null);
	const [lastNameError, setLastNameError] = useState(null);
	const [passwordError, setPasswordError] = useState(null);
	const [confirmPasswordError, setConfirmPasswordError] = useState(null);
	const [addressError, setAddressError] = useState(null);

	//redirect general admin
	useEffect(() => {
		if (loggedUser?.role === ROLE.GENERAL_ADMIN) {
			navigate('/general-admin/settings');
		}
	}, [loggedUser]);

	//set users settings in fields
	useEffect(() => {
		setFirstName(loggedUser?.firstName);
		setLastName(loggedUser?.lastName);
		setAddress(loggedUser?.address);
	}, [loggedUser]);

	const handleSave = async () => {
		//verifies if all the data was updated successfully
		let success = true;

		//firstName
		if (firstName !== loggedUser?.firstName) {
			if (firstName === '') {
				setFirstNameError(LANGUAGE.register_modal_first_name_error[selectedLanguage]);
			} else {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users/first-name`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('api-token')}`,
					},
					body: JSON.stringify({ value: firstName }),
				});
				if (res.status === 200) {
					setFirstName(firstName.charAt(0).toUpperCase() + firstName.slice(1));
				} else {
					success = false;
				}
			}
		}
		//lastName
		if (lastName !== loggedUser?.lastName) {
			if (lastName === '') {
				setLastNameError(LANGUAGE.register_modal_last_name_error[selectedLanguage]);
			} else {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users/last-name`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('api-token')}`,
					},
					body: JSON.stringify({ value: lastName }),
				});
				if (res.status === 200) {
					setLastName(lastName.charAt(0).toUpperCase() + lastName.slice(1));
				} else {
					success = false;
				}
			}
		}
		//password
		if (password !== '') {
			if (password.length < 8 && password.length > 0) {
				setPasswordError(LANGUAGE.register_modal_invalid_password_format[selectedLanguage]);
			}
			if (password !== confirmPassword) {
				setConfirmPasswordError(LANGUAGE.register_modal_confirm_password_error[selectedLanguage]);
			}
			if (password !== '' && confirmPassword !== '' && password.length >= 8 && password === confirmPassword) {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users/password`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('api-token')}`,
					},
					body: JSON.stringify({ value: password }),
				});
				if (res.status !== 200) {
					success = false;
				}
			}
		}
		//address
		if (address !== loggedUser?.address) {
			if (address === '') {
				setAddressError(LANGUAGE.register_modal_address_error[selectedLanguage]);
			} else {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users/address`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('api-token')}`,
					},
					body: JSON.stringify({ value: address }),
				});
				if (res.status !== 200) {
					success = false;
				}
			}
		}
		if (firstName !== '' && lastName !== '' && address !== '') {
			if (success) {
				showNotification(infoNotification(LANGUAGE.notification_settings_saved[selectedLanguage]));
				setPassword('');
				setConfirmPassword('');
			} else {
				showNotification(errorNotification(LANGUAGE.notification_settings_error[selectedLanguage]));
			}
		}
	};

	const handleProfilePicChange = async () => {
		profilePicInput.current.click();
		profilePicInput.current.onchange = async (event) => {
			//image compression
			const options = {
				maxSizeMB: 1,
				maxWidthOrHeight: 360,
				useWebWorker: true,
			};
			let compressedFile;

			try {
				compressedFile = await imageCompression(event.target.files[0], options);
			} catch (error) {
				console.error(error);
			}

			const formData = new FormData();
			formData.append('profile-pic', compressedFile);

			const res = await fetch(`${process.env.REACT_APP_API_URL}/users/profile-pic`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('api-token')}`,
				},
				body: formData,
			});
			if (res.status === 200) {
				showNotification(infoNotification(LANGUAGE.notification_profile_pic_saved[selectedLanguage]));
			} else {
				showNotification(errorNotification(LANGUAGE.notification_profile_pic_save_error[selectedLanguage]));
			}
		};
	};

	return (
		<div className='settings-page'>
			<div className='settings-top-container'>
				<div className='settings-top'>
					<h3 className='settings-head'>{LANGUAGE.settings_header[selectedLanguage]}</h3>
					<p className='settings-top-text'>{LANGUAGE.settings_top_text[selectedLanguage]}</p>
				</div>
			</div>
			<div className='settings-main-container'>
				<div className='settings-main'>
					<div className='header'>
						<input ref={profilePicInput} style={{ display: 'none' }} type='file' alt='profile picture' />
						<UrlFetchImg
							className='profile-img'
							url={`${process.env.REACT_APP_API_URL}/users/profile-pic/${loggedUser?._id}`}
							onClick={handleProfilePicChange}
						/>
					</div>
					<div className='settings-main-top'>
						<TextInput
							className='settings-text-input'
							radius='md'
							label={LANGUAGE.register_modal_first_name[selectedLanguage]}
							placeholder={LANGUAGE.register_modal_first_name[selectedLanguage]}
							value={firstName}
							error={firstNameError}
							onChange={(e) => {
								setFirstName(e.target.value);
								setFirstNameError(null);
							}}
						/>
						<TextInput
							className='settings-text-input'
							radius='md'
							label={LANGUAGE.register_modal_last_name[selectedLanguage]}
							placeholder={LANGUAGE.register_modal_last_name[selectedLanguage]}
							value={lastName}
							error={lastNameError}
							onChange={(e) => {
								setLastName(e.target.value);
								setLastNameError(null);
							}}
						/>
					</div>
					<div className='settings-main-middle'>
						<PasswordInput
							className='settings-text-input'
							radius='md'
							label={LANGUAGE.settings_password_input[selectedLanguage]}
							placeholder={LANGUAGE.settings_password_input[selectedLanguage]}
							value={password}
							error={passwordError}
							onChange={(e) => {
								setPassword(e.target.value);
								setPasswordError(null);
							}}
						/>
						<PasswordInput
							className='settings-text-input'
							radius='md'
							label={LANGUAGE.settings_password_confirm_input[selectedLanguage]}
							placeholder={LANGUAGE.settings_password_confirm_input[selectedLanguage]}
							value={confirmPassword}
							error={confirmPasswordError}
							onChange={(e) => {
								setConfirmPassword(e.target.value);
								setConfirmPasswordError(null);
							}}
						/>
					</div>
					<div className='settings-main-down'>
						<TextInput
							className='settings-text-input'
							radius='md'
							label={LANGUAGE.settings_address_input[selectedLanguage]}
							placeholder={LANGUAGE.settings_address_input[selectedLanguage]}
							value={address}
							error={addressError}
							onChange={(e) => {
								setAddress(e.target.value);
								setAddressError(null);
							}}
						/>
					</div>
					<div className='footer'>
						<Button radius='xl' onClick={handleSave}>
							{LANGUAGE.settings_page_save[selectedLanguage]}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Settings;
