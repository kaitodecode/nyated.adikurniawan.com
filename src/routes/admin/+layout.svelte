<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase/client';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import Newspaper from '@lucide/svelte/icons/newspaper';
	import LogOut from '@lucide/svelte/icons/log-out';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();

	const links = [
		{ href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/admin/articles', label: 'Artikel', icon: Newspaper }
	];

	async function handleLogout() {
		await supabase.auth.signOut();
		await goto('/admin/login', { invalidateAll: true });
	}

	let isLoginPage = $derived(page.url.pathname === '/admin/login');
</script>

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="flex min-h-screen bg-paper dark:bg-ink-950">
		<aside
			class="flex w-60 shrink-0 flex-col border-r border-ink-900/10 bg-white dark:border-white/10 dark:bg-ink-900"
		>
			<div class="flex items-center gap-2 border-b border-ink-900/10 px-5 py-4 dark:border-white/10">
				<span
					class="inline-flex size-7 items-center justify-center rounded-lg bg-ink-950 text-sm font-semibold text-white dark:bg-white dark:text-ink-950"
				>
					n
				</span>
				<span class="font-semibold tracking-tight text-ink-950 dark:text-white">nyated. admin</span>
			</div>
			<nav class="flex flex-col gap-1 p-3">
				{#each links as link (link.href)}
					<a
						href={link.href}
						class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors {page.url.pathname.startsWith(
							link.href
						)
							? 'bg-accent-muted font-medium text-accent'
							: 'text-ink-600 hover:bg-ink-900/5 dark:text-ink-200 dark:hover:bg-white/10'}"
					>
						<link.icon class="size-4" />
						{link.label}
					</a>
				{/each}
			</nav>
			<div class="mt-auto flex items-center justify-between gap-2 border-t border-ink-900/10 p-3 dark:border-white/10">
				<div class="min-w-0">
					<p class="truncate px-1 text-xs text-ink-500 dark:text-ink-400">{data.user?.email}</p>
					<button
						onclick={handleLogout}
						class="mt-1 flex w-full items-center gap-2 rounded-lg px-1 py-1 text-left text-sm text-ink-600 hover:text-ink-900 dark:text-ink-200 dark:hover:text-white"
					>
						<LogOut class="size-3.5" />
						Keluar
					</button>
				</div>
				<ThemeToggle />
			</div>
		</aside>
		<main class="flex-1 overflow-y-auto p-8">
			{@render children()}
		</main>
	</div>
{/if}
