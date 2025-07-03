<script>
	import { goto } from '$app/navigation';

	function navigateToAddInputs() {
		goto('/addInputs');
	}

	function navigateToCheckInputs() {
		goto('/checkInputs');
	}
</script>

<div class="container">
	<h1>Welcome</h1>
	<div class="button-group">
		<button on:click={navigateToAddInputs}>
			Add Inputs
		</button>
		<button on:click={navigateToCheckInputs}>
			Check Inputs
		</button>
	</div>
</div>

<style>
	.container {
		text-align: center;
		padding: 2rem;
	}

	h1 {
		color: #333;
		margin-bottom: 2rem;
		font-size: 2rem;
		font-weight: normal;
	}

	.button-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 300px;
		margin: 0 auto;
	}

	button {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		background: white;
		color: #333;
		border: 1px solid #ccc;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	button:hover {
		background: #f5f5f5;
	}
</style> 