import { Component, ViewChild} from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { Http } from '@angular/http';


import { SettingsService } from '../../../core/settings/settings.service';
import {InvoiceService} from '../../../core/api/invoice.service'

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent {
  showDialog = false;

  invoiceStep = 1;

  @ViewChild('invoiceModal') invoiceModal ;

   @ViewChild('paymentModal') paymentModal ;

  invoice = {};

   resizeEvent = 'resize.ag-grid';
    $win = $(window);

    gridOptions: GridOptions;

    payments = [
      {PaymentType:1,PaymentTypeDesc: "Folio",Amount:1400,Number:34567,Expire: "07/20", BillingSameAsCustomer: true},
      {PaymentType:2,PaymentTypeDesc: "CC",Amount:500,Number:6666555544442222,Expire: "12/22", BillingSameAsCustomer: false}
    ];

    promotions = [
      {Id:1, Value: "Spend $5000 - 5% Discount"},
      {Id:1, Value: "Spend $10000 - 10% Discount"},
      {Id:1, Value: "No interest on purchases ($1000 and below) - 6 months term"}
    ];
      


   columnDefsFilter = [ 
        {headerName: 'Lot Type',field: 'lotType',width: 120}, 
        {headerName: 'OL',field: 'ol',width: 100}, 
        {headerName: 'Lot#',field: 'lotNum',width: 90}, 
        {headerName: 'Artist',field: 'artist',width: 150}, 
        {headerName: 'Title',field: 'title'}, 
        {headerName: 'Hammer Price',field: 'hammerPrice',width: 130}, 
        {headerName: 'Buyer Premium',field: 'buyerPremium',width: 130}, 
        {headerName: 'Appraisal',field: 'appraisal',width: 110}, 
        {headerName: 'Ship Code',field: 'shipCode',width: 120},
         {headerName: 'Frame Code',field: 'frameCode',width: 100}
    ];  

    constructor(http: Http,private settings:SettingsService, private service:InvoiceService) {     

        this.gridOptions = <GridOptions>{
            columnDefs: this.columnDefsFilter,
            rowData: null,
            enableFilter: true,
            enableSorting: true,
            rowSelection: 'single',
            headerHeight:35,
            gridReady: (params) => {
                params.api.sizeColumnsToFit();
                this.$win.on(this.resizeEvent, () => {
                    setTimeout(() => { params.api.sizeColumnsToFit(); });
                });
            }
        };
    }

  show(invoice){

     this.invoiceStep = 1;
     this.invoice = invoice;

     this.loadLineItems(invoice.InvoiceID) ;
     
     this.invoiceModal.show();
  }

  showPayment(){
    this.invoiceStep = 2;
  }

  showDetails(){
    this.invoiceStep = 1;
  }

  editPayment(){

  }
  deletePayment(){

  }
  addPayment(){

  }

  loadLineItems(invoiceId){
     var self =this;
        self.settings.spinning = true;
        this.service.getLineItems(
            invoiceId,
            function(data){
                self.settings.spinning = false;
                //self.selectedItem = data[0];
                self.gridOptions.api.setRowData(data);
                self.gridOptions.api.sizeColumnsToFit();
            },
            function(error){
                self.settings.spinning = false;
                console.log(error); //log error
            }
        );
  }

  //payment data 
paymentModalTitle = "Add Payment";
_payment =  {PaymentType: "",PaymentTypeDesc:"",Amount:"",Number:"",Expire: "", BillingSameAsCustomer: true};
resetPayment(){
   this._payment =  {PaymentType: "",PaymentTypeDesc:"",Amount:"",Number:"",Expire: "", BillingSameAsCustomer: true};
   this.paymentModalTitle = "Add Payment";
}

  showPaymentModal(payment){
    debugger;

    if(payment){
      this.paymentModalTitle = "Edit Payment";
      this._payment = payment;
      // this._payment.PaymentType = payment.PaymentType;
      // this._payment.Amount = payment.Amount;
      // this._payment.Number = payment.Number;
      // this._payment.Expire = payment.Expire;
      // this._payment.BillingSameAsCustomer = payment.BillingSameAsCustomer;
    }else{
       this.resetPayment();
    }

    this.paymentModal.show();
   
  }


  //credit data
  credits = [{Type:"la la la",Amount:20,Balance:20}];

}