# Crawlas - Dofus enciclopedia parser.
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

Este proyecto fue creado utilizando:
- Crawlit como base, estructura, lógica, etc.
- Puppetter para realizar solicitudes y obtener datos.

Puedes encontrar los repositorios de Crawlit y Puppeteer aquí.\
[Crawlit](https://github.com/dofapi/crawlit-dofus-encyclopedia-parser)\
[Puppeteer](https://github.com/puppeteer/puppeteer)

## Características
**Spanish - French - English**

**Último update 08/08/2020**

**Juegos**\
Solo `Dofus` (por el momento)

## Items soportados

| Items       | Falta       |
| ------------- |:-------------|
| `Mascotas`     |   100%  |
| `Idolos`     |  100%  |
| `Arreos`     |   100%  |
| `Monturas`     |  100%  |
| `Recursos`     |  100%  |
| `Monstruos`     |   100%  |
| `Consumibles`     |  100% |
| `Armas`     |  100%  |
| `Set`     |   100%  |   
| `Equipables`     |  100% |
| `Merkasakos`     |  Muebles, decoracion, suelo (todo :p) |
| `Clases`     |  Descripción, Estadísticas de cada hechizo por lv |
| `Profesiones`     |  Cantidad necesaria de cada item para receta |

**EN - FR no testeadas**

## Data

JSON Files (backups)

- Mascotas
- Idolos
- Arreos
- Monturas
- Armas (Sword, Dagger, Axe, Bow, Hammer, Scythe, Shovel, Soul Stone, Staff, Tool, Wand)
- Equipos (Amulet, Backpack, Belt, Boot, Cloak, Dofus, Helmet, Ring, Shield, Trophy)
- Monstruos
- Sets
- Recursos
- Consumibles
- Profesiones

## Errores

- Hay algunos links que están caídos o items que no tienen detalles/nombre/imagen, se rellena con datos disponibles.
- Puede que chronium no carge la página y envíe error por timeout, solo debe intentar nuevamente.

**No todas la categorias de Weapons y Equipments han sido testeadas**

## Instalación

``` bash
git clone http://#
cd crawlas
```

**1) Instalar dependencias con npm :**

``` bash
npm install
```

**2) En la raíz del proyecto :**

``` bash
npm run start
```


## JSON format
Igual que en Crawlit en `/data/` se encuentra la información descargada.\
Se mantiene la misma estructura para items, posiblemente algunas cambien para agregar nuevos datos.

```json
{  
  "_id":"null : represent yourdb id",
  "ankamaId": "item id",
  "name":"item name",
  "description":"item description.",
  "lvl":"item lvl",
  "type":"item type",
  "imgUrl":"image url of the item",
  "url":"Item's link",
  "stats":[ "many statistics line", "stat 2", ["..."], "stat n" ],
  "condition":[ "many conditions line", "condition 2", ["..."], "condition n" ],
  "set":{  
     "equipments":[itemId, itemId ...],
     "weapons":[itemId, itemId ...],
  }
}
```
