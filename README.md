# Practice Hacks

Practice versions of FiveM server hacking minigames, hosted with GitHub Pages.

## Games

### Bobcat
| Game | Folder | Description |
|------|--------|-------------|
| Hex Sequence | [`sequence/`](sequence/) | Enter a 4-code sequence on a 5×5 grid: 1→2 same column, 2→3 same row, 3→4 same column. |
| Thermite | [`thermite/`](thermite/) | Memorize where the shuffling squares end up on a 7×7 grid, then click them all. |
| USB Drive – Ring Match | [`usb/`](usb/) | Type the listed terminal commands, then match 4 signature rings (inner to outer) by cycling 5 fragments per ring. |

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

### Vangelico
| Game | Folder | Description |
|------|--------|-------------|
| Connect the Dots | [`dots/`](dots/) | From a random start dot, always click the closest unconnected dot. 2 phases of 10 dots; one wrong click fails. |
| Door Panel | [`door/`](door/) | Keys fall one or two at a time; hold pairs together before they reach the bottom. 2 phases of 10 keys; one wrong key fails. |
| Back Safe | [`vsafe/`](vsafe/) | Memory match on a 4×4 grid of 8 icon pairs. 2 phases, no fail – tracks time and misses. |

### Fleeca Bank
| Game | Folder | Description |
|------|--------|-------------|
| VAR (Order) | [`var/`](var/) | Memorise 8 numbered squares in 3s, then click them 1→8 while they drift blank. 1 phase, 20s, one wrong click fails. |

## Adding a game

1. Put the game in its own folder as `index.html` (e.g. `lockpick/index.html`). Each game is a single self-contained HTML file.
2. Add an entry to the `GAMES` list in the root `index.html`, with `job` set to the job it belongs to (add the job to `JOBS` if it's new).
3. Add a row to the matching job table above.

## Sound

All games share `sfx.js`, which synthesizes every sound effect with the Web Audio API (no audio files).
Each game shows a mute button and volume slider in the bottom-right corner (or press **M**); the setting is shared across all games.
To add sound to a new game, include `<script src="../sfx.js"></script>` and call `SFX.play('ok')`, `SFX.play('bad')`, `SFX.play('win')` etc.

## Third-party code

`vendor/three.min.js` is [three.js](https://threejs.org/) r128, MIT licensed (see `vendor/three.LICENSE`).

## Hosting

Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
The site is then served at `https://notnilsson.github.io/practice-hack/`.

Fan-made practice tools. Not affiliated with FiveM, Rockstar Games or any server.
