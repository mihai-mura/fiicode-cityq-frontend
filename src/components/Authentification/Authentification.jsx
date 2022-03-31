import { Modal, Input, Button } from '@mantine/core';
import { MdAlternateEmail } from 'react-icons/md';
import { CgRename, CgPassword } from 'react-icons/cg';
import { FaRegAddressCard } from 'react-icons/fa';
import './Authentification.scss';
import { useEffect, useState } from 'react';

const Authentification = (props) => {
	const [type, setType] = useState();
	useEffect(() => {
		setType(props.type);
	}, [props.type]);

	const registerForm = (
		<Modal opened={props.open} onClose={() => props.close()} title='Register'>
			<Input className='auth-input' icon={<CgRename />} variant='filled' placeholder='First Name' radius='md' />
			<Input className='auth-input' icon={<CgRename />} variant='filled' placeholder='Last Name' radius='md' />
			<Input className='auth-input' icon={<MdAlternateEmail />} variant='filled' placeholder='Username' radius='md' />
			<Input className='auth-input' icon={<MdAlternateEmail />} variant='filled' placeholder='Your email' radius='md' />
			<Input className='auth-input' icon={<CgPassword />} variant='filled' placeholder='Password' radius='md' />
			<Input className='auth-input' icon={<CgPassword />} variant='filled' placeholder='Confirm Password' radius='md' />
			<Input className='auth-input' icon={<FaRegAddressCard />} variant='filled' placeholder='Address' radius='md' />
			<p>Add ID/Driving licence photo:</p>
			{/*//! add picture input */}
			<div className='auth-footer'>
				<div>
					<p>Already have an account?</p>
					<Button size='xs' variant='subtle' color='#3378F7' radius='md' onClick={() => setType(0)}>
						Go to login
					</Button>
				</div>
				<Button variant='filled' color='#3378F7' radius='md'>
					Register
				</Button>
			</div>
		</Modal>
	);
	const loginForm = (
		<Modal opened={props.open} onClose={() => props.close()} title='Login'>
			<Input className='auth-input' icon={<MdAlternateEmail />} variant='filled' placeholder='Your email' radius='md' />
			<Input className='auth-input' icon={<CgPassword />} variant='filled' placeholder='Password' radius='md' />
			<div className='auth-footer'>
				<div>
					<p>Don't have an account?</p>
					<Button size='xs' variant='subtle' color='#3378F7' radius='md' onClick={() => setType(1)}>
						Register here
					</Button>
				</div>
				<Button variant='filled' color='#3378F7' radius='md'>
					Login
				</Button>
			</div>
		</Modal>
	);

	return type ? registerForm : loginForm;
};
export default Authentification;
