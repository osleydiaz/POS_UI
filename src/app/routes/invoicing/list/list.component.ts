import { Component, OnInit, OnDestroy } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { Http } from '@angular/http';

import {InvoiceComponent} from '../invoice/invoice.component';

import * as _ from 'lodash';
declare var $: any;

@Component({
    selector: 'app-angulargrid',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {

    resizeEvent = 'resize.ag-grid';
    $win = $(window);

    gridOptions: GridOptions;

    hasInvoiceRenderer = function(params) {
        var hasInvoice = params.value;
        if(hasInvoice)
            return "<i class='fa fa-check text-success'></i>";
        else
            return "<i class='fa fa-close text-danger'></i>"
    };

    columnDefsFilter = [ 
        {headerName: 'Bid#',field: 'bidNum',width: 80}, 
        {headerName: 'Invoice#',field: 'invoiceNum',width: 115}, 
        {headerName: 'Name',field: 'name',width: 150}, 
        {headerName: 'Last Name',field: 'lastName'}, 
        {headerName: 'InvoiceDate',field: 'invoiceDate',width: 150}, 
        {headerName: 'closeDate',field: 'invoiceDate',width: 90}, 
        {headerName: 'Over Low',field: 'overLow',width: 150}, 
        {headerName: 'Last Modified',field: 'lastModified',width: 150}, 
        {headerName: 'Has Duplicates',field: 'hasDuplicates',width: 150}
    ];  

    constructor(http: Http) {     

        this.gridOptions = <GridOptions>{
            columnDefs: this.columnDefsFilter,
            rowData: null,
            rowHeight:30,
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
      
        http.get('assets/server/ag-invoices.json')
            .subscribe((data) => {
                this.gridOptions.api.setRowData(data.json());
                this.gridOptions.api.sizeColumnsToFit();
            });
    }

     private onQuickFilterChanged($event) {
         this.gridOptions.api.setQuickFilter($event.target.value);
     }


    ngOnInit() { }

    ngOnDestroy() {
        this.$win.off(this.resizeEvent);
    }

    cellDoubleClicked($event){
       console.log($event.data);
    }

    onSelectionChanged = function($event) {
        var selectedRows =  this.gridOptions.api.getSelectedRows();
        if(selectedRows.length > 0)
            console.log(selectedRows[0]);
    }
}