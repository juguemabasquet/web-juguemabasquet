# Inventari complet de pistes públiques de Badalona

## Objectiu

Passar de les 11 pistes del mapa (`assets/js/map.js`, constant `PISTES`) a les 42 de l'inventari
`Inventari_pistes_publiques_basquet_Badalona.docx` (+ la pista dels Carmelites, que no hi surt perquè és cedida).

## Decisions

- **Base**: les pistes que ja hi ha a la web. En cas de discrepància (adreça, barri), mana la web.
- **Format intermedi**: un JSON (`assets/data/pistes.json`) amb `nom`, `barri`, `adreca`, `coords`, `estat`,
  `descripcio` (+ `descripcio_es`, `descripcio_en`, com a la web) i `num` (número de l'inventari, per traçabilitat).
- **Coordenades**: cercades amb OpenStreetMap (Nominatim), prioritzant plaça/parc quan l'inventari en dona.
  Les que només tenen el carrer es marquen per revisar a mà.
- **Nom per defecte**: el de l'inventari si en té; si no, "Pista " + plaça/parc/carrer.
- **Estats nous**:
  - `sense_valorar` — pistes no visitades encara (color neutre).
  - `desapareguda` — pistes que ja no existeixen (#13 Iris Sol, #32 Alfons XII Sant Roc, #34 Carrer de París).
- **Descripció**: només les notes de l'inventari ("Cistella mini", "Pista de sorra"), traduïdes a ca/es/en.

## Correspondència web ↔ inventari

| Web | Inventari |
|---|---|
| Pista dels Carmelites Descalços | — (no hi surt; es manté) |
| Pista Iris-sol-casagemes | #13 → passa a `desapareguda` |
| La gàbia | #02 |
| la Baixadeta | #25 |
| Can soley i Ca l'arnús | #16 |
| Pista Joaquim Ruyra | #09 |
| Pista Plaça Joan Miró | #12 |
| Pista Plaça Pompeu Fabra | #19 |
| Pista La Mora | #31 |
| Plaça d'Oriol Martorell | #14 |
| Plaça Països Catalans | #20 |

## Coordenades (pas 2)

Mètode: s'han descarregat de l'Overpass totes les pistes de bàsquet cartografiades a OSM a Badalona (117 elements)
i s'han creuat amb la geometria de cada carrer/plaça de l'inventari (Nominatim + Overpass). S'han descartat les
marcades `access=private` (escoles, clubs).

| Confiança | Núm. | Criteri |
|---|---|---|
| Alta | 1, 3, 8, 11, 15, 17, 18, 22, 23, 26, 27, 28, 30, 33, 34, 37, 38, 40, 42 | Pista d'OSM a < 40 m del carrer/plaça |
| Mitjana | 36, 39 | Pista d'OSM a 50–70 m, o més d'una candidata |
| Baixa | 4, 5, 6, 7, 21, 24, 29, 32, 35, 41 | Sense pista a OSM: punt del carrer/plaça/parc (pot estar a centenars de metres) |

Notes:
- #10 (Alfons XII, Sant Jaume): **retirada** a `assets/data/pistes-pendents.json` fins que es localitzi. A OSM, les úniques pistes a tocar d'Alfons XII són dins d'escoles
  (Sant Domènec Savio, Maristes Champagnat, EOI) o la de Plaça Països Catalans (#20). "Sant Jaume" no és cap barri
  oficial d'OSM. Les coordenades actuals cauen dins de l'escola Sant Domènec Savio: cal que algú del barri la localitzi.
- #6 i #42 (Bonavista) apunten a la mateixa pista d'OSM; s'ha assignat a #42 (plaça a 12 m) i #6 queda al punt del carrer.
- #26 (Mateu Rotger) i Iris Sol **no són la mateixa** (confirmat per l'usuari): Mateu Rotger és una pista de carrer;
  Iris Sol és tancada, de l'associació, i la comparteixen equips de futbol.
- #40 (Plaça dels Músics): la primera candidata era dins de l'Escola Folch i Torres. Corregit a la
  "Pista Poliesportiva La Pau" d'OSM (multiesport), al centre de la plaça: 41.45145, 2.22197.
- Els barris de les pistes noves són els de l'inventari; els de les 11 existents, els de la web.

## Passos

1. ✅ Desar aquest pla.
2. ✅ Generar `assets/data/pistes.json` (42 pistes: 11 de la web + 31 noves). La #10 queda apartada a `assets/data/pistes-pendents.json`.
3. Revisió de l'usuari de les coordenades de confiança mitjana/baixa.
4. ✅ Integrar a la web (branca `feature/inventari-pistes`):
   - `map.js` carrega `assets/data/pistes.json` (`fetchPistes()`, una sola petició compartida amb `informe-modal.js`);
     s'elimina la constant `PISTES`. `pais`/`ciutat` s'afegeixen per defecte (Espanya / Badalona).
   - Estats nous `sense_valorar` (marcador blanc/gris clar) i `desapareguda` (marcador gris fosc, semitransparent;
     a la llista, nom ratllat i al final). Textos ca/es/en, filtres nous al mapa.
   - El comptador "Pistes al mapa" no compta les desaparegudes.
   - Pendent: els filtres de l'informe de catalogació encara són només Totes/Bon/Regular/Malmesa.
5. Revisió visual de l'usuari (`npm run dev`: amb `file://` el JSON no es pot carregar).

## Revisió amb l'usuari (estat a 27/11/2026)

**Ubicacions validades amb enllaç de Google Maps**: #4 Regalèssia, #7 Camí de Sistrells, #29 Torrents i Lladó,
#21 Sant Jeroni de la Murtra (barri canviat a Montigalà; l'inventari deia Canyet), #24 Murillo, #35 Doctor Bassols, #41 Gran Sol,
#5 Poli Verde ("Pista Verde" a Google, coincideix amb la "Pista poliesportiva Ronda Llefià" d'OSM).

**Retirada a `pistes-pendents.json`**: #6 Eliseu Meifrèn, duplicat de la #42 (mateix carrer, confirmat per l'usuari).

#32 Alfons XII Sant Roc: desapareguda, es deixa amb punt aproximat.

**Estats i descripcions presos d'OSM** (fitxes MapComplete, validats amb l'usuari): #3, 4, 7, 11, 18, 22, 23, 26, 30, 33,
38, 42. A la #7 es va treure la dada de les cistelles; a la #30 es deixa fora, a propòsit, el comentari sobre la polèmica veïnal.

La Gàbia (#2): es manté "bon estat"; l'han reformat fa poc (OSM no està al dia).

**Lliçons**
- OSM etiqueta moltes pistes com a `sport=multi` (poliesportiva) i no com a bàsquet: cal buscar-les totes.
- `access=private` no vol dir sempre escola (la #7 és de gestió veïnal), i a l'inrevés: pistes d'escola sense `access=private`.

**Pendent**
- **Pistes que cauen dins d'una escola** (comprovació automàtica contra els 98 recintes educatius i poliesportius
  d'OSM a Badalona, 28/11/2026). De moment es deixen tal com estan, per decisió de l'usuari:
  - #27 Manuel Moreno Mauricio → Escola Montigalà. L'altra candidata d'OSM és privada.
  - #36 Passatge dels Encants → Institut Enric Borràs. Les altres pistes del voltant són de l'Institut Escola Turó d'en Caritg.
  - #39 Pablo Picasso → Escola Pau Picasso. Una altra és de l'Institut Pau Casals. Única candidata pública:
    poliesportiva a ~100 m (41.44928, 2.22517), sense confirmar que sigui de sorra.
  - #34 Carrer de París (desapareguda) → Escola Rafael Casanova.
  - Proposta pendent: apartar #27, #36 i #39 a `pistes-pendents.json` si no se'n troba la ubicació real, i moure
    la #34 a un punt del carrer.
  - Límit: només detecta escoles que tenen el recinte dibuixat a OSM.
- Sense valorar i sense dades a OSM: #1, 5, 8, 15, 17, 21, 24, 27, 28, 29, 35, 36, 37, 39, 40, 41.
- #10 Alfons XII "Sant Jaume", a `pistes-pendents.json`.
- Filtres de l'informe de catalogació per als estats nous.
- Revisió visual i merge de la PR #28.
