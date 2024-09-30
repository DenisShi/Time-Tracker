document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('time-form');
    const arrivalInput = document.getElementById('arrival-time');
    const departureInput = document.getElementById('departure-time');
    const resultDiv = document.getElementById('result');

    // Load weekly data from local storage or initialize it
    const weeklyData = JSON.parse(localStorage.getItem('weeklyData')) || {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0
    };

    // Update weekly summary on load
    updateWeeklySummary();

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const arrivalTime = new Date(`1970-01-01T${arrivalInput.value}:00`);
        const departureTime = new Date(`1970-01-01T${departureInput.value}:00`);
        
        // Validate the input
        if (arrivalTime >= departureTime) {
            alert('Departure time must be later than arrival time.');
            return;
        }

        // Calculate worked time in minutes
        const workMinutes = (departureTime - arrivalTime) / (1000 * 60) - 30; // Deduct 30 minutes for break

        // Get the current date
        const today = new Date();
        const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' }).toLowerCase(); // Get the day of the week

        // Update the weekly data for the current weekday
        if (weeklyData[dayOfWeek] !== undefined) {
            // Overwrite the existing value for that day
            weeklyData[dayOfWeek] = workMinutes;
        }

        // Store the updated weekly data in local storage
        localStorage.setItem('weeklyData', JSON.stringify(weeklyData));

        // Display results
        resultDiv.innerHTML = `
            <p>Worked Today: ${Math.floor(workMinutes / 60)}h ${workMinutes % 60}m</p>
            <p>Total Worked This Week:</p>
        `;

        // Update weekly summary
        updateWeeklySummary();

        // Clear input fields
        arrivalInput.value = '';
        departureInput.value = '';
    });

    function updateWeeklySummary() {
        const targetMinutes = 8 * 60; // 8 hours in minutes
        for (const day in weeklyData) {
            const totalMinutes = weeklyData[day];
            const dayElement = document.getElementById(day);
            const timeElement = dayElement.querySelector('.time');

            let formattedTime = `${Math.floor(Math.abs(totalMinutes) / 60)}h ${Math.abs(totalMinutes) % 60}m`;

            if (totalMinutes > targetMinutes) {
                const overtime = totalMinutes - targetMinutes; // Calculate overtime
                timeElement.innerText = `${formattedTime} (Overtime: ${Math.floor(overtime / 60)}h ${overtime % 60}m)`; // Display overtime
                timeElement.classList.add('overtime');
                timeElement.classList.remove('undertime');
            } else if (totalMinutes < targetMinutes) {
                const underTime = targetMinutes - totalMinutes; // Calculate undertime
                timeElement.innerText = `${formattedTime} (Undertime: ${Math.floor(underTime / 60)}h ${underTime % 60}m)`; // Display undertime
                timeElement.classList.add('undertime');
                timeElement.classList.remove('overtime');
            } else {
                timeElement.innerText = '0h 0m'; // Display zero if no overtime or undertime
                timeElement.classList.remove('overtime', 'undertime');
            }
        }
    }
});
