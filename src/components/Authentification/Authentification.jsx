import { Modal, Input, Button } from '@mantine/core';
import { MdAlternateEmail } from 'react-icons/md';
import { CgRename, CgPassword } from 'react-icons/cg';
import { FaRegAddressCard } from 'react-icons/fa';
import './Authentification.scss';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { changeAuthModal } from '../../redux/actions';
import FileDropzone from './FileDropzone';

const Authentification = () => {
	const dispatch = useDispatch();
	const authModal = useSelector((state) => state.authModal);

	return (
		<>
			<Modal opened={authModal.login} onClose={() => dispatch(changeAuthModal('login', false))} title='Login'>
				<Input className='auth-input' icon={<MdAlternateEmail />} variant='filled' placeholder='Your email' radius='md' />
				<Input className='auth-input' icon={<CgPassword />} variant='filled' placeholder='Password' radius='md' />
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
							}}>
							Register here
						</Button>
					</div>
					<Button variant='filled' color='#3378F7' radius='md'>
						Login
					</Button>
				</div>
			</Modal>
			<Modal opened={authModal.register} onClose={() => dispatch(changeAuthModal('register', false))} title='Register'>
				<Input className='auth-input' icon={<CgRename />} variant='filled' placeholder='First Name' radius='md' />
				<Input className='auth-input' icon={<CgRename />} variant='filled' placeholder='Last Name' radius='md' />
				<Input className='auth-input' icon={<MdAlternateEmail />} variant='filled' placeholder='Username' radius='md' />
				<Input className='auth-input' icon={<MdAlternateEmail />} variant='filled' placeholder='Your email' radius='md' />
				<Input className='auth-input' icon={<CgPassword />} variant='filled' placeholder='Password' radius='md' />
				<Input className='auth-input' icon={<CgPassword />} variant='filled' placeholder='Confirm Password' radius='md' />
				<Input className='auth-input' icon={<FaRegAddressCard />} variant='filled' placeholder='Address' radius='md' />
				<p>Add ID/Driving licence photo:</p>
				<FileDropzone />
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
							}}>
							Go to login
						</Button>
					</div>
					<Button variant='filled' color='#3378F7' radius='md'>
						Register
					</Button>
				</div>
			</Modal>
		</>
	);
};
export default Authentification;
