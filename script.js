document.addEventListener('DOMContentLoaded', () => {
    // Initialize entries array
    let entries = [];
    let winners = [];

    // Function to add a participant to the display
    function addParticipantToDisplay(name, points) {
        const participantEntries = document.getElementById('participant-entries');
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';

        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Name:';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = name;
        nameInput.className = 'name';

        const pointsLabel = document.createElement('label');
        pointsLabel.textContent = 'Points:';
        const pointsInput = document.createElement('input');
        pointsInput.type = 'number';
        pointsInput.value = points;
        pointsInput.className = 'points';

        inputGroup.appendChild(nameLabel);
        inputGroup.appendChild(nameInput);
        inputGroup.appendChild(pointsLabel);
        inputGroup.appendChild(pointsInput);

        participantEntries.appendChild(inputGroup);
    }

    // Function to initialize participant entry fields
    function initializeParticipantFields(numberOfFields) {
        for (let i = 0; i < numberOfFields; i++) {
            addParticipantToDisplay('', 0);
        }
    }

    // Initialize participant entry fields
    initializeParticipantFields(100);

    // Event listener for "Import Entries" button
    document.getElementById('import-entries').addEventListener('click', function() {
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';

        fileInput.onchange = e => {
            var file = e.target.files[0]; 
            var reader = new FileReader();
            reader.readAsText(file, 'UTF-8');

            reader.onload = readerEvent => {
                var content = readerEvent.target.result;
                var participants;
                try {
                    participants = JSON.parse(content);
                    console.log("Imported Participants: ", participants);
                } catch (error) {
                    console.error("Error parsing JSON: ", error);
                    return;
                }

                // Clear existing participant fields
                const participantEntries = document.getElementById('participant-entries');
                participantEntries.innerHTML = '';

                // Add each participant from the imported list
                participants.forEach(participant => {
                    addParticipantToDisplay(participant.name, participant.points);
                });
            }
        }

        fileInput.click();
    });

    // Event listener for "Save Entries" button
    const saveButton = document.getElementById('save-entries');
    saveButton.addEventListener('click', () => {
        entries = [];
        document.querySelectorAll('.input-group').forEach(group => {
            const name = group.querySelector('.name').value.trim();
            const points = parseInt(group.querySelector('.points').value, 10) || 0;

            if (name && points >= 0) { // Allowing for zero points
                entries.push({ name, points });
            }
        });
        console.log('Final Entries:', entries);
        localStorage.setItem('gameShowEntries', JSON.stringify(entries));
        alert('Entries saved!');
    });

    // Event listener for "Load Entries" button
    const loadButton = document.getElementById('load-entries');
    loadButton.addEventListener('click', () => {
        entries = JSON.parse(localStorage.getItem('gameShowEntries') || '[]');
        const entriesDisplay = document.getElementById('entries-display');
        entriesDisplay.innerHTML = entries.map(entry => `<div>${entry.name} (${entry.points} points)</div>`).join('');
        const spinButton = document.getElementById('spin');
        spinButton.style.display = 'block';
        console.log('Entries loaded:', entries);
    });

    // Function to start left countdown
    function startLeftCountdown() {
    const countdownDuration = 10; // Ensure this is 10 seconds
    let countdown = countdownDuration;
    const leftCountdown = document.getElementById('left-countdown');
    leftCountdown.style.display = 'block';

    const countdownInterval = setInterval(() => {
        if (countdown === 0) {
            clearInterval(countdownInterval);
            leftCountdown.style.display = 'none';
            return;
        }

        leftCountdown.textContent = countdown;
        countdown--;
    }, 1000);
}


   // Function to select a winner

function selectWinner() {
    if (entries.length === 0) {
        console.error('No entries to show. Please save entries first.');
        return;
    }

    // Creating a weighted list based on points
    let weightedEntries = [];
    entries.forEach(entry => {
        for (let i = 0; i < entry.points; i++) {
            weightedEntries.push(entry.name);
        }
    });

    if (weightedEntries.length === 0) {
        console.error('No points assigned. Cannot select a winner.');
        return;
    }

    const winnerIndex = Math.floor(Math.random() * weightedEntries.length);
    const winnerName = weightedEntries[winnerIndex];
    const winnerAnnouncement = document.getElementById('winner-announcement');
const currentContent = winnerAnnouncement.innerHTML;
winnerAnnouncement.innerHTML = currentContent + `<div style="margin-bottom: 20px; padding: 5px;">${winnerName}</div>`;


    // Remove the selected winner from the original entries array
    const originalWinnerIndex = entries.findIndex(entry => entry.name === winnerName);
    if (originalWinnerIndex !== -1) {
        entries.splice(originalWinnerIndex, 1);
    }

    console.log('Winner selected:', winnerName);
}



// Function to display all winners
    function displayWinners() {
        const winnerAnnouncement = document.getElementById('winner-announcement');
        winnerAnnouncement.innerHTML = winners.map(winner => `Winner: ${winner.name}`).join('<br>');
    }

// Function to Flash Names 
function flashNames() {
    const rightPanel = document.querySelector('.right-panel'); // Use the right selector for your right panel
    const flashWindow = document.createElement('div');
    flashWindow.id = 'flash-window';
    flashWindow.style.position = 'absolute';
    flashWindow.style.bottom = '80%'; // Adjust to bring it more to the center
    flashWindow.style.left = '49%'; // Adjust to center horizontally
    flashWindow.style.transform = 'translate(-50%, -50%)'; // Centers the div exactly
    flashWindow.style.zIndex = '1000';
    flashWindow.style.fontSize = '48px'; // Larger font size
    flashWindow.style.color = 'black'; // Text color
    flashWindow.style.fontWeight = 'bold'; // Bold text
    flashWindow.style.textAlign = 'center'; // Centered text
    // Add more styling for flashWindow here
    rightPanel.appendChild(flashWindow);

    let index = 0;
    const flashDuration = 50; // Flash each name for 0.25 seconds
    const flashInterval = setInterval(() => {
        if (index < entries.length) {
            flashWindow.textContent = entries[index].name;
            index++;
        } else {
            index = 0;
        }
    }, flashDuration);

    setTimeout(() => {
        clearInterval(flashInterval);
        flashWindow.remove();
    }, 10000); // Run Flash Names for 10 seconds and then remove the window
}








// Event listener for "Spin" button
const spinButton = document.getElementById('spin');
spinButton.addEventListener('click', () => {
    if (entries.length === 0) {
        alert('No entries to show. Please load entries first.');
        return;
    }

    // Call Flash Names feature
    flashNames(); // Add this line to start Flash Names feature

    spinButton.style.display = 'none';
    const winnerAnnouncement = document.getElementById('winner-announcement');
    winnerAnnouncement.innerHTML = '';
    startLeftCountdown();

    // Schedule the selection of winners at specific times
    setTimeout(selectWinner, 3330); // Select first winner after 3.33 seconds
    setTimeout(selectWinner, 6660); // Select second winner after 6.66 seconds
    setTimeout(selectWinner, 10000); // Select third winner after 10 seconds
});


// Function to trigger export 
function triggerExport() {
    const updatedEntries = [];
    document.querySelectorAll('.input-group').forEach(group => {
        const name = group.querySelector('.name').value.trim();
        const points = parseInt(group.querySelector('.points').value, 10) || 0;

        if (name) { // Adding entry only if the name exists
            updatedEntries.push({ name, points });
        }
    });

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(updatedEntries));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data.json");
    document.body.appendChild(downloadAnchorNode); // Required for Firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Add an event listener to your export button
document.getElementById('exportButton').addEventListener('click', triggerExport);

});
