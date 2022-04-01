import { Group, Text } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons';
import { Dropzone } from '@mantine/dropzone';

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

export const dropzoneChildren = (status) => (
	<Group position='center' spacing='xl' style={{ minHeight: 150, pointerEvents: 'none' }}>
		<ImageUploadIcon status={status} style={{ color: getIconColor(status) }} size={80} />

		<div>
			<Text size='xl' inline>
				Drag images here or click to select files
			</Text>
			<Text size='sm' color='dimmed' inline mt={7}>
				Attach as many files as you like, each file should not exceed 5mb
			</Text>
		</div>
	</Group>
);

const FileDropzone = () => {
	return (
		<Dropzone
			multiple={false}
			onDrop={(files) => console.log('accepted files', files)}
			onReject={(files) => console.log('rejected files', files)}
			maxSize={3 * 1024 ** 2}
			accept={['image/png', 'image/jpeg', 'image/sgv+xml']}>
			{(status) => dropzoneChildren(status)}
		</Dropzone>
	);
};

export default FileDropzone;
