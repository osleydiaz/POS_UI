import { Component, ViewChild} from '@angular/core';
import { Http,Headers,RequestOptions} from '@angular/http';
import { SettingsService } from '../../../core/settings/settings.service';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent {
  showDialog = false;

  @ViewChild('classicModal') classicModal ;
  @ViewChild('cityStateCountyModal') cityStateCountyModal ;

  user =  {Prefix: "Mr.",CountryID:222,Country: "United States",RegionID:0, Region: "Continental US",State:"",City:"",County:"",PostalCode:"",IsPrimaryAddress: false};

  inMailingList = false;

   prefixCodes = [];
   states  = [];
   regions = [];
   countries  = [];
   leads  = [];
   paymentTypes = [];
   regionCountryStates = [];


  constructor(private http:Http,private settings:SettingsService) {
    this.loadLists();
  }

  initUser(){
    this.user =  {Prefix: "Mr.",CountryID:222,RegionID:0,Country: "United States",Region: "Continental US",State:"",City:"",County:"",PostalCode:"",IsPrimaryAddress: false};
  }

  show(user){
      debugger;
      this.initUser();

      if(!user)
        this.initUser();
       else{
          if(!user.Prefix)
            user.Prefix = "Mr.";
          if(!user.Country)
            user.CountryID = 222;

          this.user = Object.assign({}, user);
       } 

       this.countryChanged();

      this.classicModal.show();
  }

  loadLists(){
    this.settings.spinning = false;
       this.http.get(this.settings.apiUrl+ "customer/getLists")
            .subscribe(
              data => {
                this.settings.spinning = false;
                var lists = data.json();
                this.prefixCodes = lists.PrefixCodes;
                this.states  = lists.States;
                this.regions = lists.Regions;
                this.countries  = lists.Countries;
                this.leads  = lists.Leads;
                this.paymentTypes = lists.PaymentTypes;
                this.regionCountryStates = lists.RegionCountryStates;

              },
              err => {
                 this.settings.spinning = false;
                 //todo: show error 
                 alert('Error loading data')
              }
            );
  }

  cityStateCountyList = [];
  validatePostalCode(){
      this. cityStateCountyList = [];
      this.settings.spinning = false;
      this.http.get(this.settings.apiUrl+ "customer/LookupCityStateCounty?postalCode="+this.user.PostalCode)
          .subscribe(
            data => {
              this.settings.spinning = false;
              this.cityStateCountyList = data.json();
              this.cityStateCountyModal.show();
            },
            err => {
                this.settings.spinning = false;
                //todo: show error 
                alert('Error loading data')
            }
          );
  }

  countryChanged(){
    var self = this;
    var regionCountryState =  this.regionCountryStates.find(function(el){ return el.CountryID == self.user.CountryID });
    this.user.RegionID = regionCountryState.RegionID;
  }

}