import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ServiceModule } from './services/service.module';
import { environment } from 'src/environments/environment';
import { ComponentsModule } from './components/components.module';
import { PipesModule } from './pipes/pipes.module';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AgmCoreModule } from '@agm/core';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Platform } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
registerLocaleData(localeMX, 'es-Mx');
const config: SocketIoConfig = { url: environment.urlSockets, options: {} };

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    SocketIoModule.forRoot(config),
    ServiceModule,
    ComponentsModule,
    PipesModule,
    AgmCoreModule.forRoot({
      apiKey: environment.apiKey
    })
],
  providers: [
    StatusBar,
    SplashScreen,
    LocalNotifications,
    ImagePicker,
    Camera,
    Geolocation,    
    NativeGeocoder,
    Platform,
    FileTransfer,
    Network,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide:  LOCALE_ID, useValue: 'es-Mx' }

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
