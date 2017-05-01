import { Injectable } from '@angular/core';
import { Http,Headers,RequestOptions} from '@angular/http';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class BrochureService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    private requestOptions =  new RequestOptions({ headers: this.headers });

    constructor(private http:Http,private settings:SettingsService,) {        
    }
    getPromotionBrochures(success,failure){
         this.http.get(this.settings.apiUrl+ "brochure/GetPromotionBrochures")
            .subscribe(
              data => {
                  success(data.json());
              },
              err => {
                 failure("Error Loading Data");
              }
            );
    }


}
