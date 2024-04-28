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

document.addEventListener('DOMContentLoaded', function() {
    const likeButton = document.querySelector('.action-btn.dislike');
    const currentEvent = document.querySelector('.explore-container.explore-page');
    const newEvent = document.querySelector('.new-event');

    likeButton.addEventListener('click', function() {
        // Trigger the swipe right and up animation
        currentEvent.style.animation = 'swipeLeftUp 0.5s forwards';

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

    dislikeButton.addEventListener('click', function() {
        // Trigger the swipe left and up animation
        currentEvent.style.animation = 'swipeLeftUp 0.5s forwards';

        // After the animation ends, hide the current event and show a new event
        currentEvent.addEventListener('animationend', function() {
            currentEvent.style.display = 'none';
            // Reset the animation so it can be triggered again later
            currentEvent.style.animation = '';

            // Show and animate the new event, assuming you've set this up to point to a new event
            newEvent.style.display = 'flex';
            newEvent.style.animation = 'growIn 0.5s forwards';
    }, { once: true });
});
});
