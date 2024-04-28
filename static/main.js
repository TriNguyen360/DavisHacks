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

