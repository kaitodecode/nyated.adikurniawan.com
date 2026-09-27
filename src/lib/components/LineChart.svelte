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

	function build() {
		if (!canvas) return;
		chart?.destroy();

		const config: ChartConfiguration<'line'> = {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						label,
						data: values,
						borderColor: '#2563eb',
						backgroundColor: 'rgba(37, 99, 235, 0.1)',
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
					y: { beginAtZero: true, ticks: { precision: 0 } }
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
