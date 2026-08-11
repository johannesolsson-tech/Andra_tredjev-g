# Lanista Våg-bot v1

## Railway Variables
DISCORD_TOKEN
WAVE_CHANNEL_ID
UPDATE_SECRET
SEASON_START=YYYY-MM-DD

För aktuell säsong:
SEASON_START=2026-08-24

## Fasta offsets från säsongsstart
Människa: Andravåg +12, Tredjevåg +22
Alv: +1, +16
Dvärg: +12, +22
Ork: +12, +23
Goblin: +12, +25
Troll: +12, +23
Salamanth: +12, +25

Odöd saknade vågdatum i underlaget och klassificeras inte.

## Klassificering
Andravåg = created_at från Andravågsdatum till dagen före Tredjevåg.
Tredjevåg = created_at från Tredjevågsdatum och framåt.
Före Andravågsdatum visas inte.

## Edge
Öppna bookmarklet-generator.html.
Fyll i Railway URL + UPDATE_SECRET.
Spara javascript-koden som favorit.
Klicka favoriten när du är inloggad på beta.lanista.se.

## Discord-behörigheter
View Channel
Send Messages
Read Message History
