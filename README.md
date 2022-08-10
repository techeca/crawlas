# Crawlas - Dofus enciclopedia parser.
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

Este proyecto fue creado utilizando Crawlit como base, estructura, lógica, etc.\
Se utiliza Puppetter para realizar solicitudes y obtener datos.\
Idioma Español agregado.

**Spanish - French - English**

Puedes encontrar los repositorios de Crawlit y Puppeteer aquí.
[Crawlit](https://github.com/dofapi/crawlit-dofus-encyclopedia-parser)
[Puppeteer](https://github.com/puppeteer/puppeteer)

08/08/2020\
Por el momento se puede extraer:

-Solo Dofus

Mascotas (falta agregar set relacionado)\
Idolos\
Arreos (falta como puede conseguirse)\
Monturas (falata agregar de donde se obtiene, nacido de cruce)\
Recursos\
Monstruos (falta separar objetos dropeables con condiciones, no se estan obteniendo nombres de items sin links)\
Consumibles (falta "se utiliza para las recetas")\
Armas (falta condiciones, setID)\
Set (falta todos los bonus de set y bonus total)\
Equipables (completo ? no todos los items testeados)\
Merkasakos (falta muebles, decoracion, suelo)\
Clases (falta estadísticas de cada hechizo)\
Profesiones (falta agregar cantidad necesaria de cada item para receta)

## Errores

Hay algunos links que están caídos o items que no tienen detalles/nombre/imagen, se rellena con datos disponibles.\
Puede que chronium no carge la página y envíe error por timeout, solo debe intentar nuevamente.

**El proceso de resumen no funciona correctamente**

## Instalar

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
