import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor(private localNotifications: LocalNotifications,     
              public platform: Platform
    ) { }
    /**
     * @author Felipe De Jesus 
     * @version 0.0.1
     * @function singleNotification
     * @description Show a single notification
     * @param {string} text Text to show
     * @param {any} data payload
     */
  singleNotification(text, data) {
    // Schedule a single notification
    this.localNotifications.schedule({
      id: 1,
      text,
      sound: this.setSound(),
      data
    });
    return this.localNotifications;
  }
    /**
     * @author Felipe De Jesus 
     * @version 0.0.1
     * @function setSound
     * @description set the sound of the notification
     */
  setSound() {
    if (this.platform.is('android')) {
      return 'file://assets/www/assets/sounds/notification.mp3';
    } else {
      return 'file://assets/www/assets/sounds/notification.mp3';
    }
  }
    /**
     * @author Felipe De Jesus 
     * @version 0.0.1
     * @function multipleNotifications
     * @description show a multiple notification
     */
  multipleNotifications() {
    // Schedule multiple notifications
    this.localNotifications.schedule([{
      id: 1,
      text: 'Multi ILocalNotification 1',
      // sound: isAndroid ? 'file://sound.mp3': 'file://beep.caf',
      data: { secret:'HOLAMUNDOMultiples' }
     },{
      id: 2,
      title: 'Local ILocalNotification Example',
      text: 'Multi ILocalNotification 2',
      icon: 'http://example.com/icon.png'
    }]);
  }
    /**
     * @author Felipe De Jesus 
     * @version 0.0.1
     * @function programadaNotification
     * @description show a programated notification
     */
  programadaNotification() {
    // Schedule delayed notification
    this.localNotifications.schedule({
      text: 'Delayed ILocalNotification',
      trigger: {at: new Date(new Date().getTime() + 3600)},
      led: 'FF0000',
      sound: null
    });
  }
}
