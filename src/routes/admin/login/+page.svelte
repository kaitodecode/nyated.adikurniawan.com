<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { auth } from '$lib/firebase/client';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			const credential = await signInWithEmailAndPassword(auth, email, password);
			const idToken = await credential.user.getIdToken();

			const res = await fetch('/api/auth/session', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ idToken })
			});

			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error ?? 'Gagal masuk');
			}

			const next = page.url.searchParams.get('next') ?? '/admin/dashboard';
			await goto(next, { invalidateAll: true });
		} catch (err) {
			error = err instanceof Error ? err.message : 'Email atau password salah.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Login — nyated.</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-paper px-4">
	<form
		onsubmit={handleSubmit}
		class="w-full max-w-sm rounded-xl border border-ink-900/10 bg-white p-8 shadow-sm"
	>
		<h1 class="mb-1 text-xl font-semibold text-ink-950">Admin Login</h1>
		<p class="mb-6 text-sm text-ink-500">Masuk untuk mengelola artikel.</p>

		{#if error}
			<p class="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
		{/if}

		<label class="mb-3 block text-sm">
			<span class="mb-1 block text-ink-700">Email</span>
			<input
				type="email"
				bind:value={email}
				required
				class="w-full rounded-md border border-ink-900/15 px-3 py-2 outline-none focus:border-accent"
			/>
		</label>

		<label class="mb-6 block text-sm">
			<span class="mb-1 block text-ink-700">Password</span>
			<input
				type="password"
				bind:value={password}
				required
				class="w-full rounded-md border border-ink-900/15 px-3 py-2 outline-none focus:border-accent"
			/>
		</label>

		<button
			type="submit"
			disabled={loading}
			class="w-full rounded-md bg-ink-950 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
		>
			{loading ? 'Memproses…' : 'Masuk'}
		</button>
	</form>
</div>
