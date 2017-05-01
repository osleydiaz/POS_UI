import { Injectable } from '@angular/core';
import { Http,Headers,RequestOptions} from '@angular/http';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class InvoiceService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    private requestOptions =  new RequestOptions({ headers: this.headers });

    constructor(private http:Http,private settings:SettingsService,) {        
    }
    getAll(success,failure){
         this.http.get(this.settings.apiUrl+ "invoice/getall")
            .subscribe(
              data => {
                  success(data.json());
              },
              err => {
                 failure("Error Loading Data");
              }
            );
    }

    getLineItems(invoiceId,success,failure){
         this.http.get(this.settings.apiUrl+ "invoice/getLineItems?invoiceId="+invoiceId)
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
