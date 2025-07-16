<script>
    /** @type {import('./$types').PageData} */
    export let data;
    import { goto } from '$app/navigation';
    
    function selectRobot(robotId) {
        goto(`/progress/${robotId}`);
    }
</script>

<div class="robots-container">
    <div class="header">
        <h1>Progress Tracker - Robots</h1>
        <div class="user-info">
            <p>Welcome, {data.user.firstName}!</p>
            {#if data.user.admin}
                <span class="admin-badge">Admin</span>
            {/if}
        </div>
    </div>

    <div class="robots-grid">
        {#if data.robots.length > 0}
            {#each data.robots as robot}
                <div class="robot-card" on:click={() => selectRobot(robot.id)} on:keydown={(e) => e.key === 'Enter' && selectRobot(robot.id)} tabindex="0" role="button">
                
                    <div style="height: 100%;" class="robot-info">
                        <h3 style="text-align: center;">{robot.name || `Robot ${robot.id}`}</h3>
                        <p class="robot-id">ID: {robot.id}</p>
                    </div>
                </div>
            {/each}
        {:else}
            <div class="no-robots">
                <p>No robots found in the database.</p>
            </div>
        {/if}
    </div>
</div>

<style>
    .robots-container {
        min-height: 100vh;
        background: white;
        padding: 20px;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 40px;
        background: white;
        padding: 20px;
        border: 2px solid black;
    }

    .header h1 {
        color: black;
        margin: 0;
        font-size: 2.5rem;
        font-weight: 700;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 15px;
        color: black;
    }

    .user-info p {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 500;
    }

    .admin-badge {
        background: black;
        color: white;
        padding: 6px 12px;
        font-size: 0.8rem;
        font-weight: bold;
        text-transform: uppercase;
    }

    .robots-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 30px;
        max-width: 1400px;
        margin: 0 auto;
    }

    .robot-card {
        background: white;
        border: 2px solid black;
        cursor: pointer;
        transition: transform 0.2s ease;
        aspect-ratio: 1;
    }

    .robot-card:hover {
        transform: scale(1.02);
    }

    .robot-card:focus {
        outline: 3px solid black;
        outline-offset: 2px;
    }

    .robot-image {
        height: 70%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 2px solid black;
    }

    .robot-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .robot-info {
        height: 30%;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        background: white;
    }

    .robot-info h3 {
        margin: 0 0 8px 0;
        font-size: 1.4rem;
        font-weight: 700;
        color: black;
    }

    .robot-id {
        margin: 0;
        color: black;
        font-size: 0.9rem;
        font-weight: 500;
    }

    .no-robots {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px;
        background: white;
        border: 2px solid black;
    }

    .no-robots p {
        color: black;
        font-size: 1.2rem;
        margin: 0;
    }

    @media (max-width: 768px) {
        .robots-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }

        .header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
        }

        .header h1 {
            font-size: 2rem;
        }

        .robot-info h3 {
            font-size: 1.2rem;
        }
    }

    @media (max-width: 480px) {
        .robots-grid {
            grid-template-columns: 1fr;
            gap: 15px;
        }

        .robots-container {
            padding: 15px;
        }
    }
</style> 