import { Component } from '@angular/core';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { BackgroundGeolocation, BackgroundGeolocationConfig,
  BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-emitir',
  templateUrl: './emitir.page.html',
  styleUrls: ['./emitir.page.scss'],
})
export class EmitirPage {
  // Nombre de la base de datos en la nube.
  readonly DB_FIREBASE = 'prac_vigilar_ruta';
  // Referencia a la raíz de la base de datos.
  refRoot: firebase.database.Reference;
  // Cantidad de puntos geográficos subidos a la nube.
  puntosSubidos: number;
  // Cantidad de puntos geográficos que no se pudieron subir a la nube.
  puntosErrados: number;
  // Cada cuántos metros se va a registrar la posición geográfica del usuario.
  readonly MTS = 5;

  constructor(private bgGeo: BackgroundGeolocation, private loadCtrl: LoadingController,
    private alertCtrl: AlertController, public navCtrl: NavController) {}

  /**
   * Evento que se suscita cuando se muesta la página.
   */
  async ionViewWillEnter () {
    const msgCargando = await this.loadCtrl.create({
      message: 'Cargando...'
    });

    // Inicializamos los contadores de puntos.
    this.puntosSubidos = 0;
    this.puntosErrados = 0;

    // Eliminamos la información del recorrido anterior.
    msgCargando.present()
      .then(() => firebase.database().ref(this.DB_FIREBASE).remove())
      .then(() => {
        /* Se configura el evento de cuando otro usuario entra a esta página. */
        this.refRoot = firebase.database().ref();
        this.refRoot.on('child_removed', snapshot => {
          if (snapshot.key === this.DB_FIREBASE){
            // Se elimina el evento.
            this.refRoot.off();

            // Se muestra una aleta que expulsa al usuario de esta página.
            this.mostrarError('Está página sólo puede ser abierta por un usuario a la vez.<br>Alguien más acaba de entrar.');
          }
        });

        /* Se configura un evento que se ejecuta en primer y segundo plano, que se desencadena
            cuando el usuario ha caminado X cantidad de metros. Este nos da la localización
            actual del dispositivo. */
        const config: BackgroundGeolocationConfig = {
          desiredAccuracy: 100,
          stationaryRadius: this.MTS,
          distanceFilter: this.MTS,
          debug: false, //  Activar sonidos cada vez que se guarde una ubicación.
          stopOnTerminate: true, // Si la app se cierra, se ejecuta 'this.bgGeo.stop();'.
          interval: 30000 // 30 segundos.
        };
        this.bgGeo.configure(config);

        this.bgGeo.on(BackgroundGeolocationEvents.location)
          .subscribe((ubicacionBGR: BackgroundGeolocationResponse) => {
            // Obtenemos las coordenadas geográficas, en el formato de Google Maps.
            const ubicacion = {
              lat: ubicacionBGR.latitude,
              lng: ubicacionBGR.longitude
            };

            // Se guarda la nueva ubicación en la nube.
            const insert = firebase.database().ref(this.DB_FIREBASE).push();
            insert.set(ubicacion)
              .then(() => {
                this.puntosSubidos += 1;
              }).catch((e) => {
                this.puntosErrados += 1;
              }).finally(() => this.bgGeo.finish());
          });
        
        // Se activa la monitorización y evento de la ubicación.
        this.bgGeo.start();
        msgCargando.dismiss();
      }).catch((e) => {
        msgCargando.dismiss();
        this.mostrarError(e.message);
      });
  }

  /**
   * Evento que se suscita cuando salimos de esta página.
   * Se detiene la monitorización de la ubicación y borramos nuestro reccorrido.
   */
  ionViewWillLeave() {
    this.bgGeo.stop();
    if (this.refRoot) {
      this.refRoot.off();
    }
    firebase.database().ref(this.DB_FIREBASE).remove();
  }

  /**
   * Muestra un mensaje de error y expulsa al usuario de la página.
   * @param mensaje La explicación del error.
   */
  async mostrarError(mensaje){
    this.alertCtrl.create({
      header: 'Error',
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