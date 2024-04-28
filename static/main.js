/* words on intro page */
document.addEventListener('DOMContentLoaded', function() {
    const words = document.querySelectorAll('.word');
    let index = 0;

    if (words.length > 0) {
        words.forEach((word, i) => {
            word.style.display = (i === 0) ? 'block' : 'none';
        });

        function showWord() {
            if (index > 0) {
                words[index - 1].style.display = 'none';
            }
            words[index].style.display = 'block';
            index = (index + 1) % words.length;

            setTimeout(showWord, 2000);
        }

        setTimeout(showWord, 2000);
    }
});

function redirectToLogin() {
    window.location.href = "/login";
}

function showSignup() {
    window.location.href = "/register";
}

let currentOpportunityIndex = 0;
let opportunities = [];



function renderOpportunityHtml(opportunity) {
    let imagePath = opportunity.image ? `/static/${opportunity.image}` : '/static/default-image.png'; // Use a default image if none specified
    return `
        <div class="card">
            <img src="${imagePath}" alt="Event Picture" class="card-img">
            <h3>${opportunity.organization_name}</h3>
            <p>${opportunity.description}</p>
            <p><strong>Interest:</strong> ${opportunity.interest_field}</p>
            <p><strong>Location:</strong> ${opportunity.location}</p>
            <p><strong>Date:</strong> ${opportunity.date}</p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', function() {
    const likeButton = document.querySelector('.action-btn.like');
    const dislikeButton = document.querySelector('.action-btn.dislike');
    let currentEvent = document.querySelector('.explore-container.explore-page'); // This should select the current visible event card.

    // Function to handle the animation and swipe logic
    function handleSwipe(action, animationName) {
        currentEvent.style.animation = `${animationName} 0.75s forwards`;

        currentEvent.addEventListener('animationend', () => {
            // Reset the style and prepare for the next event
            currentEvent.style.display = 'none'; // Hide the old card
            currentEvent.style.animation = ''; // Clear the animation to reuse the card

            // Increment and check to load the next opportunity if available
            currentOpportunityIndex++;
            if (currentOpportunityIndex < opportunities.length) {
                displayCurrentOpportunity(); // Display the next opportunity
                currentEvent.style.display = 'block'; // Ensure it's visible
            } else {
                document.querySelector('.explore-container.explore-page').innerHTML = '<p>No more opportunities.</p>';
                console.log('Reached the end of opportunities.');
            }
        }, { once: true });
    }

    // Attach event listeners
    if (!likeButton.hasAttribute('data-event-bound')) {
        likeButton.setAttribute('data-event-bound', 'true');
        likeButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            handleSwipe('liked', 'swipeRightUp');
        }, { capture: true });
    }

    if (!dislikeButton.hasAttribute('data-event-bound')) {
        dislikeButton.setAttribute('data-event-bound', 'true');
        dislikeButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            handleSwipe('disliked', 'swipeLeftUp');
        }, { capture: true });
    }

    loadOpportunities(); // Load opportunities when the document is ready
});

function swipeEvent(action) {
    console.log(`Swipe event triggered: ${action}`);
    if (currentOpportunityIndex < opportunities.length) {
        console.log(`Action: ${action} on event: ${opportunities[currentOpportunityIndex].organization_name}`);
    }

    currentOpportunityIndex++;

    if (currentOpportunityIndex >= opportunities.length) {
        document.querySelector('.explore-container.explore-page').innerHTML = '<p>No more opportunities.</p>';
        console.log('Reached the end of opportunities.');
    } else {
        displayCurrentOpportunity();
    }
}

function loadOpportunities() {
    console.log("Starting to load opportunities");
    fetch('/api/opportunities')
        .then(response => response.json())
        .then(data => {
            console.log("Opportunities loaded:", data); // Check the fetched data
            opportunities = data;
            displayCurrentOpportunity();
        })
        .catch(error => {
            console.error('Error fetching opportunities:', error);
            document.getElementById('opportunity-container').innerHTML = '<p>Error loading opportunities.</p>';
        });
}

function displayCurrentOpportunity() {
    const container = document.querySelector('.explore-container.explore-page');
    if (currentOpportunityIndex < opportunities.length) {
        const opportunity = opportunities[currentOpportunityIndex];
        console.log(`Displaying opportunity ${currentOpportunityIndex}: ${opportunity.organization_name}`);
        container.innerHTML = `
            <div class="card">
                <img src="/static/${opportunity.image || 'default-image.png'}" alt="Event Picture" class="card-img">
                <h3>${opportunity.organization_name}</h3>
                <p>${opportunity.description}</p>
                <p><strong>Interest:</strong> ${opportunity.interest_field}</p>
                <p><strong>Location:</strong> ${opportunity.location}</p>
                <p><strong>Date:</strong> ${opportunity.date}</p>
            </div>
        `;
        container.style.display = 'block'; // Make sure new content is visible
    } else {
        console.log('No more opportunities to display - Container update skipped.');
    }
}


