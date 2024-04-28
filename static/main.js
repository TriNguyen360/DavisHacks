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

function loadOpportunities() {
    fetch('/api/opportunities')
        .then(response => response.json())
        .then(data => {
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
        container.innerHTML = '<p>No more opportunities.</p>';
    }
}

function swipeEvent(action) {
    console.log(`Action: ${action} on event: ${opportunities[currentOpportunityIndex].organization_name}`);
    currentOpportunityIndex++;
    displayCurrentOpportunity();
}

document.addEventListener('DOMContentLoaded', function() {
    const likeButton = document.querySelector('.action-btn.like');
    const dislikeButton = document.querySelector('.action-btn.dislike');

    likeButton.addEventListener('click', () => swipeEvent('liked'));
    dislikeButton.addEventListener('click', () => swipeEvent('disliked'));

    loadOpportunities(); // Load opportunities when the document is ready
});
