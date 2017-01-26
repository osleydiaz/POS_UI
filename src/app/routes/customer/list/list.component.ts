import { Component, OnInit, OnDestroy } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { Http } from '@angular/http';
import * as _ from 'lodash';
declare var $: any;

@Component({
    selector: 'app-angulargrid',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

    resizeEvent = 'resize.ag-grid';
    $win = $(window);

    gridOptions: GridOptions;


    // Filter Example
    irishAthletes = ['John Joe Nevin', 'Katie Taylor', 'Paddy Barnes', 'Kenny Egan', 'Darren Sutherland', 'Margaret Thatcher', 'Tony Blair', 'Ronald Regan', 'Barack Obama'];
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

    hasInvoiceRenderer = function(params) {
        var hasInvoice = params.value;
        if(hasInvoice)
            return "<i class='fa fa-check text-success'></i>";
        else
            return "<i class='fa fa-close text-danger'></i>"
    };


    columnDefsFilter = [ 
         {headerName: 'Bid#',field: 'bidNum',width: 80}, 
        {headerName: 'Session#',field: 'ext',width: 115}, 
        {headerName: 'Name',field: 'name',width: 150}, 
        {headerName: 'Last Name',field: 'lastName'}, 
        {headerName: 'City',field: 'city',width: 150}, 
        {headerName: 'State',field: 'state',width: 90}, 
        {headerName: 'Home Phone',field: 'homePhone',width: 150}, 
        {headerName: 'Work Phone',field: 'workPhone',width: 150}, 
        {headerName: 'Last Registered',field: 'lastRegistered',width: 150}, 
        {headerName: 'Cabin',field: 'cabin',width: 90}, 
        {headerName: 'Invoiced',field: 'hasInvoice',width:  100, cellRenderer: this.hasInvoiceRenderer}
    ];  

    
    

    constructor(http: Http) {     

        // Filter example
        this.gridOptions = <GridOptions>{
            columnDefs: this.columnDefsFilter,
            rowData: null,
            enableFilter: true,
            rowSelection: 'single',
            gridReady: (params) => {
                params.api.sizeColumnsToFit();
                this.$win.on(this.resizeEvent, () => {
                    setTimeout(() => { params.api.sizeColumnsToFit(); });
                });
            }
        };

      
        http.get('assets/server/ag-customers.json')
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
         alert($event.data);
    }

    onSelectionChanged = function($event) {
        var selectedRows =  this.gridOptions.api.getSelectedRows();
        if(selectedRows.length > 0)
            console.log(selectedRows[0]);
    }

}
