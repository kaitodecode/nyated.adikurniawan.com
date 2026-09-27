<script lang="ts">
	import '../../app.css';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase/client';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();

	const links = [
		{ href: '/admin/dashboard', label: 'Dashboard' },
		{ href: '/admin/articles', label: 'Artikel' }
	];

	async function handleLogout() {
		await signOut(auth);
		await fetch('/api/auth/session', { method: 'DELETE' });
		await goto('/admin/login', { invalidateAll: true });
	}

	let isLoginPage = $derived(page.url.pathname === '/admin/login');
</script>

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="flex min-h-screen bg-paper">
		<aside class="w-56 shrink-0 border-r border-ink-900/10 bg-white">
			<div class="border-b border-ink-900/10 px-5 py-4">
				<span class="font-semibold text-ink-950">nyated. admin</span>
			</div>
			<nav class="flex flex-col gap-1 p-3">
				{#each links as link (link.href)}
					<a
						href={link.href}
						class="rounded-md px-3 py-2 text-sm hover:bg-ink-900/5 {page.url.pathname.startsWith(
							link.href
						)
							? 'bg-ink-900/5 font-medium text-ink-950'
							: 'text-ink-700'}"
					>
						{link.label}
					</a>
				{/each}
			</nav>
			<div class="mt-auto border-t border-ink-900/10 p-3">
				<p class="truncate px-3 py-1 text-xs text-ink-500">{data.user?.email}</p>
				<button
					onclick={handleLogout}
					class="w-full rounded-md px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-900/5"
				>
					Keluar
				</button>
			</div>
		</aside>
		<main class="flex-1 overflow-y-auto p-8">
			{@render children()}
		</main>
	</div>
{/if}
