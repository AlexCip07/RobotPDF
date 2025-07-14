<script>
    /** @type {import('./$types').PageData} */
    export let data;
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
</script>

<div class="welcome-container">
    {#if data.admin}
        <h1>Welcome MR. {data.firstName}, remember, you are an admin!</h1>
        <button class="check-inputs-button" on:click={() => goto('/checkInputs')}>Check Inputs</button>
        <button class="check-inputs-button" on:click={() => goto('/progress')}>Progress Sheet</button>
    {:else}
        <h1>Hello, {data.firstName}!</h1>
    {/if}
    <p>Welcome to your dashboard</p>
    <form
        method="POST"
        action="?/logoff"
        use:enhance={() => {
            return async ({ result }) => {
                if (result.type === 'success') {
                    await goto('/');
                }
            };
        }}
    >
        <button class="logoff-button" type="submit">Log Off</button>
    </form>
</div>

<style>
    .welcome-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 50vh;
        text-align: center;
    }

    h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: #2d3748;
    }

    p {
        font-size: 1.2rem;
        color: #4a5568;
        margin-bottom: 2rem;
    }

    .check-inputs-button {
        padding: 0.75rem 1.5rem;
        background-color: #4299e1;
        color: white;
        border: none;
        border-radius: 0.375rem;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.2s;
        margin-bottom: 1rem;
    }

    .check-inputs-button:hover {
        background-color: #3182ce;
    }

    .logoff-button {
        padding: 0.75rem 1.5rem;
        background-color: #e53e3e;
        color: white;
        border: none;
        border-radius: 0.375rem;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .logoff-button:hover {
        background-color: #c53030;
    }
</style> 