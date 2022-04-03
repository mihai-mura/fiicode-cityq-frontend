import { Group } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons';
import { Dropzone } from '@mantine/dropzone';
import { useState } from 'react';

function getIconColor(status) {
	return status.accepted ? '#3378F7' : status.rejected ? 'red' : 'gray';
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

export const dropzoneChildren = (status, file = null) => {
	//! portrait image too big
	return (
		<Group position='center' spacing='xl' style={{ minHeight: 150, pointerEvents: 'none' }}>
			{file ? (
				<img style={{ width: 350 }} src={file} alt='id preview' />
			) : (
				<>
					<ImageUploadIcon status={status} style={{ color: getIconColor(status) }} size={80} />

					<div>
						<p>Drag image here or click to select files</p>
					</div>
				</>
			)}
		</Group>
	);
};

const FileDropzone = (props) => {
	const [file, setFile] = useState(null);

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
			{(status) => dropzoneChildren(status, file)}
		</Dropzone>
	);
};

export default FileDropzone;
