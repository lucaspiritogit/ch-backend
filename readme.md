# Coderhouse | Back-end

A partir de la clase 30 se introdujo nginx para utilizar como balanceador de carga junto a forever y pm2.

## Comandos para iniciar la aplicacion

El servidor se puede levantar de las siguientes maneras:

### Forever

- `npm run forever`
  Inicia el servidor con forever en modo cluster
- `npm run foreverStop`
  Stoppea todas las instancias forever del servidor.

### PM2

- `npm run pm2Fork`
  Inicia el servidor con PM2 en modo fork junto a 2 instancias en los puertos 8080 y 8081 dandole mas peso al 8080

- `npm run pm2Cluster`
  Inicia el servidor con PM2 en modo cluster a partir del puerto 8080

- `npm run pm2Stop`
  Stoppea todas las instancias PM2 activas

## package.json

```js
  "scripts": {
      "start": "nodemon --experimental-json-modules app.js",
      "dev": "node app.js",
      "forever": "forever start app.js -m 'cluster' --watch",
      "foreverStop": "forever stopall",
      "pm2Fork": "pm2 start app.js --name='ForkServer' --watch -- 8080 & pm2 start app.js --name='ForkServer2' --watch -- 8081",
      "pm2Cluster": "pm2 start app.js --name='Server1' -i max --watch -- 8080",
      "pm2Stop": "pm2 kill",
    }
```
