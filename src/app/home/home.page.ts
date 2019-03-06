import { AlertController } from '@ionic/angular';
import { Component } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
   constructor(private alertCtrl: AlertController, private net: Network, private router: Router) {}

   async irAPagina(ruta: string) {
    if (this.net.type === 'none' || this.net.type === 'unknown'){
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Necesita conexión a internet.',
        buttons: ['Ok']
      });
  
      await alert.present();
    } else {
      this.router.navigateByUrl(ruta);
    }
   }
}
