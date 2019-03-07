# Práctica de emisión y vigilancia de rutas.

![Capturas de pantalla](https://user-images.githubusercontent.com/32760027/53925167-9a2b6600-4044-11e9-9541-dfd8594508e2.jpg)

Aplicación en la que un usuario a la vez emite su ubicación cada 5 metros, mientras que otras personas visualizan en tiempo real, su recorrido.

Complementos usados:

 Nombre  | Uso | Ubicación en el código 
 ------------- | ------------- | ------------- 
 [BackgroundGeolocation](https://ionicframework.com/docs/native/background-geolocation) (versión @beta) | Detectar en primer y segundo plano, cada vez que el usuario se mueva 5 metros, para envíar sus coordenadas a la nube. | \src\app\emitir\emitir.page.ts 
 [Firebase](https://npmjs.com/package/firebase) | Base de datos en la nube, en la que se guardan y leen las coordenadas del usuario vigilado. | \src\app\app.component.ts (llaves), \src\app\emitir\emitir.page.ts y \src\app\vigilar\vigilar.page.ts
 [Network](https://ionicframework.com/docs/native/network) | Detectar si hay internet, si no es así, se bloquea el acceso a las páginas 'emitir' y 'vigilar'. | \src\app\home\home.page.ts 
 
 Información del autor:
```
UNIVERSIDAD POLITÉCNICA DE CHIAPAS
INGENIERÍA EN DESARROLLO DE SOFTWARE
Desarrollo de aplicaciones móviles – Corte 2

Javier Alberto Argüello Tello – 153217 – 8º
6 de marzo del 2019
```
