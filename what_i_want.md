1) il programma è scritto in Go, deve avere un database liteSQL per il salvataggio dei dati
2) non è necessario nessun accesso, nessun login. L'utilizzatore decide/sceglie di avviare la webapp
3) attraverso la webapp, l'utente può aggiungere/modificare lo stato di lettura del proprio libro (Non Letto, Leggendo, Finito, Abbandonato) e la data di inizio
    a) può aggiungere una recensione/pensiero testuale
    b) può aggiungere un voto da 1 a 10
    c) può scrivere se gli andrebbe di rileggerlo in futuro o no
    d) può scrivere i generi del libro, il numero di pagine
4) alla chiusura/salvataggio il programma si occupa di aggiornare il readme, scrivendo la lista dei libri in ordine di tempo (dal più recente al meno recente)
5) In breve, è un 'portale' con cui aggiornare attraverso la propria repository la propria lista dei libri, poi può scegliere se renderla pubblica o meno

----
6) the app should be desktop-only
7) use timestamp, I like DD/MM/YYYY because i'm european
8) the user input the books, so it write down the author and the title. Keep it Simple!
9) allow duplicates
10) I have no experience in web-framework. Use the easiest
11) The readme should have a personalizable title, then down there is a simple grid.  The user can select which columns show or not on the README. Yes, the readme is also in the same repo where we will build this project
12) the webui must be simple
