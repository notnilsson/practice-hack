# Practice Hacks

Practice versions of FiveM server hacking minigames, hosted with GitHub Pages.

## Games

### Bobcat
| Game | Folder | Description |
|------|--------|-------------|
| Hex Sequence | [`sequence/`](sequence/) | Enter a 4-code sequence on a 5×5 grid: 1→2 same column, 2→3 same row, 3→4 same column. |

### Arms Deal
| Game | Folder | Description |
|------|--------|-------------|
| Dark Maze | [`maze/`](maze/) | Drag the ball through a maze you can only see around you and find the corner exit before time runs out. |

### Dark Queue
| Game | Folder | Description |
|------|--------|-------------|
| Align the Columns – Dark Queue Crate Hack | [`columns/`](columns/) | Click when each column's moving gap lines up with the horizontal line. Misses cost time. |

### 24/7 Store Safe
| Game | Folder | Description |
|------|--------|-------------|
| Ball Gate | [`safe/`](safe/) | Hold left click to open the gate for orange balls, release to block red ones. 3 phases; any mistake fails instantly. |

## Adding a game

1. Put the game in its own folder as `index.html` (e.g. `lockpick/index.html`). Each game is a single self-contained HTML file.
2. Add an entry to the `GAMES` list in the root `index.html`, with `job` set to the job it belongs to (add the job to `JOBS` if it's new).
3. Add a row to the matching job table above.

## Hosting

Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
The site is then served at `https://notnilsson.github.io/practice-hack/`.

Fan-made practice tools. Not affiliated with FiveM, Rockstar Games or any server.
