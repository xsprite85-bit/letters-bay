# Letter Bay (מפרץ האותיות)

Adventure game that teaches Hebrew letters and reading (first for Lia, kindergarten; designed to grow to grade 1+).

- `index.html` – the complete, self-contained game (PixiJS is inlined, so it works offline except for Google Fonts). Open it in a browser, in landscape. On a portrait screen it rotates itself.
- `src/game-src.html` – readable source (PixiJS loaded from a CDN tag). `src/build.py` inlines PixiJS 8.21.0 to produce `index.html`.

Content: 7 chapters, 22 letters (מ ב א / ש ל ר / ד ג ה / נ ת ו / כ פ ח / ס ע ק / ז ט י צ). Each letter: listen, catch in bubbles, trace, word with picture. Each chapter: story episode with narrated nikud text, treasure chest, cliffhanger. Procedural adventure music that follows the story. "בחירת פרק" on the title screen jumps to any chapter.

## Daily voice run
Recorded narration (Gemini TTS, voice Kore) is generated a little each day inside the free quota:
```
cd src/voice && GK=<gemini key> python3 daily_voice.py   # records missing clips, writes clips/*.mp3 + *.json and report.json
cd .. && python3 build.py && cp index-pages.html ../index.html   # letter-bay-game.html is the Claude artifact version
```
`build.py` embeds every clip whose text matches a narrated line. Word timings come from the Hebrew whisper model (ivrit-ai/whisper-large-v3-turbo-ct2).
