import { Component, ViewChild,Input,Output,EventEmitter} from '@angular/core';
import { Http,Headers,RequestOptions} from '@angular/http';
import { SettingsService } from '../../../core/settings/settings.service';
import { CustomerService } from '../../../core/api/customer.service';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent {

  @Output() onCustomerSaved : EventEmitter<any> = new EventEmitter();

  @ViewChild('customerModal') customerModal ;
  @ViewChild('cityStateCountyModal') cityStateCountyModal ;
  @ViewChild('histCustomerModal') histCustomerModal ;
  @ViewChild('confirmCustomerModal') confirmCustomerModal;

  histCustConfig = {
    isNew: false,
    hasAccount: false,
    isMailing: false
  }
  
  showDialog = false;
  
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

   isNewHistCustomer = false;
   originalHistCustomer = "";

   isShipAuction = true;
    
    today = new Date();
    thisYear = this.today.getFullYear();

   ccYears = [];
   ccMonths = [{value:1,label:"Jan"},{value:2,label:"Feb"},{value:3,label:"Mar"},{value:4,label:"Apr"},{value:5,label:"May"},{value:6,label:"Jun"},{value:7,label:"Jul"},{value:8,label:"Aug"},{value:9,label:"Sep"},{value:10,label:"Oct"},{value:11,label:"Nov"},{value:1,label:"Dec"}];

   originalExpMonth= ''
   originalExpYear = '';
   originalCCNumber = '';
   originalPaymentType = '';

   historicalCustomers = [];

  constructor(private http:Http,private settings:SettingsService,private service:CustomerService,private fb:FormBuilder ) {

    if(this.settings.app.info.AuctionType == 'LAND')
      this.isShipAuction = false;
   
    this.ccYears = [this.thisYear,this.thisYear+1,this.thisYear+2,this.thisYear+3,this.thisYear+4,this.thisYear+5,this.thisYear+6,this.thisYear+7,this.thisYear+8];

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
            lastzipcode: ["",CustomValidators.rangeLength([0, 15])],
            taxid: ["",CustomValidators.rangeLength([0, 15])],
            paymenttype: [""],
            ccnumber: [{value:"",disabled:true},this.validateCCNumber()],
            ccexpiremonth:[{value:"",disabled:true},  this.validateExpirationMonth()],
            ccexpireyear:[{value:"",disabled:true},this.validateExpirationYear()],
            biddate:[""],
            sessionnum:[""]
        });

    this.loadLists();
  }

  initUser(){
    this.user =  {Folio:"",Cabin:"",BidNum:"",Prefix: "Mr.",CountryID:222,Country: "United States",RegionID:0, Region: "Continental US",State:"",City:"",County:"",PostalCode:"",IsPrimaryAddress: false,BidDate:new Date()};
  }

  show(user){
      if(!user)
        this.initUser();
       else{
          if(!user.Prefix)
            user.Prefix = "Mr.";
          if(!user.Country)
            user.CountryID = 222;
          this.user = Object.assign({}, user);
       } 
          
     this.originalHistCustomer = this.user.HistoricalCustNum == null ? "" : this.user.HistoricalCustNum + ""; 
     
     this.originalCCNumber = this.user.CreditCardNumber;
     this.originalPaymentType = this.user.PaymentType;
      if(this.user.CreditCardExpire){
        if(this.user.CreditCardExpire.length == 4){
          this.originalExpMonth = this.user.CreditCardExpire.substr(0,2);
          this.originalExpYear  = (2000 + Number.parseInt(this.user.CreditCardExpire.substr(2,2))).toString();
        }
      }

      this.valForm.setValue({
        bidnum:  this.user.BidNum?   this.user.BidNum : '',
        cabin:  this.user.Cabin?   this.user.Cabin: '',
        folio: this.user.Folio ?   this.user.Folio: '',
        prefix: this.user.Prefix ?   this.user.Prefix: '',
        sessionnum:  this.user.SessionNum ?   this.user.SessionNum: '',
        biddate:  this.user.BidDate ?   this.user.BidDate: '',
        countryid: this.user.CountryID ?  this.user.CountryID : 0,
        regionid:  this.user.RegionID ?   this.user.RegionID : 0,
        firstname: this.user.FirstName ?   this.user.FirstName: '',
        lastname:  this.user.LastName ?   this.user.LastName: '',
        addressline1:  this.user.AddressLine1 ?   this.user.AddressLine1: '',
        addressline2:  this.user.AddressLine2 ?   this.user.AddressLine2: '',
        city:  this.user.City ?   this.user.City: '',
        state:  this.user.StateID ?  this.user.StateID : 0,
        zipcode:  this.user.PostalCode ?   this.user.PostalCode: '',
        county: this.user.County ?   this.user.County: '',
        countrycode: this.user.PhoneCode ?   this.user.PhoneCode: '',
        homephone: this.user.HomePhone ?   this.user.HomePhone: '',
        cellphone: this.user.WorkPhone ?   this.user.WorkPhone: '',
        leadcode: this.user.LeadCode ? this.user.LeadCode :  "Ship",
        email: this.user.Email ?   this.user.Email: '',
        company: this.user.CompanyName ?   this.user.CompanyName: '',
        historicalcustomer:  this.user.HistoricalCustNum ?   this.user.HistoricalCustNum + "": '',
        pwcccall:  this.user.PWCCCall ? this.user.PWCCCall : null,
        pwgccopentobuy:  this.user.PWCCOpenToBuy ?   this.user.PWCCOpenToBuy : 0 ,
        mailinglist: this.user.IsExisting? this.user.IsExisting : null,
        primaryaddress: this.user.IsPrimaryAddress ? this.user.IsPrimaryAddress : null,
        lastzipcode :  this.user.LastPostalCode ?   this.user.LastPostalCode: '',
        taxid:  this.user.TaxID ?   this.user.TaxID: '',
        paymenttype:  this.originalPaymentType ?   this.originalPaymentType: '',
        ccnumber:  this.originalCCNumber ?   this.originalCCNumber: '', //todo: decript this shit
        ccexpiremonth: this.originalExpMonth,
        ccexpireyear: this.originalExpYear
      });

      for (let c in this.valForm.controls) {
          this.valForm.controls[c].markAsUntouched();
      }

       this.countryChanged();

       this.paymentTypeChanged();

      this.customerModal.show();
  }

  loadLists(){
    var self = this;
    self.settings.spinning = false;

    this.service.getList(
      function(data){
        self.settings.spinning = false;
        var lists = data;
        self.prefixCodes = lists.PrefixCodes;
        self.states  = lists.States;
        self.regions = lists.Regions;
        self.countries  = lists.Countries;
        self.leads  = lists.Leads;
        self.paymentTypes = lists.PaymentTypes;
        self.regionCountryStates = lists.RegionCountryStates;
      },
      function(error){
         self.settings.spinning = false;
         console.log(error); //log error
      }
    );
  }

  cityStateCountyList = [];
  lookupCityStateCounty(){
    var self = this;
    
    var zipcode = this.valForm.controls["zipcode"].value.trim()
    if(zipcode){
      this. cityStateCountyList = [];
      this.settings.spinning = false;
      this.service.lookupCityStateCounty(
        zipcode,
        function(data){
            self.settings.spinning = false;
            self.cityStateCountyList = data;
            if(self.cityStateCountyList.length > 0 )
              self.cityStateCountyModal.show();
        },
        function(error){
          self.settings.spinning = false;
          console.log(error); //log error
        }
      );
    }
  }

  newHistCustChanged(){
    if(this.isNewHistCustomer){
      this.valForm.controls['historicalcustomer'].setValue("");
    }else{
      this.valForm.controls['historicalcustomer'].setValue( this.originalHistCustomer);
    }
  }

  countryChanged(){
    this.selectedRegionCountryState = {};
    var countryID = this.valForm.controls['countryid'].value;
    this.selectedRegionCountryState =  this.regionCountryStates.find(function(el){ return el.CountryID ==countryID });
    this.valForm.controls['regionid'].setValue(this.selectedRegionCountryState.RegionID);
  }

paymentTypeChanged(){
  if(this.valForm.controls['paymenttype'].value ==''){
     this.valForm.controls['ccnumber'].setValue("");
    this.valForm.controls['ccexpiremonth'].setValue("");
    this.valForm.controls['ccexpireyear'].setValue("");

    this.valForm.controls['ccnumber'].disable();
    this.valForm.controls['ccexpiremonth'].disable();
    this.valForm.controls['ccexpireyear'].disable();
  }else{
    this.valForm.controls['ccnumber'].enable();
    this.valForm.controls['ccexpiremonth'].enable();
    this.valForm.controls['ccexpireyear'].enable();
  }
}


submitCustomerForm($event, value){
  
  var self = this;
  for (let c in this.valForm.controls) {
          this.valForm.controls[c].markAsTouched();
          this.valForm.controls[c].enable();
  }

  if( this.valForm.valid){

      this.settings.spinning = true;

      if(this.valForm.controls["historicalcustomer"].value.trim() == ""){
         
           self.service.lookupHistoricalCustomer(
              {LastName: self.valForm.controls["lastname"].value, PhoneNumber: self.valForm.controls["homephone"].value},
              function(data){
                self.settings.spinning = false;
                if(data){
                    self.historicalCustomers = data;
                      self.histCustomerModal.show();
                  }else{
                    self.saveCustomer();
                  }
              },
              function(error){
                self.settings.spinning = false;
                console.log(error); //log error
              }
            );

      }else{
         self.saveCustomer();
      }
    }

     this.countryChanged();
     this.paymentTypeChanged();
}

private getExpDate(){
  var expDate = this.valForm.controls["ccexpiremonth"].value;
  var year = this.valForm.controls["ccexpireyear"].value;
  if(year.length > 0)
    year = year.substr(2,2);
  expDate += year;

  if(expDate.length ==3)
    expDate = '0'+expDate;

  return expDate;
}

private saveCustomer(){
  var self = this;

  var bidDate = self.user.BidDate;

 


  var customer = {
    CustomerID : self.user.CustomerID,
    Prefix : self.valForm.controls["prefix"].value,
    FirstName : self.valForm.controls["firstname"].value,
    LastName : self.valForm.controls["lastname"].value,
    AddressLine1 : self.valForm.controls["addressline1"].value,
    AddressLine2 : self.valForm.controls["addressline2"].value,
    City : self.valForm.controls["city"].value,
    PostalCode : self.valForm.controls["zipcode"].value,
    StateID : self.valForm.controls["state"].value,
    CountryID : self.valForm.controls["countryid"].value,
    County : self.valForm.controls["county"].value,
    RegionID : self.valForm.controls["regionid"].value,
    Cabin : self.valForm.controls["cabin"].value,
    Folio : self.valForm.controls["folio"].value,
    BidNum : self.valForm.controls["bidnum"].value,
    BidDate : self.valForm.controls["biddate"].value,
    CompanyName : self.valForm.controls["company"].value,
    TaxID : self.valForm.controls["taxid"].value,
    PhoneCode : self.valForm.controls["countrycode"].value,
    HomePhone : self.valForm.controls["homephone"].value,
    WorkPhone : self.valForm.controls["cellphone"].value,
    LeadCode : self.valForm.controls["leadcode"].value,
    Email : self.valForm.controls["email"].value,
    SessionNum : self.valForm.controls["sessionnum"].value,
    IsExisting : self.valForm.controls["mailinglist"].value,
    LastPostalCode : self.valForm.controls["lastzipcode"].value,
    IsPrimaryAddress : self.valForm.controls["primaryaddress"].value,
    PaymentTypeCode : self.valForm.controls["paymenttype"].value,
    CreditCardNumber : self.valForm.controls["ccnumber"].value,
    CreditCardExpire : self.getExpDate(),
    PWCCOpenToBuy : self.valForm.controls["pwgccopentobuy"].value,
    PWCCCall : self.valForm.controls["pwcccall"].value,
    HistoricalCustNum : self.valForm.controls["historicalcustomer"].value,
    FirstNameAdditional :"",
    LastNameAdditional : "",
  };

  this.settings.spinning = true;

  this.service.saveCustomer(
    customer,
    function(data){
        self.settings.spinning = false;
        if(data.Success){
          self.customerModal.hide();
          
          self.onCustomerSaved.emit();
        }
        else{
        }      
    },
    function(error){
      self.settings.spinning = false;
      console.log(error); //log error
    }
  )
}
  
  
//cust=null for new customer
selectHistCustomer(cust){

  this.histCustomerModal.hide();

  if(cust)
    this.valForm.controls["historicalcustomer"].setValue(cust.CustNum);
  else
     this.valForm.controls["historicalcustomer"].setValue(0);

  if ( this.valForm.controls["historicalcustomer"].value == 0 || this.valForm.controls["historicalcustomer"].value.Trim() == ""){
      this.confirmCustomerModal.show();
    }
 
}

confirmCustomerSaveClick(){

     if(this.histCustConfig.isNew){
        this.valForm.controls["historicalcustomer"].setValue("0");
     }

     if(this.histCustConfig.hasAccount){

        if(this.histCustConfig.isMailing){
           this.valForm.controls["historicalcustomer"].setValue("OLDCUSTN");
        }
        else{
            this.valForm.controls["historicalcustomer"].setValue("SHIPADDR");
        }
     }

    this.saveCustomer();
     
}

validateCabin(): ValidatorFn {
  return <ValidatorFn>((control: FormControl) => {
    if(this.isShipAuction){
      return control.value.length < 6 && control.value.trim().length > 0 ?  null : { 'InvalidValue': true } ;//Cabin cannot be more than 5 characters
    }
    else
      return null;
  });
};

validateFolio(): ValidatorFn {
   var self = this;
    return <ValidatorFn>((control: FormControl) => {
      if(this.isShipAuction){
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


validateExpirationMonth(): ValidatorFn {
    var self = this;
     return <ValidatorFn>((control: FormControl) => {
         if(self.valForm)
          if(self.valForm.controls['paymenttype'].value == '')
            return null;

        return (self.user.HasInvoice && Number(control.value) >0 && Number(control.value) < 13 || !self.user.HasInvoice) ?  null : { 'InvalidValue': true}
    }); 
};


validateExpirationYear(): ValidatorFn {
    var self = this;
     return <ValidatorFn>((control: FormControl) => {

        if(self.valForm)
          if(self.valForm.controls['paymenttype'].value == '')
            return null;
        return  (self.user.HasInvoice && Number(control.value) >= self.thisYear  || !self.user.HasInvoice) ?  null : { 'InvalidValue': true}
    }); 
};


validateCCNumber():ValidatorFn{ 

  var self = this;

  return <ValidatorFn>((control: FormControl) => {
        var paymentType = '';
        var v =  '';
        if(self.valForm){
          paymentType = self.valForm.controls['paymenttype'].value;
          v = self.valForm.controls['ccnumber'].value;
        }

        if(paymentType == ''){
          return null;
        }else{
           
              var sanitized = v.replace(/[^0-9]+/g, '');
            // problem with chrome
            if (!(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[0-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/.test(sanitized))) {
                return { 'creditCard': true };
            }      
            
            if( paymentType == 'PWCC')
              return null;

            var sum = 0;
            var digit;
            var tmpNum;
            var shouldDouble;
            for (var i = sanitized.length - 1; i >= 0; i--) {
                digit = sanitized.substring(i, (i + 1));
                tmpNum = parseInt(digit, 10);
                if (shouldDouble) {
                    tmpNum *= 2;
                    if (tmpNum >= 10) {
                        sum += ((tmpNum % 10) + 1);
                    }
                    else {
                        sum += tmpNum;
                    }
                }
                else {
                    sum += tmpNum;
                }
                shouldDouble = !shouldDouble;
            }
            if (Boolean((sum % 10) === 0 ? sanitized : false)) {
                return null;
            }
            return { 'creditCard': true };
        }
    });
}

selectCityStateCounty (item){
  var rcs = this.regionCountryStates.find(function(el){ return el.StateID  == item.StateID });
  this.valForm.controls['countryid'].setValue(rcs.CountryID);
  this.valForm.controls['city'].setValue(item.City);
  this.valForm.controls['state'].setValue(item.StateID);
  this.valForm.controls['county'].setValue(item.County);
  this.valForm.controls['zipcode'].setValue(item.PostalCode);

  this.cityStateCountyModal.hide();
}

}