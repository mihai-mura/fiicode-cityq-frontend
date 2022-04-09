import { Group } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons';
import { Dropzone } from '@mantine/dropzone';
import { useState } from 'react';
import LANGUAGE from '../../utils/languages.json';
import { useSelector } from 'react-redux';

function getIconColor(status) {
	return status.accepted ? '#3378F7' : status.rejected ? '#ed404e' : 'gray';
}

function ImageUploadIcon({ status, ...props }) {
	if (status.accepted) {
		return <IconUpload {...props} />;
	}

	if (status.rejected) {
		return <IconX {...props} />;
	}

	return <IconPhoto {...props} />;
}

export const dropzoneChildren = (status, file = null, noFileError, selectedLanguage) => {
	//! portrait image too big
	return (
		<Group
			position='center'
			spacing='xl'
			style={{
				minHeight: 150,
				pointerEvents: 'none',
				borderRadius: '5px',
			}}>
			{file ? (
				<img style={{ width: 350 }} src={file} alt='id preview' />
			) : (
				<>
					<ImageUploadIcon
						status={status}
						style={{ color: noFileError && file === null ? '#ed404e' : getIconColor(status) }}
						size={80}
					/>

					<div>
						<p style={{ color: noFileError && file === null ? '#ed404e' : '#000' }}>
							{noFileError
								? `${LANGUAGE.register_modal_id_pic_error[selectedLanguage]}`
								: `${LANGUAGE.register_modal_add_id_pic_drag_image_here[selectedLanguage]}`}
						</p>
					</div>
				</>
			)}
		</Group>
	);
};

const FileDropzone = (props) => {
	const [file, setFile] = useState(null);
	const selectedLanguage = useSelector((state) => state.language);

	const fileAdded = (files) => {
		props.setInputFile(files[0]);
		const reader = new FileReader();
		reader.addEventListener(
			'load',
			() => {
				setFile(reader.result);
			},
			false
		);
		reader.readAsDataURL(files[0]);
	};
	return (
		<Dropzone
			multiple={false}
			onDrop={(files) => fileAdded(files)}
			onReject={(files) => console.log('rejected files', files)}
			maxSize={3 * 1024 ** 2}
			accept={['image/png', 'image/jpeg', 'image/sgv+xml']}>
			{(status) => dropzoneChildren(status, file, props.noFileError, selectedLanguage)}
		</Dropzone>
	);
};

export default FileDropzone;
