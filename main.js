document.addEventListener('DOMContentLoaded', function() {
    const words = document.querySelectorAll('.word');
    let index = 0;

    function showWord() {
        // Show current word
        words[index].style.display = 'block';

        // If not the first word, hide the previous word
        if (index > 0) {
            words[index - 1].style.display = 'none';
        }

        // Increment index
        index++;

        // Reset index to 0 if it reaches the end of the words array
        if (index >= words.length) {
            index = 0;
            // Hide the last word ("Disaster Relief") after the first cycle
            setTimeout(() => {
                words[words.length - 1].style.display = 'none';
            }, 2000); // Hide after 2 seconds
        }

        // Call showWord recursively after a delay
        setTimeout(showWord, 2000); // Adjust this value to control the duration of each word
    }

    // Start showing words
    showWord();
});
