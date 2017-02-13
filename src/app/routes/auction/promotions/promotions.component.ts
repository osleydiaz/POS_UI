import { Component, ViewChild} from '@angular/core';
import { SettingsService } from '../../../core/settings/settings.service';
import { Http } from '@angular/http';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss'],
})
export class PromotionsComponent {
  showDialog = false;

  @ViewChild('classicModal') classicModal ;

  promotions = [];

  constructor(private settings: SettingsService,private http:Http) {
  }

  show(lot){
       this.settings.spinning = true;
       this.http.get(this.settings.apiUrl+ "auction/getPromotions?lotId="+lot.LotID)
            .subscribe(
              data => {
                this.settings.spinning = false;
                this.promotions= data.json();
                this.classicModal.show();
              },
              err => {
                 this.settings.spinning = false;
                 //todo: show error 
                 alert('Error loading data')
              }
            );
      
      


  }
}