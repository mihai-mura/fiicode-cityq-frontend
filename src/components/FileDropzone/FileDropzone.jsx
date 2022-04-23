import './FileDropzone.scss';
import { Group, LoadingOverlay } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons';
import { Dropzone } from '@mantine/dropzone';
import { useEffect, useState } from 'react';
import LANGUAGE from '../../utils/languages.json';
import { useSelector } from 'react-redux';
import { showNotification } from '@mantine/notifications';
import { errorNotification } from '../Notifications/Notifications';

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

const dropzoneChildrenRegister = (status, files = null, noFileError, loadingOverlay, selectedLanguage, modal) => {
	//!  image preview size
	return (
		<>
			<LoadingOverlay visible={loadingOverlay} />
			<Group
				position={files === null || files.length === 1 ? 'center' : 'left'}
				spacing='xl'
				style={{
					minHeight: 150,
					pointerEvents: 'none',
				}}>
				{files ? (
					modal === 'register' ? (
						<img style={{ width: 350 }} src={files[0]} alt='id preview' />
					) : (
						<div className='dropzone-images-container'>
							{files.map((file, index) =>
								file.includes('data:video') ? (
									<video className='dropzone-file-preview' key={index} src={file} alt='id preview' />
								) : (
									<img className='dropzone-file-preview' key={index} src={file} alt='id preview' />
								)
							)}
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
												: LANGUAGE.create_post_modal_files_error[selectedLanguage]
									  }`
									: `${LANGUAGE.create_post_modal_add_pic_drag_image_here[selectedLanguage]}`}
							</p>
						</div>
					</>
				)}
			</Group>
		</>
	);
};

const FileDropzone = (props) => {
	const [files, setFiles] = useState(null);
	const [loadingOverlay, setLoadingOverlay] = useState(false);
	const selectedLanguage = useSelector((state) => state.language);

	//stop overlay
	useEffect(() => {
		if (files !== null) {
			setLoadingOverlay(false);
		}
	}, [files]);

	//delete files button
	useEffect(() => {
		if (props.files?.length === 0) {
			setFiles(null);
		}
	}, [props.files]);

	//for register modal
	const fileAdded = (files) => {
		props.setInputFile(files[0]);
		const reader = new FileReader();
		reader.addEventListener(
			'load',
			() => {
				setFiles([reader.result]);
			},
			false
		);
		reader.readAsDataURL(files[0]);
	};
	//for createPost modal
	const filesAdded = async (files) => {
		props.setInputFile((prev) => [...prev, ...files]);

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
			style={{
				borderColor: props.noFileError || props.tooManyFilesError ? 'red' : '#ced4da',
				borderRadius: '10px',
			}}
			multiple={props.modal === 'register' ? false : true}
			onDrop={(files) => {
				setLoadingOverlay(true);
				props.modal === 'register' ? fileAdded(files) : filesAdded(files);
			}}
			onReject={(files) => {
				console.log('rejected files', files);
				showNotification(errorNotification(LANGUAGE.notification_create_post_file_too_large[selectedLanguage]));
			}}
			maxSize={10000000}
			accept={
				props.modal === 'register'
					? ['image/png', 'image/jpeg', 'image/sgv+xml']
					: ['image/png', 'image/jpeg', 'image/sgv+xml', 'video/mp4']
			}>
			{(status) =>
				dropzoneChildrenRegister(status, files, props.noFileError, loadingOverlay, selectedLanguage, props.modal)
			}
		</Dropzone>
	);
};

export default FileDropzone;
