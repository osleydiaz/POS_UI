import { Component, OnInit, OnDestroy } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { Http } from '@angular/http';

import { SettingsService } from '../../../core/settings/settings.service';
import {InvoiceService} from '../../../core/api/invoice.service'

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
        {headerName: 'Bid#',field: 'BidNum',width: 80}, 
        {headerName: 'Invoice#',field: 'InvoiceNumber',width: 115}, 
        {headerName: 'Name',field: 'Customer.FirstName',width: 150}, 
        {headerName: 'Last Name',field: 'Customer.LastName'}, 
        {headerName: 'Invoice Date',field: 'InvoiceDate',width: 150}, 
        {headerName: 'Close Date',field: 'PrintedDate',width: 90}, 
        {headerName: 'Over Low',field: 'OverLow',width: 150}, 
        {headerName: 'Last Modified',field: 'ModifiedDate',width: 150}, 
        {headerName: 'Has Duplicates',field: 'HasDuplicateLots',width: 150}
    ];  

    constructor(http: Http,private settings:SettingsService, private service:InvoiceService) {     

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

        this.loadAll();       
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


    loadAll(){
        var self =this;
        self.settings.spinning = true;
        this.service.getAll(
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
}