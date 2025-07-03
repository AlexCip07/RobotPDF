<script>
	import { enhance } from '$app/forms';

	export let form;
	let isLoading = false;
	let showPassword = false;

	function togglePassword() {
		showPassword = !showPassword;
	}
</script>

<div class="auth-container">
	<div class="auth-header">
		<h1 class="auth-title">Welcome Back</h1>
		<p class="auth-subtitle">Sign in to your account to continue</p>
	</div>

	<form method="POST" use:enhance={() => {
		isLoading = true;
		return async ({ result, update }) => {
			isLoading = false;
			
			if (result.type === 'redirect') {
				// Handle redirect for regular users
				window.location.href = result.location;
				return;
			}
			
			// For admin users or other cases
			await update();
			if (result.type === 'success') {
				window.location.reload();
			}
		};
	}}>
		<div class="form-group">
			<label for="email" class="form-label">Email Address</label>
			<input
				id="email"
				name="email"
				type="email"
				class="form-input"
				placeholder="Enter your email"
				value={form?.email ?? ''}
				required
			/>
		</div>

		<div class="form-group">
			<label for="password" class="form-label">Password</label>
			<div class="password-input-container">
				<input
					id="password"
					name="password"
					type={showPassword ? 'text' : 'password'}
					class="form-input"
					placeholder="Enter your password"
					required
				/>
				<button
					type="button"
					class="password-toggle"
					on:click={togglePassword}
				>
					{showPassword ? '👁️' : '👁️‍🗨️'}
				</button>
			</div>
		</div>

		{#if form?.error}
			<div class="error-message">
				{form.error}
			</div>
		{/if}

		<button type="submit" class="auth-button" disabled={isLoading}>
			{isLoading ? 'Signing in...' : 'Sign In'}
		</button>
	</form>

	<div class="auth-footer">
		<p>
			Don't have an account?
			<a href="/signup" class="auth-link">Sign up here</a>
		</p>
	</div>
</div>

<style>
	* {
		box-sizing: border-box;
	}

	.auth-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		font-family: Arial, sans-serif;
		background: white;
		color: black;
	}

	.auth-header {
		margin-bottom: 30px;
	}

	.auth-title {
		font-size: 24px;
		margin-bottom: 10px;
		color: black;
		font-weight: normal;
	}

	.auth-subtitle {
		font-size: 16px;
		margin-bottom: 20px;
		color: black;
	}

	.form-group {
		margin-bottom: 20px;
	}

	.form-label {
		display: block;
		margin-bottom: 8px;
		color: black;
		font-size: 16px;
	}

	.form-input {
		width: 100%;
		padding: 8px;
		border: 1px solid black;
		font-family: Arial, sans-serif;
		font-size: 16px;
	}

	.password-input-container {
		position: relative;
	}

	.password-toggle {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		cursor: pointer;
		font-size: 16px;
		padding: 0;
		color: black;
	}

	.auth-button {
		width: 100%;
		padding: 10px;
		background: white;
		border: 1px solid black;
		color: black;
		font-size: 16px;
		cursor: pointer;
		margin-bottom: 20px;
	}

	.auth-button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.auth-footer {
		text-align: center;
		font-size: 14px;
		color: black;
	}

	.auth-link {
		color: black;
		text-decoration: underline;
	}

	.error-message {
		color: red;
		margin-bottom: 20px;
		text-align: center;
	}

	p {
		margin: 10px 0;
	}
</style> 