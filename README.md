# Quiz Patente A/B

I quiz sono aggiornati al 2023. Il file `quizPatenteB2023.json` contiene 7139 domande, fra cui ~3983 con immagini. Le immagini si trovano nella cartella `img_sign`. L'intero merito per il file JSON e per le immagini dei quiz va all'user [@Ed0ardo](https://github.com/Ed0ardo).

Questa Webapp riusa i quiz e permette di allenarcisi selezionando categoria, sottocategoria e dando feedback delle risposte.
Sito: [https://privitorta.github.io/QuizPatenteA-B/](https://privitorta.github.io/QuizPatenteA-B/)

![](/assets/screenshot1.png)
![](/assets/screenshot2.png)

## Struttura

- `index.html` — interfaccia  web
- `css/styles.css` — stile
- `js/app.js` — caricamento JSON, popolamento categorie/sottocategorie, esecuzione
- `quizPatenteB2023.json` — dataset domande
- `img_sign/` — immagini referenziate dalle domande

## Utilizzo
Disponibile su GitHub Pages al link [https://privitorta.github.io/QuizPatenteA-B/](https://privitorta.github.io/QuizPatenteA-B/), altrimenti basta servire la cartella con un semplice server statico. Ad esempio se hai Python installato, esegui nella cartella dove hai clonato la repo:

```bash
python -m http.server 8000
```

Poi apri il browser su:

```
http://localhost:8000
```

Puoi usare qualsiasi altro server statico (Live Server di VS Code, `npx http-server`...), va bene lo stesso.
