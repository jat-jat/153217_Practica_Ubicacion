import { Component } from '@angular/core';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import {
  GoogleMaps, GoogleMap, GoogleMapsEvent
} from '@ionic-native/google-maps';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-vigilar',
  templateUrl: './vigilar.page.html',
  styleUrls: ['./vigilar.page.scss'],
})
export class VigilarPage {
  // Nombre de la base de datos en la nube.
  readonly DB_FIREBASE = 'prac_vigilar_ruta';

  mapa: GoogleMap;

  // Referencias a la base de datos de Firebase.
  refDB: firebase.database.Reference;
  refRoot: firebase.database.Reference;

  constructor(public navCtrl: NavController, private loadCtrl: LoadingController, private alertCtrl: AlertController) {
    this.inicializar();
  }

  async inicializar() {
    const msgCargando = await this.loadCtrl.create({
      message: 'Cargando...'
    });

    await msgCargando.present();

    this.refDB = firebase.database().ref(this.DB_FIREBASE);
    this.refRoot = firebase.database().ref();

    // 1.- SE CARGAN LOS PUNTOS QUE HAYA RECORRIDO EL USUARIO VIGILADO HASTA EL MOMENTO.
    // Se hace la petición a Firebase.
    this.refDB.once('value', snapshot => {
      // Primer punto de la ruta.
      let primerPunto = null;
      
      // Recorremos los puntos almacenados, buscando el primero.
      snapshot.forEach(childSnaphot => {
        if (primerPunto === null){
          primerPunto = childSnaphot.val();
        }
      });

      // Si no hay ningún recorrido almacenado en la nube, expulsamos al usuario de esta página.
      if (primerPunto === null) {
        msgCargando.dismiss();
        this.mostrarAlerta('Error', 'Nadie está haciendo un recorrido en este momento.');
        return;
      }

      // 2.- SE CREA EL MAPA.
      this.mapa = GoogleMaps.create('map_canvas', {
        camera: {
          target: primerPunto,
          zoom: 18,
          tilt: 0
        }
      });

      this.mapa.one(GoogleMapsEvent.MAP_READY)
        .then(() => {
          // 3.- SE DIBUJA EL INICIO DE LA RUTA DEL USUARIO VIGILADO.
          this.mapa.addMarkerSync({
            title: 'Inicio',
            icon: 'blue',
            animation: 'DROP',
            position: primerPunto
          });

          // 4.- SE CREA EL OBJETO QUE CONTIENE TODOS LOS PUNTOS DE LA RUTA Y DIBUJA LÍNEAS ENTRE ELLOS.
          const ruta = this.mapa.addPolylineSync({
            points: [primerPunto],
            color: '#ff0000',
            width: 10
          });
          
          // 5.- HACEMOS QUE SE DIBUJEN LOS NUEVOS PUNTOS DE LA RUTA, CONFORME SE AGREGUEN.
          this.refDB.on('child_added', child => {
            const nuevoPunto = child.val();

            ruta.getPoints().push(nuevoPunto);

            // Se enfoca el nuevo punto del recorrido.
            this.mapa.moveCamera({
              target: nuevoPunto
            });
          });

          // 6.- SE DEFINE EL EVENTO QUE SE SUSCITA CUANDO EL USUARIO VIGILADO TERMINÓ SU RUTA.
          this.refRoot.on('child_removed', snapshot => {
            if (snapshot.key === this.DB_FIREBASE){
              // Se eliminan los eventos.
              this.refDB.off();
              this.refRoot.off();

              // Se muestra una aleta que redireccionará al usuario a la página de inicio.
              this.mostrarAlerta('¡Enhorabuena!', 'El usuario vigilado terminó su recorrido.');
            }
          });

          msgCargando.dismiss();
        }).catch((e) => {
          msgCargando.dismiss();
          this.mostrarAlerta('Error', e.message);
        });
    });
  }

  /**
   * Evento que se suscita cuando salimos de esta página.
   * Detiene la escucha de eventos relacionados con la base de datos.
   */
  ionViewWillLeave() {
    if (this.refDB){
      this.refDB.off();
    }
    if (this.refRoot){
      this.refRoot.off();
    }
    if (this.mapa){
      this.mapa.remove();
    }
  }

  /**
   * Muestra un mensaje de error que expulsa al usuario de esta página.
   * @param header Título del mensaje.
   * @param mensaje Contenido del mensaje.
   */
  async mostrarAlerta(header, mensaje){
    this.alertCtrl.create({
      header: header,
      message: mensaje,
      buttons: ['Ok']
    }).then(alert => {
      alert.onDidDismiss().then(() => {
        // Regresamos a la página anterior.
        this.navCtrl.pop();
      });
      return alert.present();
    });
  }

}
