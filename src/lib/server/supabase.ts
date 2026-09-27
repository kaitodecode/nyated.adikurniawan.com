import { createServerClient } from '@supabase/ssr';
import type { RequestEvent } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import type { Database } from '$lib/supabase/types';

export function createSupabaseServerClient(event: RequestEvent) {
	return createServerClient<Database>(
		env.PUBLIC_SUPABASE_URL ?? '',
		env.PUBLIC_SUPABASE_ANON_KEY ?? '',
		{
			cookies: {
				getAll: () => event.cookies.getAll(),
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, { ...options, path: options?.path ?? '/' });
					});
				}
			}
		}
	);
}
