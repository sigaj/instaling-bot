const answerInput = document.querySelector('input#answer');
const submitAnswerButton = document.querySelector('div#check');
const nextWordButton = document.querySelector('div#nextword');

//todo kurwa opcje
let autoCompleteSession = true;
let delayBetweenAnswers = 2500;

if (!Storage.prototype.getObject) {
    Storage.prototype.getObject = function(key) {
        const value = this.getItem(key);
        return value && JSON.parse(value);
    }
}

if (!Storage.prototype.setObject) {
    Storage.prototype.setObject = function(key, value) {
        this.setItem(key, JSON.stringify(value));
        return value;
    }
}

if (!localStorage['words']) {
    localStorage.setObject('words', []);
}

function saveWordToLocalStorage(_word) {
    const words = localStorage.getObject('words');
    let word = null;
    if (localStorage.getObject('words').length > 0) {
        word = words.find(wrd => wrd.id === _word.id);
    }

    if (!word) {
        words.push(_word);
        localStorage.setObject('words', words);
    }
}

function getWordFromLocalStorage(_word) {
    const words = localStorage.getObject('words');
    let word = null;
    if (localStorage.getObject('words').length > 0) {
        word = words.find(entry => entry.id === _word.id);
    }
    return word;
}

if (!window.location.href.startsWith('https://instaling.pl/ling2/html_app/app.php')) {
    alert('Skrypt musi zostac wykonany na stronie startowej sesji instaling.');
    throw new Error('Skrypt musi zostac wykonany na stronie startowej sesji instaling.');
}

if (getComputedStyle(document.querySelector('div#start_session_page')).display !== 'none') {
    document.querySelector('div#start_session_button').click();
} else if (getComputedStyle(document.querySelector('div#continue_session_page')).display !== 'none') {
    document.querySelector('div#continue_session_button').click();
}

if (autoCompleteSession) {
    submitAnswerButton.style.display = 'none';
    nextWordButton.style.display = 'none';
}

function getNextWord() {
    $.ajax({
        url: '../server/actions/generate_next_word.php',
        type: 'POST',
        dataType: 'json',
        data: {
            child_id: currentChildId,
            date: new Date().getTime()
        },
    }).done((data) => {
        if (typeof data.id == 'undefined') {
            finishPageShow(data.summary);
        } else {
            learningPageShow(data.id, data.speech_part, data.usage_example, data.translations, data.word, data.has_audio, data.audio_file_name, data.is_new_word, data.type == 'marketing');

            answerInput.placeholder = 'Ładowanie odpowiedzi...';
            const localStorageWord = getWordFromLocalStorage(data);

            if (localStorageWord) {
                answerInput.value = `${localStorageWord.word}`;
                completeAnswer();
            } else {
                fetch(`https://sigaj.ga/instaling/words.php?word_id=${data.id}`, {})
                    .then((response) => response.json())
                    .then((res) => {
                        if (res.word !== null) {
                            saveWordToLocalStorage(res);
                            answerInput.value = `${res.word}`;
                        } else {
                            alert(`ACHTUNG BŁĄD! nie znaleziono slowa (${data.id})... zglos tutaj: https://github.com/sigaj/instaling-bot/issues`);
                        }
                    }).catch(error => {
                        alert('Błąd podczas pobierania danych słowa.');
                        console.error('Error fetching word data:', error);
                    }).finally(() => {
                        completeAnswer();
                    });
            }
        }
    }).error(() => {
        alert('Błąd połączenia');
    });
}

function completeAnswer() {
    answerInput.placeholder = 'Odpowiedź';
    if (autoCompleteSession && answerInput.value !== '') {
        setTimeout(() => {
            submitAnswerButton.click();

            const interval = setInterval(() => {
                if (getComputedStyle(nextWordButton.parentElement).display !== 'none') {
                    clearInterval(interval);
                    setTimeout(() => {
                        nextWordButton.click();
                    }, random(900, 1500));
                }
            }, 100);
        }, random(delayBetweenAnswers - 250, delayBetweenAnswers + 250));
    }
}

function learningPageShow(id, speechPart, usageExample, translations, word, has_audio, audio_file_name, is_new_word, is_marketing) {
    $('.speaker').hide();
    $('#question_speaker').hide();
    $('#question_speaker').off('click');
    $('#answer').off('keyup');
    $('body').off('keyup');
    $('#answer').off('enterKey');
    $('.speaker').off('click');
    $('#check').off('click');
    $('#show').off('click');
    $("#new_word_form .big_button").off("click");
    
    $('.translations').html(translations);
    $('.usage_example').html(usageExample);
    $('.speech_part').html(speechPart);
    
    $('#loading').hide();
    $('.back').show();
    $('#learning_page').show();

    show_learning_form(id);
    
    setAudioEmpty();

    if (currentLanguageId == ORT_LANG_ID && has_audio ) {
        setAndPlayAudio(id);
        $("#question_speaker").show();
        $("#question_speaker").click(function() {
            playAudio();
        });
    }
}

document.addEventListener('paste', (e) => {
    e.stopImmediatePropagation();
}, true);

function random(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
}
