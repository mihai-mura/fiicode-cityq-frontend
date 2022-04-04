import './Authentification.scss';
import { useState } from 'react';
import { IconCheck, IconX } from '@tabler/icons';
import { CgPassword } from 'react-icons/cg';
import { PasswordInput, Progress, Text, Popover, Box } from '@mantine/core';

function PasswordRequirement({ meets, label }) {
	return (
		<Text color={meets ? 'teal' : 'red'} sx={{ display: 'flex', alignItems: 'center' }} mt={7} size='sm'>
			{meets ? <IconCheck /> : <IconX />} <Box ml={10}>{label}</Box>
		</Text>
	);
}

const requirements = [
	{ re: /[0-9]/, label: 'Includes number' },
	{ re: /[a-z]/, label: 'Includes lowercase letter' },
	{ re: /[A-Z]/, label: 'Includes uppercase letter' },
	{ re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password) {
	let multiplier = password.length > 8 ? 0 : 1;

	requirements.forEach((requirement) => {
		if (!requirement.re.test(password)) {
			multiplier += 1;
		}
	});

	return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

const PasswordStrength = (props) => {
	const [popoverOpened, setPopoverOpened] = useState(false);
	const [value, setValue] = useState('');
	const checks = requirements.map((requirement, index) => (
		<PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)} />
	));

	const strength = getStrength(value);
	const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

	return (
		<Popover
			opened={popoverOpened}
			position='bottom'
			placement='start'
			withArrow
			styles={{ popover: { width: '100%' } }}
			trapFocus={false}
			transition='pop-top-left'
			onFocusCapture={() => setPopoverOpened(true)}
			onBlurCapture={() => setPopoverOpened(false)}
			target={
				<PasswordInput
					className='auth-input'
					icon={<CgPassword />}
					variant='filled'
					placeholder='Password'
					description='Password must be at least 8 characters long and contain at least one number, one lowercase letter, one uppercase letter and one special character.'
					radius='md'
					value={props.value}
					onChange={(e) => {
						setValue(e.target.value);
						props.setRegisterPassword(e.target.value);
						props.setRegisterPasswordError(false);
					}}
					error={props.error}
				/>
			}>
			<Progress color={color} value={strength} size={5} style={{ marginBottom: 10 }} />
			<PasswordRequirement label='Includes at least 8 characters' meets={value.length > 8} />
			{checks}
		</Popover>
	);
};

export default PasswordStrength;
