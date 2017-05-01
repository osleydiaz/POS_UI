import { Injectable } from '@angular/core';
import { Http,Headers,RequestOptions} from '@angular/http';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class CustomerService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    private requestOptions =  new RequestOptions({ headers: this.headers });

    constructor(private http:Http,private settings:SettingsService,) {        
    }

    saveCustomer(customer,success,failure){
        this.http.post(this.settings.apiUrl+ "customer/save",JSON.stringify(customer),this.requestOptions)
          .subscribe(
            data => {
                  success(data.json());
              },
              err => {
                 failure("Error Loading Data");
              }
          );
    }

    getList(success,failure){
         this.http.get(this.settings.apiUrl+ "customer/getLists")
            .subscribe(
              data => {
                  success(data.json());
              },
              err => {
                 failure("Error Loading Data");
              }
            );
    }

    lookupCityStateCounty(zipcode,success,failure){
          this.http.get(this.settings.apiUrl+ "customer/LookupCityStateCounty?postalCode="+zipcode)
            .subscribe(
              data => {
                  success(data.json());
              },
              err => {
                 failure("Error Loading Data");
              }
            );
    }

    lookupHistoricalCustomer(request,success,failure){
         this.http.get(this.settings.apiUrl+  "customer/LookupHistoricalCustomer?lastName="+ request.LastName + "&phoneNumber="+ request.PhoneNumber)
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
