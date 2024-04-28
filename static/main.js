/* words on intro page */
document.addEventListener('DOMContentLoaded', function() {
    const words = document.querySelectorAll('.word');
    let index = 0;

    if (words.length > 0) { // Only run if there are words to display
        words.forEach((word, i) => {
            if (i !== 0) {
                word.style.display = 'none';
            }
        });

        function showWord() {
            if (words.length > 0) {
                words[index].style.display = 'block';

                if (index > 0) {
                    words[index - 1].style.display = 'none';
                }

                index++;
                if (index >= words.length) {
                    index = 0;
                    setTimeout(() => {
                        words[words.length - 1].style.display = 'none';
                    }, 2000);
                }

                setTimeout(showWord, 2000);
            }
        }

        showWord();
    }
});


function redirectToLogin() {
    window.location.href = "/login"; // Make sure this URL matches your Flask route
}

function showSignup() {
    window.location.href = "/register"; // Assuming you have a '/register' route for sign-up
}

/* explore page tinder */
document.addEventListener('DOMContentLoaded', function() {
    const likeButton = document.querySelector('.action-btn.like');
    const currentEvent = document.querySelector('.explore-container.explore-page');
    const newEvent = document.querySelector('.new-event');

    likeButton.addEventListener('click', function() {
        // Trigger the swipe right and up animation
        currentEvent.style.animation = 'swipeRightUp 0.5s forwards';

        // After the animation ends, hide the current event and show the new event
        currentEvent.addEventListener('animationend', function() {
            currentEvent.style.display = 'none';

            // Reset the animation so it can be triggered again later
            currentEvent.style.animation = '';

            // Show and animate the new event
            newEvent.style.display = 'flex';
            newEvent.style.animation = 'growIn 0.5s forwards';
        }, { once: true });
    });
});

// Add the event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const likeButton = document.querySelector('.action-btn.like');
    const dislikeButton = document.querySelector('.action-btn.dislike');
    const currentEvent = document.querySelector('.explore-container.explore-page');
    const newEvent = document.querySelector('.new-event');

    likeButton.addEventListener('click', function() {
        animateEventOut(currentEvent, 'swipeRightUp');
    });

    dislikeButton.addEventListener('click', function() {
        animateEventOut(currentEvent, 'swipeLeftUp');
    });

    function animateEventOut(eventCard, animationName) {
        // Start the swipe out animation
        eventCard.style.animation = `${animationName} 0.75s forwards`;

        // Listen for the animation to be close to finishing
        eventCard.addEventListener('animationend', function() {
            // Immediately start growing in the new event
            newEvent.style.display = 'flex';
            newEvent.style.animation = 'growIn 0.5s forwards';
            
            // This timeout ensures there's a slight overlap where both animations are visible
            setTimeout(() => {
                eventCard.style.display = 'none';
                eventCard.style.animation = ''; // Reset the animation
                // Swap the references so newEvent becomes currentEvent for the next button press
                currentEvent = newEvent;
                // You would set up newEvent here to point to the next card
            }, 50); // Slightly less than the swipe out animation time
        }, { once: true });
    }
});

let currentOpportunityIndex = 0;
let opportunities = []; // This will be populated with data from the backend

function loadOpportunities() {
    fetch('/api/opportunities')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            opportunities = data;
            console.log("Data received:", data);
            if (opportunities.length > 0) {
                displayCurrentOpportunity();
            } else {
                console.log("No opportunities available.");
                document.getElementById('opportunity-container').innerHTML = '<p>No opportunities available.</p>';
            }
            if (opportunities.length > 0) {
                displayCurrentOpportunity();
            } else {
                document.getElementById('opportunity-container').innerHTML = '<p>No opportunities available.</p>';
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            document.getElementById('opportunity-container').innerHTML = '<p>Error loading opportunities.</p>';
        });
}


function swipeEvent(action) {
    console.log(`Action: ${action} on event: ${opportunities[currentOpportunityIndex].organization_name}`);
    currentOpportunityIndex++;
    displayCurrentOpportunity();
}

document.addEventListener('DOMContentLoaded', function() {
    loadOpportunities(); // Load opportunities when the document is ready
});

function displayCurrentOpportunity() {
    if (currentOpportunityIndex < opportunities.length) {
        const opportunity = opportunities[currentOpportunityIndex];
        const container = document.querySelector('.explore-container.explore-page');
        container.innerHTML = `
            <div class="card">
                <img src="/static/${opportunity.image}" alt="Event Picture" class="card-img">
                <h3>${opportunity.organization_name}</h3>
                <p>${opportunity.description}</p>
                <p><strong>Interest:</strong> ${opportunity.interest_field}</p>
                <p><strong>Location:</strong> ${opportunity.location}</p>
                <p><strong>Date:</strong> ${opportunity.date}</p>
            </div>
        `;
    } else {
        document.getElementById('opportunity-container').innerHTML = '<p>No more opportunities.</p>';
        console.log("No more opportunities to display.");
    }
}

