<script>
    /** @type {import('./$types').PageData} */
    export let data;
    /** @type {import('./$types').ActionData} */
    export let form;
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    
    let showAddTaskForm = false;
    let showAddSubtaskForm = false;
    let showEditTaskForm = false;
    let editingTask = null;
    let verificationType = 'A'; // Default to A
    
    let customTaskName = '';
    let taskColor = 'blue';
    let subtaskDescription = '';
    let subtaskTypeOfError = '';
    let subtaskPriority = 1;
    
    // Edit task variables
    let editTaskName = '';
    let editVerificationType = 'A';
    let editTaskColor = 'blue';
    let editTaskStatus = 'pending';
    
    // Edit subtask variables
    let showEditSubtaskForm = false;
    let editingSubtask = null;
    let editSubtaskDescription = '';
    let editSubtaskTypeOfError = '';
    let editSubtaskPriority = 1;
    let editSubtaskStatus = 'pending';
    
    function selectRobot(robotId) {
        goto(`/progress?robotId=${robotId}`);
    }
    
    function selectTask(taskId) {
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('taskId', taskId);
        goto(`/progress?${currentParams.toString()}`);
    }
    
    function toggleAddTaskForm() {
        showAddTaskForm = !showAddTaskForm;
        if (!showAddTaskForm) {
            verificationType = 'A'; // Reset to default
            customTaskName = ''; // Reset custom task name
            taskColor = 'blue'; // Reset to default color
        }
    }
    
    function startEditTask(task) {
        editingTask = task;
        editTaskName = task.name;
        editVerificationType = task.verificationType || 'A';
        editTaskColor = task.color || 'blue';
        editTaskStatus = task.status || 'pending';
        showEditTaskForm = true;
    }
    
    function cancelEditTask() {
        showEditTaskForm = false;
        editingTask = null;
        editTaskName = '';
        editVerificationType = 'A';
        editTaskColor = 'blue';
        editTaskStatus = 'pending';
    }
    
    function toggleAddSubtaskForm() {
        showAddSubtaskForm = !showAddSubtaskForm;
        if (!showAddSubtaskForm) {
            subtaskDescription = '';
            subtaskTypeOfError = '';
            subtaskPriority = 1;
        }
        // Close edit form if it's open
        if (showAddSubtaskForm && showEditSubtaskForm) {
            cancelEditSubtask();
        }
    }
    
    function startEditSubtask(subtask) {
        editingSubtask = subtask;
        editSubtaskDescription = subtask.description;
        editSubtaskTypeOfError = subtask.typeOfError || '';
        editSubtaskPriority = subtask.priority || 1;
        editSubtaskStatus = subtask.status || 'pending';
        showEditSubtaskForm = true;
        // Close add form if it's open
        if (showAddSubtaskForm) {
            showAddSubtaskForm = false;
            subtaskDescription = '';
            subtaskTypeOfError = '';
            subtaskPriority = 1;
        }
    }
    
    function cancelEditSubtask() {
        showEditSubtaskForm = false;
        editingSubtask = null;
        editSubtaskDescription = '';
        editSubtaskTypeOfError = '';
        editSubtaskPriority = 1;
        editSubtaskStatus = 'pending';
    }
    
    function getStatusColor(status) {
        switch (status) {
            case 'completed':
                return '#28a745';
            case 'in_progress':
                return '#ffc107';
            case 'pending':
                return '#6c757d';
            default:
                return '#6c757d';
        }
    }

    function getErrorTypeDisplay(typeCode) {
        switch(typeCode) {
            case 'M':
                return 'M - Mechanical';
            case 'W':
                return 'W - Welding';
            case 'S':
                return 'S - Simulation';
            default:
                return typeCode;
        }
    }

    function getErrorTypeClass(typeCode) {
        switch(typeCode) {
            case 'M':
                return 'error-mechanical';
            case 'W':
                return 'error-welding';
            case 'S':
                return 'error-simulation';
            default:
                return 'error-default';
        }
    }
</script>

<div class="progress-container">
    <div class="header">
        <h1>Progress Tracker</h1>
        <div class="user-info">
            <p>Welcome, {data.user.firstName}!</p>
            {#if data.user.admin}
                <span class="admin-badge">Admin</span>
            {/if}
        </div>
    </div>

    <div class="main-content">
        <!-- Left sidebar with robots -->
        <div class="sidebar">
            <h2>Robots</h2>
            {#if data.robots.length > 0}
                <div class="robots-list">
                    {#each data.robots as robot}
                        <div class="robot-item {data.selectedRobot?.id === robot.id ? 'selected' : ''}">
                            <div class="robot-info">
                                <h3>{robot.name || `Robot ${robot.id}`}</h3>
                                <p class="robot-id">ID: {robot.id}</p>
                            </div>
                            <div class="robot-actions">
                                <button 
                                    class="view-details-btn {data.selectedRobot?.id === robot.id ? 'active' : ''}" 
                                    on:click={() => selectRobot(robot.id)}
                                >
                                    {data.selectedRobot?.id === robot.id ? 'Selected' : 'Select'}
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="no-robots">
                    <p>No robots found in the database.</p>
                </div>
            {/if}
        </div>

        <!-- Main content area -->
        <div class="content">
            {#if data.selectedRobot}
                <div class="robot-details">
                    <div class="robot-header">
                        <h2>{data.selectedRobot.name || `Robot ${data.selectedRobot.id}`} - Tasks</h2>
                        <button class="add-task-btn" on:click={toggleAddTaskForm}>
                            {showAddTaskForm ? 'Cancel' : 'Add Task'}
                        </button>
                    </div>
                    
                    {#if showAddTaskForm}
                        <div class="add-task-form">
                            <form method="POST" action="?/createTask" use:enhance={() => {
                                return async ({ result }) => {
                                    if (result.type === 'success') {
                                        showAddTaskForm = false;
                                        verificationType = 'A'; // Reset to default
                                        customTaskName = ''; // Reset custom task name
                                        taskColor = 'blue'; // Reset to default color
                                        // Refresh the page to show the new task
                                        goto(`/progress?robotId=${data.selectedRobot.id}`, { invalidateAll: true });
                                    }
                                };
                            }}>
                                <input type="hidden" name="robotId" value={data.selectedRobot.id} />
                                <input type="hidden" name="taskName" value={customTaskName} />
                                <input type="hidden" name="color" value={taskColor} />
                                
                                <div class="form-group">
                                    <label for="taskName">Task Title:</label>
                                    <input 
                                        type="text" 
                                        id="taskName" 
                                        bind:value={customTaskName} 
                                        placeholder="Enter task title"
                                        class="task-name-input"
                                        required
                                    />
                                </div>
                                
                                <div class="form-group">
                                    <label for="verification-type">Verification Type:</label>
                                    <div class="verification-type-container">
                                        <div class="verification-option">
                                            <input 
                                                type="radio" 
                                                id="verification-a" 
                                                name="verificationType" 
                                                value="A" 
                                                bind:group={verificationType}
                                            />
                                            <label for="verification-a" class="verification-label">
                                                <div class="verification-box">A</div>
                                                <span>Type A</span>
                                            </label>
                                        </div>
                                        <div class="verification-option">
                                            <input 
                                                type="radio" 
                                                id="verification-m" 
                                                name="verificationType" 
                                                value="M" 
                                                bind:group={verificationType}
                                            />
                                            <label for="verification-m" class="verification-label">
                                                <div class="verification-box">M</div>
                                                <span>Type M</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="task-color">Task Color:</label>
                                    <div class="color-selector">
                                        <label class="color-option">
                                            <input type="radio" name="color" value="green" bind:group={taskColor} />
                                            <span class="color-circle green"></span>
                                            <span class="color-label">Green</span>
                                        </label>
                                        <label class="color-option">
                                            <input type="radio" name="color" value="red" bind:group={taskColor} />
                                            <span class="color-circle red"></span>
                                            <span class="color-label">Red</span>
                                        </label>
                                        <label class="color-option">
                                            <input type="radio" name="color" value="orange" bind:group={taskColor} />
                                            <span class="color-circle orange"></span>
                                            <span class="color-label">Orange</span>
                                        </label>
                                        <label class="color-option">
                                            <input type="radio" name="color" value="yellow" bind:group={taskColor} />
                                            <span class="color-circle yellow"></span>
                                            <span class="color-label">Yellow</span>
                                        </label>
                                        <label class="color-option">
                                            <input type="radio" name="color" value="blue" bind:group={taskColor} />
                                            <span class="color-circle blue"></span>
                                            <span class="color-label">Blue</span>
                                        </label>
                                    </div>
                                </div>
                                
                                <div class="form-actions">
                                    <button type="submit" class="submit-btn">Create Task</button>
                                    <button type="button" class="cancel-btn" on:click={toggleAddTaskForm}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    {/if}
                    
                    {#if showEditTaskForm && editingTask}
                        <div class="edit-task-form">
                            <h3>Edit Task: T{editingTask.id} - {editingTask.name}</h3>
                            <form method="POST" action="?/editTask" use:enhance={() => {
                                return async ({ result }) => {
                                    if (result.type === 'success') {
                                        cancelEditTask();
                                        // Refresh the page to show the updated task
                                        const currentParams = new URLSearchParams(window.location.search);
                                        goto(`/progress?${currentParams.toString()}`, { invalidateAll: true });
                                    }
                                };
                            }}>
                                <input type="hidden" name="taskId" value={editingTask.id} />
                                
                                <div class="form-group">
                                    <label for="edit-task-name">Task Name:</label>
                                    <input 
                                        type="text" 
                                        id="edit-task-name" 
                                        name="taskName"
                                        bind:value={editTaskName}
                                        placeholder="Enter task name"
                                        required
                                    />
                                </div>
                                
                                <div class="form-group">
                                    <label for="edit-verification-type">Verification Type:</label>
                                    <select 
                                        id="edit-verification-type" 
                                        name="verificationType"
                                        bind:value={editVerificationType}
                                    >
                                        <option value="A">A - Auto</option>
                                        <option value="M">M - Manual</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="edit-task-status">Status:</label>
                                    <select 
                                        id="edit-task-status" 
                                        name="status"
                                        bind:value={editTaskStatus}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="edit-task-color">Task Color:</label>
                                    <div class="color-selector">
                                        <label class="color-option">
                                            <input type="radio" name="color" value="green" bind:group={editTaskColor} />
                                            <span class="color-circle green"></span>
                                            <span class="color-label">Green</span>
                                        </label>
                                        <label class="color-option">
                                            <input type="radio" name="color" value="red" bind:group={editTaskColor} />
                                            <span class="color-circle red"></span>
                                            <span class="color-label">Red</span>
                                        </label>
                                        <label class="color-option">
                                            <input type="radio" name="color" value="orange" bind:group={editTaskColor} />
                                            <span class="color-circle orange"></span>
                                            <span class="color-label">Orange</span>
                                        </label>
                                        <label class="color-option">
                                            <input type="radio" name="color" value="yellow" bind:group={editTaskColor} />
                                            <span class="color-circle yellow"></span>
                                            <span class="color-label">Yellow</span>
                                        </label>
                                        <label class="color-option">
                                            <input type="radio" name="color" value="blue" bind:group={editTaskColor} />
                                            <span class="color-circle blue"></span>
                                            <span class="color-label">Blue</span>
                                        </label>
                                    </div>
                                </div>
                                
                                <div class="form-actions">
                                    <button type="submit" class="submit-btn">Update Task</button>
                                    <button type="button" class="cancel-btn" on:click={cancelEditTask}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    {/if}
                    
                    {#if form?.error}
                        <div class="error-message">
                            {form.error}
                        </div>
                    {/if}
                    
                    {#if form?.success}
                        <div class="success-message">
                            {form.message}
                        </div>
                    {/if}
                    
                    <div class="tasks-section">
                        {#if data.robotTasks.length > 0}
                            <div class="tasks-list">
                                {#each data.robotTasks as task}
                                    <div class="task-item {data.selectedTask?.id === task.id ? 'selected' : ''}" 
                                         on:click={() => selectTask(task.id)}>
                                        <div class="task-info">
                                            <h4>
                                                <span class="task-color-indicator {task.color || 'blue'}"></span>
                                                T{task.id} - {task.name}
                                            </h4>
                                            <div class="task-meta">
                                                <span class="task-status" style="color: {getStatusColor(task.status)}">
                                                    {task.status.toUpperCase()}
                                                </span>
                                                <span class="verification-type">
                                                    Type: {task.verificationType || 'A'}
                                                </span>
                                                <span class="task-color-badge {task.color || 'blue'}">
                                                    {(task.color || 'blue').toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="task-actions">
                                            <button class="task-btn view-btn" on:click|stopPropagation={() => selectTask(task.id)}>
                                                {data.selectedTask?.id === task.id ? 'Selected' : 'Select'}
                                            </button>
                                            <button class="task-btn edit-btn" on:click|stopPropagation={() => startEditTask(task)}>Edit</button>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <div class="no-tasks">
                                <p>No tasks found for this robot.</p>
                                <p>Click "Add Task" to create the first task.</p>
                            </div>
                        {/if}
                    </div>
                </div>
            {/if}
        </div>

        <!-- Subtasks panel -->
        <div class="subtasks-panel">
            {#if data.selectedTask}
                <div class="subtask-details">
                    <div class="subtask-header">
                        <h2>{data.selectedTask.name}</h2>
                        <button class="add-subtask-btn" on:click={toggleAddSubtaskForm}>
                            {showAddSubtaskForm ? 'Cancel' : 'Add Subtask'}
                        </button>
                    </div>
                    
                    {#if showAddSubtaskForm}
                        <div class="add-subtask-form">
                            <form method="POST" action="?/createSubtask" use:enhance={() => {
                                return async ({ result }) => {
                                    if (result.type === 'success') {
                                        showAddSubtaskForm = false;
                                        subtaskDescription = '';
                                        subtaskTypeOfError = '';
                                        subtaskPriority = 1;
                                        // Refresh the page to show the new subtask
                                        goto(`/progress?robotId=${data.selectedRobot.id}&taskId=${data.selectedTask.id}`, { invalidateAll: true });
                                    }
                                };
                            }}>
                                <input type="hidden" name="taskId" value={data.selectedTask.id} />
                                
                                <div class="form-group">
                                    <label for="description">Description:</label>
                                    <textarea 
                                        id="description" 
                                        name="description"
                                        bind:value={subtaskDescription} 
                                        placeholder="Enter subtask description"
                                        class="subtask-description-input"
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label for="typeOfError">Type of Error:</label>
                                    <select 
                                        id="typeOfError" 
                                        name="typeOfError"
                                        bind:value={subtaskTypeOfError} 
                                        class="subtask-select"
                                    >
                                        <option value="">Select error type (optional)</option>
                                        <option value="M">M - Mechanical</option>
                                        <option value="W">W - Welding</option>
                                        <option value="S">S - Simulation</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="priority">Priority:</label>
                                    <select 
                                        id="priority" 
                                        name="priority"
                                        bind:value={subtaskPriority}
                                        class="subtask-select"
                                    >
                                        <option value="1">Low</option>
                                        <option value="2">Medium</option>
                                        <option value="3">High</option>
                                    </select>
                                </div>
                                
                                <div class="form-actions">
                                    <button type="submit" class="submit-btn">Create Subtask</button>
                                    <button type="button" class="cancel-btn" on:click={toggleAddSubtaskForm}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    {/if}
                    
                    {#if showEditSubtaskForm && editingSubtask}
                        <div class="edit-subtask-form">
                            <h3>Edit Subtask: ST{editingSubtask.id} - {editingSubtask.description}</h3>
                            <form method="POST" action="?/editSubtask" use:enhance={() => {
                                return async ({ result }) => {
                                    if (result.type === 'success') {
                                        cancelEditSubtask();
                                        // Refresh the page to show the updated subtask
                                        const currentParams = new URLSearchParams(window.location.search);
                                        goto(`/progress?${currentParams.toString()}`, { invalidateAll: true });
                                    }
                                };
                            }}>
                                <input type="hidden" name="subtaskId" value={editingSubtask.id} />
                                
                                <div class="form-group">
                                    <label for="edit-subtask-description">Description:</label>
                                    <textarea 
                                        id="edit-subtask-description" 
                                        name="description"
                                        bind:value={editSubtaskDescription} 
                                        placeholder="Enter subtask description"
                                        class="subtask-description-input"
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label for="edit-subtask-typeOfError">Type of Error:</label>
                                    <select 
                                        id="edit-subtask-typeOfError" 
                                        name="typeOfError"
                                        bind:value={editSubtaskTypeOfError} 
                                        class="subtask-select"
                                    >
                                        <option value="">Select error type (optional)</option>
                                        <option value="M">M - Mechanical</option>
                                        <option value="W">W - Welding</option>
                                        <option value="S">S - Simulation</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="edit-subtask-priority">Priority:</label>
                                    <select 
                                        id="edit-subtask-priority" 
                                        name="priority"
                                        bind:value={editSubtaskPriority}
                                        class="subtask-select"
                                    >
                                        <option value="1">Low</option>
                                        <option value="2">Medium</option>
                                        <option value="3">High</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="edit-subtask-status">Status:</label>
                                    <select 
                                        id="edit-subtask-status" 
                                        name="status"
                                        bind:value={editSubtaskStatus}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                
                                <div class="form-actions">
                                    <button type="submit" class="submit-btn">Update Subtask</button>
                                    <button type="button" class="cancel-btn" on:click={cancelEditSubtask}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    {/if}
                    
                    <div class="subtasks-section">
                        {#if data.taskSubtasks.length > 0}
                            <div class="subtasks-list">
                                {#each data.taskSubtasks as subtask}
                                    <div class="subtask-item">
                                        <div class="subtask-info">
                                            <h4>ST{subtask.id} - {subtask.description}</h4>
                                            <div class="subtask-meta">
                                                <span class="subtask-status" style="color: {getStatusColor(subtask.status)}">
                                                    {subtask.status.toUpperCase()}
                                                </span>
                                                {#if subtask.typeOfError}
                                                    <span class="error-type {getErrorTypeClass(subtask.typeOfError)}">Error: {getErrorTypeDisplay(subtask.typeOfError)}</span>
                                                {/if}
                                                <span class="priority">Priority: {subtask.priority === 1 ? 'Low' : subtask.priority === 2 ? 'Medium' : 'High'}</span>
                                            </div>
                                        </div>
                                        <div class="subtask-actions">
                                            <button class="subtask-btn edit-btn" on:click|stopPropagation={() => startEditSubtask(subtask)}>Edit</button>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <div class="no-subtasks">
                                <p>No blocking points found for this task.</p>
                                <p>Click "Add Blocking Point" to create the first blocking point.</p>
                            </div>
                        {/if}
                    </div>
                </div>
            {:else}
                <div class="placeholder-subtasks">
                    <h2>Blocking points</h2>
                    <p>Select a task to view its blocking points.</p>
                </div>
            {/if}
        </div>
    </div>

    <!-- Logout button in top right corner -->
    <button class="logout-btn-corner" on:click={() => goto('/login')}>
        Logout
    </button>

    <!-- Navigation buttons -->
    <div class="navigation">
        <button class="nav-button" on:click={() => goto('/welcome')}>
            ← Back to Dashboard
        </button>
    </div>
</div>

<style>
    .progress-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        font-family: Arial, sans-serif;
        background: white;
        color: black;
        min-height: 100vh;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #e1e1e1;
    }

    .header h1 {
        font-size: 2.5rem;
        margin: 0;
        color: black;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .user-info p {
        margin: 0;
        font-size: 1.1rem;
    }

    .admin-badge {
        background: black;
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: bold;
    }

    .main-content {
        display: grid;
        grid-template-columns: 300px 1fr 300px;
        gap: 30px;
        margin-bottom: 30px;
    }

    .sidebar {
        background: #f8f9fa;
        border: 1px solid #e1e1e1;
        border-radius: 8px;
        padding: 20px;
        height: fit-content;
    }

    .sidebar h2 {
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 1.5rem;
        color: black;
    }

    .robots-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .robot-item {
        background: white;
        border: 1px solid #e1e1e1;
        border-radius: 6px;
        padding: 15px;
        transition: all 0.2s;
    }

    .robot-item:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .robot-item.selected {
        border-color: black;
        background: #f0f0f0;
    }

    .robot-info h3 {
        margin: 0 0 8px 0;
        font-size: 1.1rem;
        color: black;
    }

    .robot-id {
        margin: 0 0 12px 0;
        color: #666;
        font-size: 0.9rem;
    }

    .robot-actions {
        display: flex;
        gap: 10px;
    }

    .view-details-btn {
        padding: 6px 12px;
        background: white;
        border: 1px solid black;
        color: black;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s;
    }

    .view-details-btn:hover {
        background: black;
        color: white;
    }

    .view-details-btn.active {
        background: black;
        color: white;
    }

    .no-robots {
        text-align: center;
        padding: 40px 20px;
        color: #666;
    }

    .content {
        background: #f8f9fa;
        border: 1px solid #e1e1e1;
        border-radius: 8px;
        padding: 30px;
    }

    .robot-details {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .robot-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .robot-header h2 {
        margin: 0;
        font-size: 1.8rem;
        color: black;
    }

    .add-task-btn {
        padding: 10px 20px;
        background: black;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s;
    }

    .add-task-btn:hover {
        background: #333;
    }

    .add-task-form {
        background: white;
        border: 1px solid #e1e1e1;
        border-radius: 6px;
        padding: 20px;
        margin-bottom: 20px;
    }

    .edit-task-form {
        background: #fff8dc;
        border: 1px solid #f0d000;
        border-radius: 6px;
        padding: 20px;
        margin-bottom: 20px;
    }

    .edit-task-form h3 {
        margin: 0 0 15px 0;
        font-size: 1.2rem;
        color: #cc8800;
    }

    .form-group {
        margin-bottom: 15px;
    }

    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: black;
    }

    .task-name-input {
        width: 100%;
        padding: 10px;
        border: 1px solid #e1e1e1;
        border-radius: 4px;
        font-size: 1rem;
        color: black;
        background: white;
        transition: border-color 0.2s;
    }

    .task-name-input:focus {
        outline: none;
        border-color: black;
    }

    .task-name-input::placeholder {
        color: #999;
    }

    .verification-type-container {
        display: flex;
        gap: 20px;
        margin-top: 10px;
    }

    .verification-option {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .verification-option input[type="radio"] {
        display: none;
    }

    .verification-label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 8px 12px;
        border: 2px solid #e1e1e1;
        border-radius: 6px;
        transition: all 0.2s;
    }

    .verification-label:hover {
        border-color: black;
    }

    .verification-option input[type="radio"]:checked + .verification-label {
        border-color: black;
        background: #f0f0f0;
    }

    .verification-box {
        width: 40px;
        height: 40px;
        border: 2px solid #333;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        font-weight: bold;
        color: black;
        background: white;
        transition: all 0.2s;
    }

    .verification-option input[type="radio"]:checked + .verification-label .verification-box {
        background: black;
        color: white;
    }

    .form-actions {
        display: flex;
        gap: 10px;
    }

    .submit-btn {
        padding: 10px 20px;
        background: black;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s;
    }

    .submit-btn:hover {
        background: #333;
    }

    .cancel-btn {
        padding: 10px 20px;
        background: white;
        color: black;
        border: 1px solid black;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s;
    }

    .cancel-btn:hover {
        background: black;
        color: white;
    }

    .error-message {
        background: #fee;
        border: 1px solid #fcc;
        color: #c33;
        padding: 10px;
        border-radius: 4px;
        margin-bottom: 15px;
    }

    .success-message {
        background: #efe;
        border: 1px solid #cfc;
        color: #3c3;
        padding: 10px;
        border-radius: 4px;
        margin-bottom: 15px;
    }

    .tasks-section {
        flex: 1;
    }

    .tasks-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .task-item {
        background: white;
        border: 1px solid #e1e1e1;
        border-radius: 6px;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.2s;
        cursor: pointer;
        position: relative;
    }

    .task-item:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-color: #007bff;
        transform: translateY(-1px);
    }

    .task-item.selected {
        border-color: #007bff;
        background: #f0f8ff;
        box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
    }

    .task-item.selected::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: #007bff;
        border-radius: 2px 0 0 2px;
    }

    .task-info h4 {
        margin: 0 0 10px 0;
        font-size: 1.2rem;
        color: black;
    }

    .task-meta {
        display: flex;
        gap: 15px;
        font-size: 0.9rem;
    }



    .task-status {
        font-weight: bold;
    }

    .verification-type {
        color: #007bff;
        font-weight: bold;
    }

    .task-actions {
        display: flex;
        gap: 10px;
    }

    .task-btn {
        padding: 6px 12px;
        border: 1px solid #e1e1e1;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s;
    }

    .view-btn {
        background: white;
        color: black;
        border-color: black;
    }

    .view-btn:hover {
        background: black;
        color: white;
    }

    .edit-btn {
        background: #007bff;
        color: white;
        border-color: #007bff;
    }

    .edit-btn:hover {
        background: #0056b3;
        border-color: #0056b3;
    }

    .no-tasks {
        text-align: center;
        padding: 40px 20px;
        color: #666;
    }



    .navigation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #e1e1e1;
    }

    .nav-button {
        padding: 10px 20px;
        background: white;
        border: 1px solid black;
        color: black;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s;
    }

    .nav-button:hover {
        background: black;
        color: white;
    }

    .logout-btn {
        background: #e53e3e;
        border-color: #e53e3e;
        color: white;
    }

    .logout-btn:hover {
        background: #c53030;
        border-color: #c53030;
    }

    .logout-btn-corner {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        background: #e53e3e;
        border: 1px solid #e53e3e;
        color: white;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s;
        z-index: 1000;
    }

    .logout-btn-corner:hover {
        background: #c53030;
        border-color: #c53030;
    }

    /* Subtasks panel styles */
    .subtasks-panel {
        background: #f8f9fa;
        border: 1px solid #e1e1e1;
        border-radius: 8px;
        padding: 20px;
        height: fit-content;
    }

    .subtask-details {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .subtask-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .subtask-header h2 {
        margin: 0;
        font-size: 1.5rem;
        color: black;
    }

    .add-subtask-btn {
        padding: 8px 16px;
        background: black;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s;
    }

    .add-subtask-btn:hover {
        background: #333;
    }

    .add-subtask-form {
        background: white;
        border: 1px solid #e1e1e1;
        border-radius: 6px;
        padding: 15px;
        margin-bottom: 20px;
    }

    .edit-subtask-form {
        background: #fff8dc;
        border: 1px solid #f0d000;
        border-radius: 6px;
        padding: 20px;
        margin-bottom: 20px;
    }

    .edit-subtask-form h3 {
        margin: 0 0 15px 0;
        font-size: 1.2rem;
        color: #cc8800;
    }

    .subtask-description-input {
        width: 100%;
        padding: 8px;
        border: 1px solid #e1e1e1;
        border-radius: 4px;
        font-size: 0.9rem;
        color: black;
        background: white;
        resize: vertical;
        font-family: inherit;
    }

    .subtask-input {
        width: 100%;
        padding: 8px;
        border: 1px solid #e1e1e1;
        border-radius: 4px;
        font-size: 0.9rem;
        color: black;
        background: white;
    }

    .subtask-select {
        width: 100%;
        padding: 8px;
        border: 1px solid #e1e1e1;
        border-radius: 4px;
        font-size: 0.9rem;
        color: black;
        background: white;
    }

    .subtask-description-input:focus,
    .subtask-input:focus,
    .subtask-select:focus {
        outline: none;
        border-color: black;
    }

    .subtasks-section {
        flex: 1;
    }

    .subtasks-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .subtask-item {
        background: white;
        border: 1px solid #e1e1e1;
        border-radius: 6px;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: box-shadow 0.2s;
    }

    .subtask-item:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .subtask-info h4 {
        margin: 0 0 8px 0;
        font-size: 1rem;
        color: black;
    }

    .subtask-meta {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 0.8rem;
    }

    .subtask-status {
        font-weight: bold;
    }

    .error-type {
        background: #f8f9fa;
        color: #495057;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        padding: 3px 8px;
        font-size: 0.85rem;
        font-weight: 500;
        margin-left: 10px;
    }

    .error-type.error-mechanical {
        background: #e3f2fd;
        color: #1976d2;
        border-color: #1976d2;
    }

    .error-type.error-welding {
        background: #fff3e0;
        color: #f57c00;
        border-color: #f57c00;
    }

    .error-type.error-simulation {
        background: #f3e5f5;
        color: #7b1fa2;
        border-color: #7b1fa2;
    }

    .error-type.error-default {
        background: #f8f9fa;
        color: #495057;
        border-color: #e9ecef;
    }

    .priority {
        color: #007bff;
        font-weight: bold;
    }

    .subtask-actions {
        display: flex;
        gap: 8px;
    }

    .subtask-btn {
        padding: 4px 8px;
        border: 1px solid #e1e1e1;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: all 0.2s;
    }

    .subtask-btn.view-btn {
        background: white;
        color: black;
        border-color: black;
    }

    .subtask-btn.view-btn:hover {
        background: black;
        color: white;
    }

    .subtask-btn.edit-btn {
        background: #007bff;
        color: white;
        border-color: #007bff;
    }

    .subtask-btn.edit-btn:hover {
        background: #0056b3;
        border-color: #0056b3;
    }

    .no-subtasks {
        text-align: center;
        padding: 30px 15px;
        color: #666;
    }

    .placeholder-subtasks {
        text-align: center;
        padding: 40px 20px;
        color: #666;
    }

    .placeholder-subtasks h2 {
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 1.5rem;
        color: black;
    }



    @media (max-width: 768px) {
        .main-content {
            grid-template-columns: 1fr;
            gap: 20px;
        }
        
        .header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
        }
        
        .navigation {
            flex-direction: column;
            gap: 15px;
        }
        
        .robot-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
        }
        
        .task-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
        }
        
        .task-actions {
            align-self: flex-end;
        }
        
        .verification-type-container {
            flex-direction: column;
            gap: 10px;
        }
        
        .subtask-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
        }
        
        .subtask-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
        }
        
        .subtask-actions {
            align-self: flex-end;
        }
    }

    /* Color selector styles */
    .color-selector {
        display: flex;
        gap: 15px;
        margin-top: 8px;
    }

    .color-option {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 6px;
        border: 2px solid transparent;
        transition: all 0.3s ease;
    }

    .color-option:hover {
        background-color: #f8f9fa;
    }

    .color-option input[type="radio"] {
        display: none;
    }

    .color-option input[type="radio"]:checked + .color-circle {
        border-width: 3px;
        border-color: #333;
    }

    .color-circle {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid #ddd;
        display: inline-block;
        transition: all 0.3s ease;
    }

    .color-circle.green {
        background-color: #28a745;
    }

    .color-circle.red {
        background-color: #dc3545;
    }

    .color-circle.orange {
        background-color: #fd7e14;
    }

    .color-circle.yellow {
        background-color: #ffc107;
    }

    .color-circle.blue {
        background-color: #007bff;
    }

    .color-label {
        font-weight: 500;
        color: #333;
    }

    /* Task color display styles */
    .task-color-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 8px;
        border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .task-color-indicator.green {
        background-color: #28a745;
    }

    .task-color-indicator.red {
        background-color: #dc3545;
    }

    .task-color-indicator.orange {
        background-color: #fd7e14;
    }

    .task-color-indicator.yellow {
        background-color: #ffc107;
    }

    .task-color-indicator.blue {
        background-color: #007bff;
    }

    .task-color-badge {
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: bold;
        color: white;
        text-transform: uppercase;
    }

    .task-color-badge.green {
        background-color: #28a745;
    }

    .task-color-badge.red {
        background-color: #dc3545;
    }

    .task-color-badge.orange {
        background-color: #fd7e14;
    }

    .task-color-badge.yellow {
        background-color: #ffc107;
        color: #333;
    }

    .task-color-badge.blue {
        background-color: #007bff;
    }
</style> 