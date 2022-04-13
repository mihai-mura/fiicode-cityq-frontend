import './FileDropzone.scss';
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

const dropzoneChildrenRegister = (status, files = null, noFileError, selectedLanguage, modal) => {
	//! portrait image too big
	return (
		<Group
			position={files === null || files.length === 1 ? 'center' : 'left'}
			spacing='xl'
			style={{
				minHeight: 150,
				pointerEvents: 'none',
				borderRadius: '5px',
			}}>
			{files ? (
				files.length === 1 ? (
					<img style={{ width: 350 }} src={files[0]} alt='id preview' />
				) : (
					<div className='dropzone-images-container'>
						{files.map((file, index) => (
							<img key={index} style={{ maxWidth: 100 }} src={file} alt='id preview' />
						))}
					</div>
				)
			) : (
				<>
					<ImageUploadIcon
						status={status}
						style={{ color: noFileError && files === null ? '#ed404e' : getIconColor(status) }}
						size={80}
					/>

					<div>
						<p style={{ textAlign: 'center', color: noFileError && files === null ? '#ed404e' : '#000' }}>
							{noFileError
								? `${
										modal === 'register'
											? LANGUAGE.register_modal_id_pic_error[selectedLanguage]
											: LANGUAGE.create_post_modal_pic_error[selectedLanguage]
								  }`
								: `${LANGUAGE.create_post_modal_add_pic_drag_image_here[selectedLanguage]}`}
						</p>
					</div>
				</>
			)}
		</Group>
	);
};

const FileDropzone = (props) => {
	const [files, setFiles] = useState(null);
	const selectedLanguage = useSelector((state) => state.language);

	//for register modal
	const fileAdded = (files) => {
		props.setInputFile(files[0]);
		const reader = new FileReader();
		reader.addEventListener(
			'load',
			() => {
				setFiles((prev) => {
					if (prev === null) {
						return [reader.result];
					}
					return [...prev, reader.result];
				});
			},
			false
		);
		reader.readAsDataURL(files[0]);
	};
	//for createPost modal
	//! accept videos
	const filesAdded = async (files) => {
		props.setInputFile(files);

		const fileToDataURL = (file) => {
			var reader = new FileReader();
			return new Promise(function (resolve, reject) {
				reader.onload = (event) => {
					resolve(event.target.result);
				};
				reader.readAsDataURL(file);
			});
		};

		const readAsDataURL = (urlFiles) => {
			var filesArray = Array.prototype.slice.call(urlFiles);
			return Promise.all(filesArray.map(fileToDataURL));
		};
		const filesAsUrl = await readAsDataURL(files);
		setFiles((prev) => {
			if (prev === null) {
				return filesAsUrl;
			}
			return [...prev, ...filesAsUrl];
		});
	};
	return (
		<Dropzone
			multiple={props.modal === 'register' ? false : true}
			onDrop={(files) => {
				props.modal === 'register' ? fileAdded(files) : filesAdded(files);
			}}
			onReject={(files) => console.log('rejected files', files)}
			maxSize={3 * 1024 ** 2}
			accept={
				props.modal === 'register'
					? ['image/png', 'image/jpeg', 'image/sgv+xml']
					: ['image/png', 'image/jpeg', 'image/sgv+xml', 'video/mp4']
			}>
			{(status) => dropzoneChildrenRegister(status, files, props.noFileError, selectedLanguage, props.modal)}
		</Dropzone>
	);
};

export default FileDropzone;
