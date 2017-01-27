import { Component, ViewChild} from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { Http } from '@angular/http';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent {
  showDialog = false;

  @ViewChild('invoiceModal') invoiceModal ;

  invoice = {};

   resizeEvent = 'resize.ag-grid';
    $win = $(window);

    gridOptions: GridOptions;

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

    constructor(http: Http) {     

        this.gridOptions = <GridOptions>{
            columnDefs: this.columnDefsFilter,
            rowData: null,
            enableFilter: true,
            enableSorting: true,
            rowSelection: 'single',
            gridReady: (params) => {
                params.api.sizeColumnsToFit();
                this.$win.on(this.resizeEvent, () => {
                    setTimeout(() => { params.api.sizeColumnsToFit(); });
                });
            }
        };
      
      
    }

  show(invoice){
      this.invoice = invoice;

        
      this.gridOptions.api.setRowData(invoice.items);
      this.gridOptions.api.sizeColumnsToFit();

      this.invoiceModal.show();
  }
}