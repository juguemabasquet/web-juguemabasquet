# Juguem a Bàsquet 🏀

Web de l'associació **Juguem a Bàsquet**, que lluita per tenir pistes més dignes a Badalona.

🌐 Producció: https://juguemabasquet.org/

---

## Entorn de desenvolupament

### Requisits

- [Node.js](https://nodejs.org/) (v18 o superior)

### Instal·lació

```bash
npm install
```

### Iniciar servidor local

```bash
npm run dev
```

Obre automàticament http://localhost:3000 amb recàrrega en viu al guardar qualsevol fitxer.

---

## Workflow de canvis

1. Crea una branca nova a partir de `main`:
   ```bash
   git checkout -b millora/nom-del-canvi
   ```
2. Fes els canvis i prova'ls localment amb `npm run dev`
3. Fes commit dels canvis:
   ```bash
   git add .
   git commit -m "descripció del canvi"
   ```
4. Obre una Pull Request a GitHub perquè els organitzadors puguin revisar-la
5. Un cop aprovada, es fusiona a `main` i es publica a producció

---

## Estructura del projecte

```
juguemabasquet/
├── index.html            # Pàgina principal
├── form-3x3.html         # Formulari 3x3
├── jordi-fernandez.html  # Pàgina Jordi Fernández
└── assets/
    ├── fotos/
    ├── logos/
    ├── documents/
    ├── events/
    ├── entitats/
    ├── col·laboradors/
    ├── patrocinadors/
    └── mitjans/
```
