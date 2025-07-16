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
    
    function selectTask(taskId) {
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('taskId', taskId);
        goto(`/progress/${data.robot.id}?${currentParams.toString()}`);
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
                return '#000';
            case 'in_progress':
                return '#666';
            case 'pending':
                return '#999';
            default:
                return '#999';
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
</script>

<div class="container">
    <!-- Header -->
    <div class="header">
        <div class="header-content">
            <div class="robot-info">
                <h1>{data.robot.name || `Robot ${data.robot.id}`}</h1>
                <p>ID: {data.robot.id}</p>
            </div>
            <div class="user-info">
                <p>Welcome, {data.user.firstName}!</p>
                {#if data.user.admin}
                    <span class="admin-badge">Admin</span>
                {/if}
                <!-- Navigation Buttons -->
                <div class="header-navigation">
                    <button class="btn btn-secondary" on:click={() => goto('/progress')}>
                        ← Back to Robots
                    </button>
                    <button class="btn btn-secondary" on:click={() => goto('/welcome')}>
                        Dashboard
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <!-- Tasks Panel -->
        <div class="panel">
            <div class="panel-header">
                <h2>Tasks</h2>
                <button class="btn" on:click={toggleAddTaskForm}>
                    {showAddTaskForm ? 'Cancel' : 'Add Task'}
                </button>
            </div>
            
            {#if showAddTaskForm}
                <div class="form-container">
                    <form method="POST" action="?/createTask" use:enhance={() => {
                        return async ({ result }) => {
                            if (result.type === 'success') {
                                showAddTaskForm = false;
                                verificationType = 'A';
                                customTaskName = '';
                                taskColor = 'blue';
                                goto(`/progress/${data.robot.id}`, { invalidateAll: true });
                            }
                        };
                    }}>
                        <input type="hidden" name="robotId" value={data.robot.id} />
                        
                        <div class="form-group">
                            <label for="taskName">Task Title:</label>
                            <input 
                                type="text" 
                                id="taskName" 
                                name="taskName"
                                bind:value={customTaskName} 
                                placeholder="Enter task title"
                                required
                            />
                        </div>
                        
                        <div class="form-group">
                            <label>Verification Type:</label>
                            <div class="radio-group">
                                <label class="radio-option">
                                    <input type="radio" name="verificationType" value="A" bind:group={verificationType} />
                                    <span>A - Auto</span>
                                </label>
                                <label class="radio-option">
                                    <input type="radio" name="verificationType" value="M" bind:group={verificationType} />
                                    <span>M - Manual</span>
                                </label>
                            </div>
                        </div>
                        
                        <input type="hidden" name="color" value="blue" />
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Create Task</button>
                            <button type="button" class="btn btn-secondary" on:click={toggleAddTaskForm}>Cancel</button>
                        </div>
                    </form>
                </div>
            {/if}
            
            {#if showEditTaskForm && editingTask}
                <div class="form-container edit-form">
                    <h3>Edit Task: T{editingTask.id} - {editingTask.name}</h3>
                    <form method="POST" action="?/editTask" use:enhance={() => {
                        return async ({ result }) => {
                            if (result.type === 'success') {
                                cancelEditTask();
                                const currentParams = new URLSearchParams(window.location.search);
                                goto(`/progress/${data.robot.id}?${currentParams.toString()}`, { invalidateAll: true });
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
                        
                        <input type="hidden" name="color" value="blue" />
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Update Task</button>
                            <button type="button" class="btn btn-secondary" on:click={cancelEditTask}>Cancel</button>
                        </div>
                    </form>
                </div>
            {/if}
            
            {#if form?.error}
                <div class="error-message">{form.error}</div>
            {/if}
            
            {#if form?.success}
                <div class="success-message">{form.message}</div>
            {/if}
            
            <div class="items-list">
                {#if data.robotTasks.length > 0}
                    {#each data.robotTasks as task}
                        <div class="item {data.selectedTask?.id === task.id ? 'selected' : ''}" 
                             on:click={() => selectTask(task.id)}>
                            <div class="item-info">
                                <h4>T{task.id} - {task.name}</h4>
                                <div class="item-meta">
                                    <span class="status" style="color: {getStatusColor(task.status)}">
                                        {task.status.toUpperCase()}
                                    </span>
                                    <span>Type: {task.verificationType || 'A'}</span>
                                </div>
                            </div>
                            <div class="item-actions">
                                <button class="btn-small" on:click|stopPropagation={() => selectTask(task.id)}>
                                    {data.selectedTask?.id === task.id ? 'Selected' : 'Select'}
                                </button>
                                <button class="btn-small" on:click|stopPropagation={() => startEditTask(task)}>Edit</button>
                            </div>
                        </div>
                    {/each}
                {:else}
                    <div class="no-items">
                        <p>No tasks found for this robot.</p>
                        <p>Click "Add Task" to create the first task.</p>
                    </div>
                {/if}
            </div>
        </div>

        <!-- Subtasks Panel -->
        <div class="panel">
            {#if data.selectedTask}
                <div class="panel-header">
                    <h2>{data.selectedTask.name} - Subtasks</h2>
                    <button class="btn" on:click={toggleAddSubtaskForm}>
                        {showAddSubtaskForm ? 'Cancel' : 'Add Subtask'}
                    </button>
                </div>
                
                {#if showAddSubtaskForm}
                    <div class="form-container">
                        <form method="POST" action="?/createSubtask" use:enhance={() => {
                            return async ({ result }) => {
                                if (result.type === 'success') {
                                    showAddSubtaskForm = false;
                                    subtaskDescription = '';
                                    subtaskTypeOfError = '';
                                    subtaskPriority = 1;
                                    goto(`/progress/${data.robot.id}?taskId=${data.selectedTask.id}`, { invalidateAll: true });
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
                                >
                                    <option value="1">Low</option>
                                    <option value="2">Medium</option>
                                    <option value="3">High</option>
                                </select>
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">Create Subtask</button>
                                <button type="button" class="btn btn-secondary" on:click={toggleAddSubtaskForm}>Cancel</button>
                            </div>
                        </form>
                    </div>
                {/if}
                
                {#if showEditSubtaskForm && editingSubtask}
                    <div class="form-container edit-form">
                        <h3>Edit Subtask: ST{editingSubtask.id}</h3>
                        <form method="POST" action="?/editSubtask" use:enhance={() => {
                            return async ({ result }) => {
                                if (result.type === 'success') {
                                    cancelEditSubtask();
                                    const currentParams = new URLSearchParams(window.location.search);
                                    goto(`/progress/${data.robot.id}?${currentParams.toString()}`, { invalidateAll: true });
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
                                <button type="submit" class="btn btn-primary">Update Subtask</button>
                                <button type="button" class="btn btn-secondary" on:click={cancelEditSubtask}>Cancel</button>
                            </div>
                        </form>
                    </div>
                {/if}
                
                <div class="items-list">
                    {#if data.taskSubtasks.length > 0}
                        {#each data.taskSubtasks as subtask}
                            <div class="item">
                                <div class="item-info">
                                    <h4>ST{subtask.id} - {subtask.description}</h4>
                                    <div class="item-meta">
                                        <span class="status" style="color: {getStatusColor(subtask.status)}">
                                            {subtask.status.toUpperCase()}
                                        </span>
                                        {#if subtask.typeOfError}
                                            <span>Error: {getErrorTypeDisplay(subtask.typeOfError)}</span>
                                        {/if}
                                        <span>Priority: {subtask.priority === 1 ? 'Low' : subtask.priority === 2 ? 'Medium' : 'High'}</span>
                                    </div>
                                </div>
                                <div class="item-actions">
                                    <button class="btn-small" on:click={() => startEditSubtask(subtask)}>Edit</button>
                                </div>
                            </div>
                        {/each}
                    {:else}
                        <div class="no-items">
                            <p>No subtasks found for this task.</p>
                            <p>Click "Add Subtask" to create the first subtask.</p>
                        </div>
                    {/if}
                </div>
            {:else}
                <div class="placeholder">
                    <h2>Subtasks</h2>
                    <p>Select a task to view its subtasks.</p>
                </div>
            {/if}
        </div>
    </div>


</div>


<style>
    /* Reset and base styles */
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .container {
        min-height: 100vh;
        background: white;
        padding: 20px;
        font-family: Arial, sans-serif;
        color: #000;
    }

    /* Header */
    .header {
        border-bottom: 2px solid #000;
        margin-bottom: 30px;
        padding-bottom: 20px;
    }

    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .robot-info h1 {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 5px;
    }

    .robot-info p {
        color: #666;
        font-size: 1rem;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .user-info p {
        font-size: 1rem;
    }

    .admin-badge {
        background: #000;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: bold;
    }

    .header-navigation {
        display: flex;
        gap: 10px;
        margin-left: 15px;
    }

    .header-navigation .btn {
        padding: 6px 12px;
        font-size: 0.9rem;
    }

    /* Main content */
    .main-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        margin-bottom: 30px;
    }

    .panel {
        border: 2px solid #000;
        padding: 20px;
    }

    .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #000;
    }

    .panel-header h2 {
        font-size: 1.5rem;
        font-weight: bold;
    }

    /* Buttons */
    .btn {
        background: #000;
        color: white;
        border: 2px solid #000;
        padding: 8px 16px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.2s;
    }

    .btn:hover {
        background: white;
        color: #000;
    }

    .btn-primary {
        background: #000;
        color: white;
    }

    .btn-secondary {
        background: white;
        color: #000;
        border: 2px solid #000;
    }

    .btn-secondary:hover {
        background: #000;
        color: white;
    }

    .btn-small {
        background: white;
        color: #000;
        border: 1px solid #000;
        padding: 4px 8px;
        font-size: 0.8rem;
        cursor: pointer;
        font-weight: bold;
    }

    .btn-small:hover {
        background: #000;
        color: white;
    }

    /* Forms */
    .form-container {
        border: 1px solid #000;
        padding: 15px;
        margin-bottom: 20px;
        background: #f9f9f9;
    }

    .edit-form {
        background: #f0f0f0;
        border: 2px solid #000;
    }

    .edit-form h3 {
        margin-bottom: 15px;
        font-size: 1.1rem;
        font-weight: bold;
    }

    .form-group {
        margin-bottom: 15px;
    }

    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        font-size: 0.9rem;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
        width: 100%;
        padding: 8px;
        border: 2px solid #000;
        background: white;
        font-size: 0.9rem;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
        outline: none;
        border-color: #666;
    }

    .radio-group {
        display: flex;
        gap: 15px;
        margin-top: 5px;
    }

    .radio-option {
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
    }

    .radio-option input[type="radio"] {
        width: auto;
        margin: 0;
    }

    .form-actions {
        display: flex;
        gap: 10px;
        margin-top: 15px;
    }

    /* Messages */
    .error-message {
        background: #f0f0f0;
        border: 2px solid #000;
        padding: 10px;
        margin-bottom: 15px;
        font-weight: bold;
    }

    .success-message {
        background: #f0f0f0;
        border: 2px solid #000;
        padding: 10px;
        margin-bottom: 15px;
        font-weight: bold;
    }

    /* Items */
    .items-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .item {
        border: 1px solid #000;
        padding: 15px;
        background: white;
        cursor: pointer;
        transition: background 0.2s;
    }

    .item:hover {
        background: #f9f9f9;
    }

    .item.selected {
        background: #f0f0f0;
        border: 2px solid #000;
    }

    .item-info h4 {
        font-size: 1rem;
        font-weight: bold;
        margin-bottom: 8px;
    }

    .item-meta {
        display: flex;
        gap: 15px;
        font-size: 0.8rem;
        margin-bottom: 10px;
        flex-wrap: wrap;
    }

    .status {
        font-weight: bold;
    }

    .item-actions {
        display: flex;
        gap: 8px;
    }

    .no-items {
        text-align: center;
        padding: 30px;
        color: #666;
        border: 1px solid #ccc;
        background: #f9f9f9;
    }

    .placeholder {
        text-align: center;
        padding: 40px;
        color: #666;
    }

    .placeholder h2 {
        margin-bottom: 10px;
        color: #000;
    }



    /* Responsive */
    @media (max-width: 1024px) {
        .main-content {
            grid-template-columns: 1fr;
            gap: 20px;
        }
    }

    @media (max-width: 768px) {
        .header-content {
            flex-direction: column;
            gap: 15px;
            text-align: center;
        }

        .header-navigation {
            flex-direction: column;
            gap: 10px;
            margin-left: 0;
            margin-top: 10px;
        }

        .user-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
        }

        .item-meta {
            flex-direction: column;
            gap: 5px;
        }

        .container {
            padding: 15px;
        }
    }
</style> 