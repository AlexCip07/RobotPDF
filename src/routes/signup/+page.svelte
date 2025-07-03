<script>
	import { goto } from '$app/navigation';

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

	function handleSignup() {
		if (password !== confirmPassword) {
			alert('Passwords do not match!');
			return;
		}
		
		if (!acceptTerms) {
			alert('Please accept the terms and conditions');
			return;
		}

		isLoading = true;
		// Simulate signup process
		setTimeout(() => {
			isLoading = false;
					// Here you would typically handle actual signup logic
		console.log('Signup attempt:', { firstName, lastName, username, email, password });
		}, 2000);
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

	<form on:submit|preventDefault={handleSignup}>
		<div class="form-row">
			<div class="form-group">
				<label for="firstName" class="form-label">First Name</label>
				<input
					id="firstName"
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
				I agree to the <a href="#" class="auth-link">Terms of Service</a> and <a href="#" class="auth-link">Privacy Policy</a>
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
		color: #666;
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
		background: #e1e5e9;
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
		background: #e74c3c;
	}

	.strength-fill.medium {
		width: 66%;
		background: #f39c12;
	}

	.strength-fill.strong {
		width: 100%;
		background: #27ae60;
	}

	.strength-text {
		font-size: 12px;
		color: #666;
		min-width: 60px;
	}

	.checkbox-container {
		display: flex;
		align-items: flex-start;
		cursor: pointer;
		font-size: 14px;
		color: #333;
		user-select: none;
		line-height: 1.4;
	}

	.checkbox-container input[type="checkbox"] {
		display: none;
	}

	.checkmark {
		width: 18px;
		height: 18px;
		border: 2px solid #e1e5e9;
		border-radius: 4px;
		margin-right: 10px;
		position: relative;
		transition: all 0.3s ease;
		flex-shrink: 0;
		margin-top: 1px;
	}

	.checkbox-container input[type="checkbox"]:checked + .checkmark {
		background: #667eea;
		border-color: #667eea;
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
		color: #667eea;
		border: 2px solid #667eea;
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
		background: #667eea;
		color: white;
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
	}

	@media (max-width: 480px) {
		.form-row {
			grid-template-columns: 1fr;
		}
	}
</style> 