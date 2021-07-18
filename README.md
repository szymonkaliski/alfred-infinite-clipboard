# `alfred-infinite-clipboard`

[Alfred's Clipboard History](https://www.alfredapp.com/help/features/clipboard/) is pretty cool, but lasts only for at most 3 months.

`alfred-infinite-clipboard` is a way to infinitely backup and search that history data from CLI. It works by copying clipboard data from Alfred into a separate SQLite database.

## Installation

`npm install -g alfred-infinite-clipboard`

## Usage

1. `alfred-infinite-clipboard backup` - backups Alfred Clipboard History to a separate database - you should run this periodically, I have a [Launch Daemon](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html) that runs it every day
2. `alfred-infinite-clipboard search [term]` - searches the DB and displays the results - I'm not super happy in how it looks, and probably (ND)JSON output would be a good idea

## Notes

Not terribly well tested, but works for me on macOS 11.4 Big Sur and Alfred 4.5.


