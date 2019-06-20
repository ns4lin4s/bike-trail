## Version 1.0.0

- Se agrega MapBox con las estaciones de bicicletas.
- Se aplica clustering al mapa (similar a un mapa de calor).
- Se agrega detalle de la estación (las últimas bicicletas disponibles y ocupadas).
- Se agrega filtro por estación.
- Se agrega gráfico de línea de tiempo.
- Se agrega gráfico de torta.
- Se agrega gráfico de barras.

## TODOs:

- Filtrar en el mapa por estación.
- Predecir, ¿Cuántas bicicletas disponibles tendrá X estación? (regresión lineal)

## Arquitectura

![arquitectura](https://github.com/ns4lin4s/bike-trail/blob/master/screenshot/arquitectura.png)


## ¿De qué se compone la app?
* [express - 4.x](https://github.com/strongloop/express) server side
* [react-engine - 4.x](https://github.com/paypal/react-engine) motor de vistas
* [react - 16.x](https://github.com/facebook/react) client side para construir el UI
* [react-router](https://github.com/rackt/react-router) routing client side
* [webpack](https://github.com/webpack/webpack) realiza la minificación del código entre otras cosas..
* [babel](https://github.com/babel/babel) compila ES6/JSX code
* [mongodb](https://docs.mongodb.com) base de datos nosql

## Pre-requisitos

Para correr el ejemplo debes tener instalado lo siguiente:

* [docker-compose](https://docs.docker.com/compose/install/)

## Para correr el ejemplo
```shell
$ docker-compose up
$ open http://localhost:3000/
```
## Screenshot

![dashboard](https://github.com/ns4lin4s/bike-trail/blob/master/screenshot/screen_dashboard.png)
