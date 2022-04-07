const getFirebaseFileURL = (folder, file) => {
	return `https://firebasestorage.googleapis.com/v0/b/fiicode-30e25.appspot.com/o/${folder}%2F${file}?alt=media&token=4dc1980b-477f-4a58-9b47-339c4353213e`;
};

export default getFirebaseFileURL;
