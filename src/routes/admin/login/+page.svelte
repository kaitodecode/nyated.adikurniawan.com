<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { supabase } from '$lib/supabase/client';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
			if (signInError) throw new Error(signInError.message);

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

<div class="flex min-h-screen items-center justify-center bg-paper px-4 dark:bg-ink-950">
	<form
		onsubmit={handleSubmit}
		class="w-full max-w-sm rounded-xl border border-ink-900/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-ink-900"
	>
		<h1 class="mb-1 text-xl font-semibold text-ink-950 dark:text-white">Admin Login</h1>
		<p class="mb-6 text-sm text-ink-500 dark:text-white/50">Masuk untuk mengelola artikel.</p>

		{#if error}
			<Alert tone="error" class="mb-4">{error}</Alert>
		{/if}

		<div class="mb-3">
			<Input type="email" label="Email" bind:value={email} required />
		</div>

		<div class="mb-6">
			<Input type="password" label="Password" bind:value={password} required />
		</div>

		<Button type="submit" disabled={loading} class="w-full">
			{loading ? 'Memproses…' : 'Masuk'}
		</Button>
	</form>
</div>
