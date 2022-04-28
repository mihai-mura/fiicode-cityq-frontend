import './Authentification.scss';
import { useState } from 'react';
import { IconCheck, IconX } from '@tabler/icons';
import { CgPassword } from 'react-icons/cg';
import { PasswordInput, Progress, Text, Popover, Box } from '@mantine/core';
import LANGUAGE from '../../utils/languages.json';
import { useSelector } from 'react-redux';

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
	const selectedLanguage = useSelector((store) => store.language);

	const [popoverOpened, setPopoverOpened] = useState(false);
	const [value, setValue] = useState('');
	const checks = requirements.map((requirement, index) => (
		<PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)} />
	));

	const strength = getStrength(value);
	const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

	return (
		<Popover
			className='auth-input'
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
					icon={<CgPassword />}
					variant='filled'
					placeholder={LANGUAGE.register_modal_password[selectedLanguage]}
					description={LANGUAGE.register_modal_password_description[selectedLanguage]}
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
