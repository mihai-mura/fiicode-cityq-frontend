import LANGUAGE from '../../utils/languages.json';
import { useSelector } from 'react-redux';
import './UserSettings.scss';
import { PasswordInput, TextInput } from '@mantine/core';
const Settings = () => {
	const selectedLanguage = useSelector((state) => state.language);
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
					<div className='settings-main-top'>
						<TextInput
							className='settings-text-input'
							radius='md'
							label={LANGUAGE.register_modal_first_name[selectedLanguage]}
							placeholder={LANGUAGE.register_modal_first_name[selectedLanguage]}
						/>
						<TextInput
							className='settings-text-input'
							radius='md'
							label={LANGUAGE.register_modal_last_name[selectedLanguage]}
							placeholder={LANGUAGE.register_modal_last_name[selectedLanguage]}
						/>
					</div>
					<div className='settings-main-down'>
						<PasswordInput
							className='settings-text-input'
							radius='md'
							label={LANGUAGE.settings_password_input[selectedLanguage]}
							placeholder={LANGUAGE.settings_password_input[selectedLanguage]}
						/>
						<TextInput
							className='settings-text-input'
							radius='md'
							label={LANGUAGE.settings_address_input[selectedLanguage]}
							placeholder={LANGUAGE.settings_address_input[selectedLanguage]}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Settings;
