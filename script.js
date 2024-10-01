document.addEventListener('DOMContentLoaded', () => {
    const arrivalForm = document.getElementById('arrival-form');
    const departureForm = document.getElementById('departure-form');
    const arrivalInput = document.getElementById('arrival-time');
    const departureInput = document.getElementById('departure-time');
    const arrivalCurrent = document.getElementById('arrival-current');
    const departureCurrent = document.getElementById('departure-current');
    const resultDiv = document.getElementById('result');

    // Load weekly data from local storage or initialize it
    const weeklyData = JSON.parse(localStorage.getItem('weeklyData')) || {
        monday: { arrival: null, departure: null },
        tuesday: { arrival: null, departure: null },
        wednesday: { arrival: null, departure: null },
        thursday: { arrival: null, departure: null },
        friday: { arrival: null, departure: null }
    };

    // Update current times display on load
    updateCurrentTimeDisplay();
    updateWeeklySummary();

    // Save arrival time
    arrivalForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const arrivalTime = arrivalInput.value;

        if (!arrivalTime) {
            alert('Please enter a valid arrival time.');
            return;
        }

        const today = new Date();
        const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();

        // Update weekly data for the arrival time
        if (weeklyData[dayOfWeek]) {
            weeklyData[dayOfWeek].arrival = arrivalTime;
        }

        // Save to local storage
        localStorage.setItem('weeklyData', JSON.stringify(weeklyData));

        // Update current display and clear input
        updateCurrentTimeDisplay();
        arrivalInput.value = '';
        updateWeeklySummary();
    });

    // Save departure time
    departureForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const departureTime = departureInput.value;

        if (!departureTime) {
            alert('Please enter a valid departure time.');
            return;
        }

        const today = new Date();
        const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();

        // Update weekly data for the departure time
        if (weeklyData[dayOfWeek]) {
            weeklyData[dayOfWeek].departure = departureTime;
        }

        // Save to local storage
        localStorage.setItem('weeklyData', JSON.stringify(weeklyData));

        // Update current display and clear input
        updateCurrentTimeDisplay();
        departureInput.value = '';
        updateWeeklySummary();
    });

    function updateCurrentTimeDisplay() {
        const today = new Date();
        const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();

        // Display current arrival time
        if (weeklyData[dayOfWeek] && weeklyData[dayOfWeek].arrival) {
            arrivalCurrent.innerText = `Current: ${weeklyData[dayOfWeek].arrival}`;
        } else {
            arrivalCurrent.innerText = 'Current: None';
        }

        // Display current departure time
        if (weeklyData[dayOfWeek] && weeklyData[dayOfWeek].departure) {
            departureCurrent.innerText = `Current: ${weeklyData[dayOfWeek].departure}`;
        } else {
            departureCurrent.innerText = 'Current: None';
        }
    }

    // Function to update weekly summary and calculate time worked
    function updateWeeklySummary() {
        const targetMinutes = 8 * 60; // 8 hours in minutes
        for (const day in weeklyData) {
            const data = weeklyData[day];
            const dayElement = document.getElementById(day);
            const timeElement = dayElement.querySelector('.time');

            // Check if both arrival and departure are set
            if (data.arrival && data.departure) {
                const arrivalTime = new Date(`1970-01-01T${data.arrival}:00`);
                const departureTime = new Date(`1970-01-01T${data.departure}:00`);

                // Calculate worked time in minutes
                const workMinutes = (departureTime - arrivalTime) / (1000 * 60) - 30; // Deduct 30 minutes for break

                let formattedTime = `${Math.floor(Math.abs(workMinutes) / 60)}h ${Math.abs(workMinutes) % 60}m`;

                if (workMinutes > targetMinutes) {
                    const overtime = workMinutes - targetMinutes; // Calculate overtime
                    timeElement.innerText = `${formattedTime} (Overtime: ${Math.floor(overtime / 60)}h ${overtime % 60}m)`; // Display overtime
                    timeElement.classList.add('overtime');
                    timeElement.classList.remove('undertime');
                } else if (workMinutes < targetMinutes) {
                    const underTime = targetMinutes - workMinutes; // Calculate undertime
                    timeElement.innerText = `${formattedTime} (Undertime: ${Math.floor(underTime / 60)}h ${underTime % 60}m)`; // Display undertime
                    timeElement.classList.add('undertime');
                    timeElement.classList.remove('overtime');
                } else {
                    timeElement.innerText = '0h 0m'; // Display zero if no overtime or undertime
                    timeElement.classList.remove('overtime', 'undertime');
                }
            } else {
                // If no time recorded, display 'No data'
                timeElement.innerText = 'No data';
                timeElement.classList.remove('overtime', 'undertime');
            }
        }
    }
});
