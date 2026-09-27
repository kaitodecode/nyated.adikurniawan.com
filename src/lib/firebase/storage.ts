import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from './client';

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function uploadArticleImage(file: File): Promise<string> {
	if (!auth.currentUser) {
		throw new Error('Anda harus login untuk mengunggah gambar.');
	}

	if (!file.type.startsWith('image/')) {
		throw new Error('File harus berupa gambar.');
	}

	if (file.size > MAX_SIZE_BYTES) {
		throw new Error('Ukuran gambar maksimal 5MB.');
	}

	const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-');
	const path = `articles/${auth.currentUser.uid}/${Date.now()}-${safeName}`;
	const storageRef = ref(storage, path);

	await uploadBytes(storageRef, file, { contentType: file.type });
	return getDownloadURL(storageRef);
}
