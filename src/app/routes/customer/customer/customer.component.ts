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

  selectedRegionCountryState : any;
  selectedState : any;

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
            bidnum: [null, CustomValidators.range([100, 999])],
            cabin:["",this.validateCabin()],
            folio:["",this.validateFolio()],
            prefix: [null],
            countryid: [null],
            regionid:[null],
            firstname:["",Validators.compose([Validators.required, CustomValidators.rangeLength([1, 20])])],
            lastname:["", Validators.compose([Validators.required, CustomValidators.rangeLength([1, 20])])],
            addressline1: ["",this.validateAddress1()],
            addressline2: ["",Validators.compose([Validators.nullValidator, Validators.maxLength(20)])],
            city: ["",this.validateCity()],
            state:[""],
            zipcode: ["",this.validatePostalCode()],
            county:[""], //todo: needs validation
            countrycode:["", Validators.compose([CustomValidators.number,CustomValidators.rangeLength([1, 3])])],//todo:  Make sure the combination of region/country/state is valid
            homephone:["", Validators.compose([Validators.required,CustomValidators.number,CustomValidators.rangeLength([10, 13])])],
            cellphone:[null, Validators.compose([CustomValidators.number,CustomValidators.rangeLength([10, 13])])],
            leadcode:[""],
            email:["", CustomValidators.email],
            company:[""],
            historicalcustomer: ["",CustomValidators.rangeLength([0, 10])],
            pwgccopentobuy: ["",CustomValidators.range([0, 9999999.99])],            
            pwcccall: [true],
            mailinglist:[false],
            primaryaddress:[true],
            lastzipcode: ["",CustomValidators.rangeLength([0, 15])]
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
        bidnum: this.user.BidNum == null ? "" : this.user.BidNum, 
        cabin: this.user.Cabin == null ? "" : this.user.Cabin,
        folio:this.user.Folio == null ? "" : this.user.Folio,
        prefix:this.user.Prefix == null ? "" : this.user.Prefix,
        countryid:this.user.CountryID == null ? 0 : this.user.CountryID,
        regionid: this.user.RegionID == null ?  0 : this.user.RegionID,
        firstname:this.user.FirstName == null ? "" : this.user.FirstName,
        lastname: this.user.LastName == null ? "" : this.user.LastName,
        addressline1: this.user.AddressLine1 == null ? "" : this.user.AddressLine1,
        addressline2: this.user.AddressLine2 == null ? "" : this.user.AddressLine2,
        city: this.user.City == null ? "" : this.user.City,
        state: this.user.State.StateID == null ? 0 : this.user.State.StateID,
        zipcode: this.user.PostalCode == null ? "" : this.user.PostalCode,
        county:this.user.County == null ? "" : this.user.County,
        countrycode:this.user.PhoneCode == null ? "" : this.user.PhoneCode,
        homephone:this.user.HomePhone == null ? "" : this.user.HomePhone,
        cellphone:this.user.WorkPhone == null ? "" : this.user.WorkPhone,
        leadcode:this.user.LeadCode == null ? "Ship" : this.user.LeadCode,
        email:this.user.Email == null ? "" : this.user.Email,
        company:this.user.CompanyName == null ? "" : this.user.CompanyName,
        historicalcustomer:"",
        pwcccall: this.user.PWCCCall,
        pwgccopentobuy: this.user.PWCCOpenToBuy == null ? 0 :  this.user.PWCCOpenToBuy ,
        mailinglist:this.user.IsExisting,
        primaryaddress:this.user.IsPrimaryAddress,
        lastzipcode : this.user.LastPostalCode == null ? "" : this.user.LastPostalCode
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
    var zipcode = this.valForm.controls["zipcode"].value.trim()
    if(zipcode){
      this. cityStateCountyList = [];
      this.settings.spinning = false;
      this.http.get(this.settings.apiUrl+ "customer/LookupCityStateCounty?postalCode="+zipcode)
          .subscribe(
            data => {
              this.settings.spinning = false;
              this.cityStateCountyList = data.json();
              if(this.cityStateCountyList.length > 0 )
                this.cityStateCountyModal.show();
            },
            err => {
                this.settings.spinning = false;
                //todo: show error 
                alert('Error loading data')
            }
          );
    }
    return true;
  }

  countryChanged(){
    this.selectedRegionCountryState = {};
    var countryID = this.valForm.controls['countryid'].value;
    this.selectedRegionCountryState =  this.regionCountryStates.find(function(el){ return el.CountryID ==countryID });
    this.valForm.controls['regionid'].setValue(this.selectedRegionCountryState.RegionID);
    //this.user.RegionID = regionCountryState.RegionID;
  }

saveCustomer($event, value){

console.log($event, value);
  //todo: LookupHistoricalCustomer

   for (let c in this.valForm.controls) {
          this.valForm.controls[c].markAsTouched();
      }

  if( this.valForm.valid){
    //   this.http.post(this.settings.apiUrl+ "auction/sellLot",JSON.stringify(this.user),this.requestOptions)
  //         .subscribe(
  //           data => {
  //             this.settings.spinning = false;
  //             var resp = data.json();
  //             if(resp.Success){
                
  //             }
  //             else{
  //             }                
  //           },
  //           err => {
  //               this.settings.spinning = false;
  //           }
  //         );
    console.log("Valid")
  }
  

};

validateCabin(): ValidatorFn {
  return <ValidatorFn>((control: FormControl) => {
    if(!control.value)
      return { 'InvalidValue': true };

    if(this.settings.app.info.AuctionType != 'LAND'){
      return control.value.length < 6 && control.value.trim().length > 0 ?  null : { 'InvalidValue': true } ;//Cabin cannot be more than 5 characters
    }
    else
      return null;
  });
};

validateFolio(): ValidatorFn {
   var self = this;
    return <ValidatorFn>((control: FormControl) => {
      if(!control.value)
        return { 'InvalidValue': true };

      if(this.settings.app.info.AuctionType != 'LAND'){
        return control.value.length < 6 &&  ((self.user.HasInvoice && control.value.trim().length > 0) || !self.user.HasInvoice) ?  null : { 'InvalidValue':true} ;//Cabin cannot be more than 5 characters
      }
      else
        return null;
    });
};

validateAddress1(): ValidatorFn {
    var self = this;
    return <ValidatorFn>((control: FormControl) => {
        return ( control.value.length < 36 && ((self.user.HasInvoice &&  control.value.trim().length > 0) || !self.user.HasInvoice ) && ( control.value.indexOf("P.O.") == -1 &&  control.value.indexOf("PO BOX") == -1 )) ?  null : { 'InvalidValue': true }
    });  
};

validatePostalCode(): ValidatorFn {
    var self = this;
     return <ValidatorFn>((control: FormControl) => {
        return control.value.length < 11 &&  ((self.user.HasInvoice &&  control.value.trim().length > 0) || !self.user.HasInvoice) ?  null : { 'InvalidValue': true}
    }); 
};

validateCity(): ValidatorFn{
   var self = this;
    return <ValidatorFn>((control: FormControl) => {
        return control.value.length < 31 &&  ((self.user.HasInvoice &&  control.value.trim().length > 0) || !self.user.HasInvoice) ?  null : { 'InvalidValue': true }
    }); 
};

validateCounty(): ValidatorFn{

  var stateId = this.valForm.controls['state'].value;
  var selectedState =  this.states.find(function(el){ return el.stateId == stateId });
  var chargeCountyTax = false;
  if(selectedState){
    if(selectedState.ChargeCountyTax){
        chargeCountyTax = true;
    }
  }

  return <ValidatorFn>((control: FormControl) => {
    if(chargeCountyTax){
        return control.value.trim().length > 0 ?  null : { 'InvalidValue': control.value }
    }
    else{
      return null;
    }  
  }); 
  
};


selectCityStateCounty (item){
  var rcs = this.regionCountryStates.find(function(el){ return el.StateID  == item.StateID });
  this.valForm.controls['countryid'].setValue(rcs.CountryID);
  this.valForm.controls['city'].setValue(item.City);
  this.valForm.controls['state'].setValue(item.StateID);
  this.valForm.controls['county'].setValue(item.County);
  this.valForm.controls['zipcode'].setValue(item.PostalCode);

  this.cityStateCountyModal.hide();
}

//validateREgion

}