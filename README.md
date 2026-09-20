# Aufgaben-Board mit Suche & Filter

Aufgaben als Kartenraster anzeigen,
per Freitext durchsuchen, nach Status und Priorität filtern sowie Aufgaben
anlegen, bearbeiten und löschen — alles im Client-State, ganz ohne Backend.

## Demo

<video src="demo-aufgaben-board.mp4" controls width="100%"></video>

## Voraussetzungen

- **Node.js 20 oder neuer** (LTS empfohlen) inkl. `npm`
  - Prüfen im Terminal: `node --version` und `npm --version`
  - Download: https://nodejs.org
- Kein Backend, keine Datenbank, kein Supabase nötig.

## Zum Laufen bringen (3 Schritte)

Im VS Code-Terminal oder in PowerShell,
jeweils im Ordner:

```powershell
# 1. Pakete installieren (nur beim ersten Mal nötig)
npm install

# 2. Entwicklungsserver starten
npm run dev
```

Danach steht im Terminal eine Adresse, z. B. `http://localhost:5173`.
Bei jeder gespeicherten Code-Änderung aktualisiert sich die Seite automatisch
(Hot Module Replacement, kein Neustart nötig).


## Weitere Befehle

| Befehl            | Was passiert                                              |
| ----------------- | --------------------------------------------------------- |
| `npm install`     | Installiert alle Pakete aus `package.json` (einmalig bzw. nach Pull) |
| `npm run dev`     | Startet den Entwicklungsserver mit Auto-Reload            |
| `npm run build`   | Type-Check (`tsc`) + Produktions-Build nach `dist/`       |
| `npm run preview` | Zeigt den Produktions-Build aus `dist/` lokal an          |
| `npm run lint`    | Prüft den Code mit Oxlint                                 |

## Projektstruktur

```
aufgaben-board/
├── index.html                  # HTML-Einstiegspunkt
├── package.json                # Pakete & Skripte
├── tsconfig*.json              # TypeScript-Konfiguration (strict)
├── vite.config.ts              # Vite-Konfiguration
└── src/
    ├── main.tsx                # React-Einstiegspunkt
    ├── index.css               # Neutrales Basis-Layout
    ├── App.tsx                 # Bindet das TaskBoard ein
    └── features/tasks/         # Die eigentliche Feature-Komponente
        ├── TaskBoard.tsx       # Suche, Filter, State, Übersicht
        ├── TaskBoard.css       # Alle Styles (gescoped, mit Dark Mode)
        ├── types.ts            # Datenmodell (Task, Status, Priorität)
        ├── tasksReducer.ts     # CRUD-Logik (add/update/delete)
        ├── validation.ts       # Formular-Validierung
        ├── utils.ts            # Suche (fold), Zähler, IDs, Datum
        ├── constants.ts        # Labels & Reihenfolgen
        ├── useDebouncedValue.ts# Debounce-Hook für die Suche
        ├── index.ts            # Öffentliche Exporte
        ├── data/
        │   └── tasks.json      # Datengrundlage (lokal, kein Backend)
        └── components/
            ├── TaskCard.tsx    # Aufgaben-Karte
            ├── TaskDialog.tsx  # Anlegen-/Bearbeiten-Dialog
            ├── ChipGroup.tsx   # Filter-Chips (Mehrfachauswahl)
            └── StatusGlyph.tsx # Status-Icon
```

## Funktionen

- **Anzeige:** Aufgaben als Kartenraster, neueste zuerst, mit Status,
  Priorität (Farbcodierung am Kartenrand) und Erstelldatum.
- **Suche:** Freitext über Titel und Beschreibung, mehrere Wörter werden
  mit UND verknüpft, Groß-/Kleinschreibung und Umlaute werden ignoriert
  („prasentation“ findet „Präsentation“). Eingabe ist per Debounce (200 ms)
  entprellt.
- **Filter:** Mehrfachauswahl per Chips für `status`
  (Offen / In Arbeit / Erledigt) und `priority` (Niedrig / Mittel / Hoch),
  jeweils mit Trefferzähler. Leere Auswahl = alles anzeigen.
- **CRUD im Client-State:** „Neue Aufgabe“ anlegen (Dialog mit Validierung:
  Titel 3–80 Zeichen Pflicht, Beschreibung max. 300 Zeichen), Bearbeiten,
  Löschen (mit Bestätigung) sowie Status per Klick auf das Kreissymbol
  weiterschalten. Es gibt kein Backend — nach einem Reload ist der
  Ausgangszustand aus `tasks.json` wiederhergestellt.
- **Darstellung:** Dark Mode automatisch per `prefers-color-scheme`,
  Tastatur- und Screenreader-freundlich (ARIA-Labels, Fokusführung).

## Daten

Die Datengrundlage ist **`src/features/tasks/data/tasks.json`**.
Jeder Eintrag hat diese Felder:

| Feld          | Typ                              | Beispiel                          |
| ------------- | -------------------------------- | --------------------------------- |
| `id`          | string (eindeutig)               | `"1"`                             |
| `title`       | string (3–80 Zeichen)            | `"Dark Mode implementieren"`      |
| `description` | string (max. 300 Zeichen, darf leer sein) | `"Theme-Umschaltung …"` |
| `status`      | `"open"` \| `"in_progress"` \| `"done"` | `"open"`                   |
| `priority`    | `"low"` \| `"medium"` \| `"high"` | `"medium"`                       |
| `createdAt`   | string (ISO-8601-Datum)          | `"2026-08-03T14:30:00.000Z"`      |


Eigene Startdaten verwenden: entweder `tasks.json` anpassen oder dem
Board andere Daten übergeben — `<TaskBoard initialTasks={meineTasks} />`.


## Technik

React 19 · TypeScript (strict) · Vite · CSS ohne Framework (Custom Properties).
Abhängigkeiten stehen in `package.json`; Dev-Pakete u. a. `typescript`,
`@types/react`, `@vitejs/plugin-react`, `oxlint`.
