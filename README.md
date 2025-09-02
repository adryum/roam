# website

## Izmantotās tehnoloģijas
### Server
freimworki - Express.js
<br>middleware - Molter
<br>db - MYSQL
<br>bilžu mākonis - Cloudinary

### Website
MVVM paterns - https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel 
<br>Valodas - HTML, CSS, SASS
<br>freimworki - Vue, Axios, FramerMotion

### Abos
Valoda - TypeScript
<br>Konfigurācija - .env

## Project Setup
Lai uzinstalētu visus vajadzīgos dependencijus Jums ROAM FOLDERA TERMINĀLĪ jeb NO PROJEKTA ROOT ir jāpalaiž šis divas komandas.

```sh
cd server && npm install
```
```sh
cd website && npm install
```

### Palaist mājaslapu
Lai palaistu mājaslapu palaidiet šo komandu WEBSITE FOLDERĪ.

```sh
npm run dev
```

### Palaist serveri
Lai palaistu mājaslapu palaidiet šo komandu SERVER FOLDERĪ.

```sh
npm nodemon src/index.ts
```




### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```
