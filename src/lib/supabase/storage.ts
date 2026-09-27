import { supabase } from './client';

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const BUCKET = 'article-images';

export async function uploadArticleImage(file: File): Promise<string> {
	const {
		data: { user }
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error('Anda harus login untuk mengunggah gambar.');
	}

	if (!file.type.startsWith('image/')) {
		throw new Error('File harus berupa gambar.');
	}

	if (file.size > MAX_SIZE_BYTES) {
		throw new Error('Ukuran gambar maksimal 5MB.');
	}

	const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-');
	const path = `${user.id}/${Date.now()}-${safeName}`;

	const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
		contentType: file.type,
		upsert: false
	});

	if (error) throw new Error(error.message);

	const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
	return data.publicUrl;
}
