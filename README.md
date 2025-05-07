Prosty bot do automatycznego rozwiązywania sesji na stronie [instaling.pl](https://instaling.pl).

# Instrukcja używania:
## 1. Otwórz konsolę twojej przeglądarki
### Chrome, Edge, Opera
- Windows
    - Naciśnij <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>J</kbd>
- Mac
    - Naciśnij <kbd>Cmd</kbd> + <kbd>Opt</kbd> + <kbd>J</kbd>
### Firefox
- Windows
    - Naciśnij <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>K</kbd>
- Mac
    - Naciśnij <kbd>Cmd</kbd> + <kbd>Opt</kbd> + <kbd>K</kbd>
## 2. Wklej ten skrypt i naciśnij <kbd>Enter</kbd>
```javascript
fetch(`https://raw.githubusercontent.com/sigaj/instaling-bot/refs/heads/main/instaling.js`)
	.then((response) => response.text())
	.then((data) => eval.call(window, data));
```