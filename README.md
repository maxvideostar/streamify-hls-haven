# NetStreaming Live TV (streamify-hls-haven)

Front-end React + hls.js pentru canalele live de pe netstreaming.eu.
Lista de canale se încarcă **la runtime**, deci poți adăuga sau schimba canale fără rebuild.

## Configurare canale

Editează `public/channels.json` (după build, fișierul ajunge în `dist/channels.json`):

```json
{
  "playlist": "",
  "channels": [
    { "id": "astv", "name": "ASTV", "group": "Live TV",
      "url": "https://netstreaming.eu/astv.m3u8",
      "logo": "https://netstreaming.eu/logo/astv.png",
      "description": "" }
  ]
}
```

- `id` apare în URL: `/player/astv`
- `group` grupează canalele pe pagina principală și în Multi-view
- `logo` și `description` sunt opționale

**Variantă M3U:** pune un URL în `"playlist"`. Se citesc `tvg-id`, `tvg-logo` și `group-title`, iar canalele se adaugă după cele din `channels`.
Poți chiar să faci build cu `VITE_CHANNELS_URL=https://.../lista.m3u` și să sari complet peste JSON.

> Serverul HLS trebuie să trimită `Access-Control-Allow-Origin` dacă site-ul e pe alt domeniu.
> Dacă folosești `secure_link`, URL-urile din JSON/M3U trebuie să fie deja semnate. Altfel, generează lista dinamic pe server.

## Rulare

```sh
npm i
npm run dev      # http://localhost:8080
npm run build    # output în dist/
```

## Deploy nginx (SPA)

```nginx
location / {
    root /var/www/streamify/dist;
    try_files $uri /index.html;
}
location = /channels.json {
    root /var/www/streamify/dist;
    add_header Cache-Control "no-store";
}
```

## Funcții

- Pagina principală cu canalele grupate
- Player individual (`/player/:id`) cu auto-reconectare când semnalul cade
- Multi-view (`/multi-player`) cu grilă 1–4 coloane, filtru pe grup și căutare, toate pornite pe mut
