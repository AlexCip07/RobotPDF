<script>
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';

	export let form;

	let firstName = '';
	let lastName = '';
	let username = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let showPassword = false;
	let showConfirmPassword = false;
	let isLoading = false;
	let acceptTerms = false;

	function validateForm() {
		if (password !== confirmPassword) {
			alert('Passwords do not match!');
			return false;
		}
		
		if (!acceptTerms) {
			alert('Please accept the terms and conditions');
			return false;
		}

		return true;
	}

	function handleEnhance() {
		return async ({ update }) => {
			isLoading = true;
			await update();
			isLoading = false;

			if (form?.success) {
				goto('/login');
			}
		};
	}

	function goToLogin() {
		goto('/login');
	}

	function togglePassword() {
		showPassword = !showPassword;
	}

	function toggleConfirmPassword() {
		showConfirmPassword = !showConfirmPassword;
	}
</script>

<div class="auth-container">
	<div class="auth-header">
		<h1 class="auth-title">Create Account</h1>
		<p class="auth-subtitle">Join us and start your journey today</p>
	</div>

	{#if form?.error}
		<div class="error-message" role="alert">
			{form.error}
		</div>
	{/if}

	<form method="POST" use:enhance={handleEnhance} on:submit|preventDefault={() => validateForm()}>
		<div class="form-row">
			<div class="form-group">
				<label for="firstName" class="form-label">First Name</label>
				<input
					id="firstName"
					name="firstName"
					type="text"
					class="form-input"
					placeholder="Enter your first name"
					bind:value={firstName}
					required
				/>
			</div>

			<div class="form-group">
				<label for="lastName" class="form-label">Last Name</label>
				<input
					id="lastName"
					name="lastName"
					type="text"
					class="form-input"
					placeholder="Enter your last name"
					bind:value={lastName}
					required
				/>
			</div>
		</div>

		<div class="form-group">
			<label for="username" class="form-label">Username</label>
			<input
				id="username"
				name="username"
				type="text"
				class="form-input"
				placeholder="Choose a unique username"
				bind:value={username}
				required
			/>
		</div>

		<div class="form-group">
			<label for="email" class="form-label">Email Address</label>
			<input
				id="email"
				name="email"
				type="email"
				class="form-input"
				placeholder="Enter your email"
				bind:value={email}
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
					placeholder="Create a strong password"
					bind:value={password}
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
			<div class="password-strength">
				<div class="strength-bar">
					<div class="strength-fill" class:weak={password.length > 0 && password.length < 6} class:medium={password.length >= 6 && password.length < 10} class:strong={password.length >= 10}></div>
				</div>
				<span class="strength-text">
					{#if password.length === 0}
						Enter a password
					{:else if password.length < 6}
						Weak
					{:else if password.length < 10}
						Medium
					{:else}
						Strong
					{/if}
				</span>
			</div>
		</div>

		<div class="form-group">
			<label for="confirmPassword" class="form-label">Confirm Password</label>
			<div class="password-input-container">
				<input
					id="confirmPassword"
					type={showConfirmPassword ? 'text' : 'password'}
					class="form-input"
					placeholder="Confirm your password"
					bind:value={confirmPassword}
					required
				/>
				<button
					type="button"
					class="password-toggle"
					on:click={toggleConfirmPassword}
				>
					{showConfirmPassword ? '👁️' : '👁️‍🗨️'}
				</button>
			</div>
			{#if confirmPassword && password !== confirmPassword}
				<div class="error-message">Passwords do not match</div>
			{/if}
		</div>

		<div class="form-group">
			<label class="checkbox-container">
				<input type="checkbox" bind:checked={acceptTerms} />
				<span class="checkmark"></span>
				        I agree to the <a href="/terms" class="auth-link">Terms of Service</a> and <a href="/privacy" class="auth-link">Privacy Policy</a>
			</label>
		</div>

		<button type="submit" class="auth-button" disabled={isLoading}>
			{isLoading ? 'Creating Account...' : 'Create Account'}
		</button>
	</form>

	<div class="button-row">
		<button type="button" class="secondary-button" on:click={goToLogin}>
			← Back to Login
		</button>
	</div>

	<div class="auth-footer">
		<p>
			Already have an account?
			<a href="/login" class="auth-link" on:click|preventDefault={goToLogin}>
				Sign in here
			</a>
		</p>
	</div>
</div>

<style>
	.error-message {
		background-color: #1a1a1a;
		border: 1px solid #333;
		color: #fff;
		padding: 0.75rem;
		border-radius: 0.375rem;
		margin-bottom: 1rem;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 15px;
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
		color: #333;
	}

	.password-strength {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 8px;
	}

	.strength-bar {
		flex: 1;
		height: 4px;
		background: #e1e1e1;
		border-radius: 2px;
		overflow: hidden;
	}

	.strength-fill {
		height: 100%;
		width: 0;
		transition: all 0.3s ease;
	}

	.strength-fill.weak {
		width: 33%;
		background: #333;
	}

	.strength-fill.medium {
		width: 66%;
		background: #666;
	}

	.strength-fill.strong {
		width: 100%;
		background: #000;
	}

	.strength-text {
		font-size: 12px;
		color: #333;
		min-width: 60px;
	}

	.checkbox-container {
		display: flex;
		align-items: flex-start;
		cursor: pointer;
		font-size: 14px;
		color: #000;
		user-select: none;
		line-height: 1.4;
	}

	.checkbox-container input[type="checkbox"] {
		display: none;
	}

	.checkmark {
		width: 18px;
		height: 18px;
		border: 2px solid #333;
		border-radius: 4px;
		margin-right: 10px;
		position: relative;
		transition: all 0.3s ease;
		flex-shrink: 0;
		margin-top: 1px;
	}

	.checkbox-container input[type="checkbox"]:checked + .checkmark {
		background: #000;
		border-color: #000;
	}

	.checkbox-container input[type="checkbox"]:checked + .checkmark::after {
		content: '✓';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: white;
		font-size: 12px;
		font-weight: bold;
	}

	.social-buttons {
		margin-bottom: 20px;
	}

	.auth-button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
		transform: none;
	}

	.auth-button:disabled:hover {
		transform: none;
		box-shadow: none;
	}

	.button-row {
		margin-top: 20px;
		text-align: center;
	}

	.secondary-button {
		background: transparent;
		color: #000;
		border: 2px solid #000;
		padding: 12px 24px;
		border-radius: 10px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
		text-decoration: none;
		display: inline-block;
	}

	.secondary-button:hover {
		background: #000;
		color: white;
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
	}

	:global(.auth-container) {
		background-color: #fff;
		border: 1px solid #e1e1e1;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		max-width: 500px;
		margin: 2rem auto;
	}

	:global(.auth-header) {
		text-align: center;
		margin-bottom: 2rem;
	}

	:global(.auth-title) {
		color: #000;
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	:global(.auth-subtitle) {
		color: #666;
		font-size: 1rem;
	}

	:global(.form-group) {
		margin-bottom: 1.5rem;
	}

	:global(.form-label) {
		display: block;
		margin-bottom: 0.5rem;
		color: #000;
		font-weight: 500;
	}

	:global(.form-input) {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #e1e1e1;
		border-radius: 8px;
		font-size: 1rem;
		transition: all 0.3s ease;
		background-color: #fff;
		color: #000;
	}

	:global(.form-input:focus) {
		outline: none;
		border-color: #000;
		box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
	}

	:global(.auth-button) {
		width: 100%;
		padding: 12px;
		background-color: #000;
		color: white;
		border: none;
		border-radius: 10px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	:global(.auth-button:hover) {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
	}

	:global(.auth-footer) {
		text-align: center;
		margin-top: 1.5rem;
		color: #666;
	}

	:global(.auth-link) {
		color: #000;
		text-decoration: none;
		font-weight: 500;
		transition: all 0.3s ease;
	}

	:global(.auth-link:hover) {
		text-decoration: underline;
	}

	@media (max-width: 480px) {
		.form-row {
			grid-template-columns: 1fr;
		}
	}
</style> 