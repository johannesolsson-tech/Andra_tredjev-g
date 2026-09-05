# Lanista Våg-bot v2

Nyheter:
- 6 dagars vågfönster via WAVE_WINDOW_DAYS=6.
- Bonusgrader efter + ignoreras helt vid jämförelsen. Exempel: 45+15 räknas som 45.
- Med MAX_LEVEL_BEHIND=10 får en grad 45-spelare gränsen 35; grad 35 visas, grad 34 filtreras bort.
- Andravåg och Tredjevåg jämförs separat.
- Visningen behåller t.ex. 45+15, men filtreringen använder endast basgraden 45.
- Varje gladiator skrivs på en enda rad.

Railway Variables:
DISCORD_TOKEN
WAVE_CHANNEL_ID
UPDATE_SECRET
SEASON_START=2026-08-24
WAVE_WINDOW_DAYS=6
MAX_LEVEL_BEHIND=10


## v2.2
- Varje gladiator renderas som en enda kompakt rad.
- Andravåg visar namn, ras, grad och startdatum.
- Tredjevåg visar endast namn, ras och grad.

## v2.3
- Byter numrering från `1.` till `1)` för att Discord inte ska tolka varje gladiator som ett Markdown-listobjekt och bryta metadata till nästa rad.

## v2.4
- Gäller endast Våg-botten.
- Vid varje uppdatering raderas tidigare vågmeddelande från botten.
- Därefter postas ett nytt vågmeddelande längst ner i kanalen.
- Topplista-botten påverkas inte.

## v2.5 – kompakt utskrift + alver separat
- Discord-utskriften visar bara rubrik, Andravåg/Tredjevåg och `Namn · Grad`.
- Alver räknas i ett eget -10-spann och påverkar inte övriga raser.
- Alla andra raser räknas tillsammans mot högsta basgrad, med `MAX_LEVEL_BEHIND=10`.
- Bonusgrader efter `+` ignoreras fortfarande vid filtreringen.
- Bookmarklet använder `lanista.se` och klan 5.
