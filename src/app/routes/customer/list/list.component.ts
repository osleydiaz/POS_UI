import { Component, OnInit, OnDestroy } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { Http } from '@angular/http';
import { SettingsService } from '../../../core/settings/settings.service';


import {CustomerComponent} from '../customer/customer.component';

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

    // Filter Example
    //irishAthletes = ['John Joe Nevin', 'Katie Taylor', 'Paddy Barnes', 'Kenny Egan', 'Darren Sutherland', 'Margaret Thatcher', 'Tony Blair', 'Ronald Regan', 'Barack Obama'];
    // {
    //     headerName: 'Athlete',
    //     field: 'athlete',
    //     width: 150,
    //     filter: 'set',
    //     filterParams: {
    //         cellHeight: 20,
    //         values: this.irishAthletes
    //     }
    // },

    customers = [];

    hasInvoiceRenderer = function(params) {
        var hasInvoice = params.value;
        if(hasInvoice)
            return "<i class='fa fa-check text-success'></i>";
        else
            return "<i class='fa fa-close text-danger'></i>"
    };

    columnDefsFilter = [ 
        {headerName: 'Bid#',field: 'BidNum',width: 80}, 
        {headerName: 'Session#',field: 'SessionNum',width: 115}, 
        {headerName: 'Name',field: 'FirstName',width: 150}, 
        {headerName: 'Last Name',field: 'LastName'}, 
        {headerName: 'City',field: 'City',width: 150}, 
        {headerName: 'State',field: 'State.Name',width: 90}, 
        {headerName: 'Home Phone',field: 'HomePhone',width: 150}, 
        {headerName: 'Work Phone',field: 'WorkPhone',width: 150}, 
        {headerName: 'Last Registered',field: 'ModifiedDate',width: 150}, 
        {headerName: 'Cabin',field: 'Cabin',width: 90}, 
        {headerName: 'Invoiced',field: 'HasInvoice',width:  100, cellRenderer: this.hasInvoiceRenderer}
    ];  

    constructor(private settings: SettingsService,private http: Http) {     

        //this.customerComponent = <CustomerComponent>{};

        // Filter example
        this.gridOptions = <GridOptions>{
            columnDefs: this.columnDefsFilter,
            rowData: null,
            enableSorting: true,
            enableFilter: true,
            headerHeight:35,
            rowSelection: 'single',
            gridReady: (params) => {
                params.api.sizeColumnsToFit();
                this.$win.on(this.resizeEvent, () => {
                    setTimeout(() => { params.api.sizeColumnsToFit(); });
                });
            }
        };

      
        // http.get('assets/server/ag-customers.json')
        //     .subscribe((data) => {
        //         this.gridOptions.api.setRowData(data.json());
        //         this.gridOptions.api.sizeColumnsToFit();
        //     });

        this.getCustomers();
    }

     private onQuickFilterChanged($event) {
         this.gridOptions.api.setQuickFilter($event.target.value);
     }


    ngOnInit() { }

    private getCustomers(){

        this.settings.spinning = true;
        
        this.http.get(this.settings.apiUrl+ "customer/getAll")
                .subscribe(
                data => {
                    this.settings.spinning = false;
                    this.customers= data.json();
                    this.gridOptions.api.setRowData( this.customers);
                },
                err => {
                    this.settings.spinning = false;
                    //todo: show error 
                    alert('Error loading data')
                }
                );
    }

    ngOnDestroy() {
        this.$win.off(this.resizeEvent);
    }

    cellDoubleClicked($event){
       //classicModal.show();
       console.log($event.data);
    }

    onSelectionChanged = function($event) {
        var selectedRows =  this.gridOptions.api.getSelectedRows();
        if(selectedRows.length > 0)
            console.log(selectedRows[0]);
    }
}