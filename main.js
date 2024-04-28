document.addEventListener('DOMContentLoaded', function() {
    const words = document.querySelectorAll('.word');
    let index = 0;

    function showWord() {
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

    showWord();
});
