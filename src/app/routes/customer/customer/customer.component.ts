import { Component, ViewChild} from '@angular/core';
import { Http,Headers,RequestOptions} from '@angular/http';
import { SettingsService } from '../../../core/settings/settings.service';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent {

 private headers = new Headers({ 'Content-Type': 'application/json' });
 private requestOptions =  new RequestOptions({ headers: this.headers });


  showDialog = false;

  @ViewChild('classicModal') classicModal ;
  @ViewChild('cityStateCountyModal') cityStateCountyModal ;
  
  valForm: FormGroup;

  user : any;

  inMailingList = false;

   prefixCodes = [];
   states  = [];
   regions = [];
   countries  = [];
   leads  = [];
   paymentTypes = [];
   regionCountryStates = [];


  constructor(private http:Http,private settings:SettingsService,private fb:FormBuilder ) {
    this.initUser();

    this.valForm = this.fb.group({
            bidNum: [null, CustomValidators.range([100, 999])],
            cabin:['',this.validateCabin()],
            folio:['',this.validateFolio()],
            prefix: [null],
            countryID: [null],
            regionID:[null],
            firstName:['',Validators.compose([Validators.required, CustomValidators.rangeLength([1, 20])])],
            lastName:['', Validators.compose([Validators.required, CustomValidators.rangeLength([1, 20])])]
        });


    this.loadLists();
  }

  initUser(){
    this.user =  {Folio:"",Cabin:"",BidNum:"",Prefix: "Mr.",CountryID:222,Country: "United States",RegionID:0, Region: "Continental US",State:"",City:"",County:"",PostalCode:"",IsPrimaryAddress: false};
  }

  show(user){
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

      for (let c in this.valForm.controls) {
          this.valForm.controls[c].markAsUntouched();
      }

      this.valForm.setValue({
        bidNum: this.user.BidNum, 
        cabin: this.user.Cabin,
        folio:this.user.Folio,
        prefix:this.user.Prefix,
        countryID:this.user.CountryID,
        regionID: this.user.RegionID,
        firstName:this.user.FirstName,
        lastName: this.user.LastName
      });

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
  lookupCityStateCounty(){
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
    var countryID = this.valForm.controls['countryID'].value;
    var regionCountryState =  this.regionCountryStates.find(function(el){ return el.CountryID ==countryID });
    this.valForm.controls['regionID'].setValue(regionCountryState.RegionID);
    //this.user.RegionID = regionCountryState.RegionID;
  }

  saveCustomer(){

    var isValid = true;

     this.http.post(this.settings.apiUrl+ "auction/sellLot",JSON.stringify(this.user),this.requestOptions)
            .subscribe(
              data => {
                this.settings.spinning = false;
                var resp = data.json();
                if(resp.Success){
                 
                }
                else{
                }                
              },
              err => {
                 this.settings.spinning = false;
              }
            );

  }


  validateCabin(): ValidatorFn {
    return <ValidatorFn>((control: FormControl) => {
      if(!control.value)
        return { 'InvalidValue': true };

      if(this.settings.app.info.AuctionType != 'LAND'){
        return control.value.length < 6 && control.value.trim().length > 0 ?  null : { 'InvalidValue': control.value } ;//Cabin cannot be more than 5 characters
      }
      else
        return null;
    });
  }

 validateFolio(): ValidatorFn {
   var hasInvoice = this.user.HasInvoice;
    return <ValidatorFn>((control: FormControl) => {
      if(!control.value)
        return { 'InvalidValue': true };

      if(this.settings.app.info.AuctionType != 'LAND'){
        return control.value.length < 6 &&  ((hasInvoice && control.value.trim().length > 0) || !hasInvoice) ?  null : { 'InvalidValue': control.value } ;//Cabin cannot be more than 5 characters
      }
      else
        return null;
    });
  }

  validateFirstName(){
    return this.user.FirstName.length < 21 && this.user.FirstName.trim().length > 0;
  }

  validateLastName(){
    return this.user.LastName.length < 21 && this.user.LastName.trim().length > 0;
  }

  validateAddress1(){
    return this.user.AddressLine1.length < 36
     && ((this.user.HasInvoice && this.user.AddressLine1.trim().length > 0) || !this.user.HasInvoice )
     && (this.user.AddressLine1.indexOf("P.O.") > -1 && this.user.AddressLine1.indexOf("PO BOX") > -1 );
  }

validateAddress2(){
    return this.user.AddressLine2.length < 36;
  }

validatePostalCode(){
   return this.user.PostalCodeCity.length < 11 &&  ((this.user.HasInvoice && this.user.PostalCode.trim().length > 0) || !this.user.HasInvoice);
}

validateCity(){
   return this.user.City.length < 31 &&  ((this.user.HasInvoice && this.user.City.trim().length > 0) || !this.user.HasInvoice);
}

}