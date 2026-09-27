<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';

	interface Props {
		labels: string[];
		values: number[];
		label?: string;
	}

	let { labels, values, label = 'Views' }: Props = $props();

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	function readColor(varName: string, fallback: string): string {
		if (typeof window === 'undefined') return fallback;
		const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
		return value || fallback;
	}

	function isDark(): boolean {
		return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
	}

	function hexToRgba(hex: string, alpha: number): string {
		const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		if (!match) return hex;
		const [r, g, b] = match.slice(1).map((c) => parseInt(c, 16));
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	function build() {
		if (!canvas) return;
		chart?.destroy();

		const accent = readColor('--color-accent', '#4338ca');
		const gridColor = isDark() ? 'rgba(255,255,255,0.08)' : 'rgba(15,17,21,0.06)';
		const tickColor = isDark() ? 'rgba(255,255,255,0.5)' : 'rgba(56,60,70,0.7)';

		const config: ChartConfiguration<'line'> = {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						label,
						data: values,
						borderColor: accent,
						backgroundColor: hexToRgba(accent, 0.12),
						tension: 0.3,
						fill: true,
						pointRadius: 2
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: { legend: { display: false } },
				scales: {
					x: { grid: { color: gridColor }, ticks: { color: tickColor } },
					y: { beginAtZero: true, ticks: { precision: 0, color: tickColor }, grid: { color: gridColor } }
				}
			}
		};

		chart = new Chart(canvas, config);
	}

	onMount(build);
	$effect(() => {
		labels;
		values;
		build();
	});

	onDestroy(() => chart?.destroy());
</script>

<div class="h-64 w-full">
	<canvas bind:this={canvas}></canvas>
</div>
