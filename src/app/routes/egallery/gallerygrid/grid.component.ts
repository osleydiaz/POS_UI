import { Component, OnInit, OnDestroy } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { Http } from '@angular/http';

import {GalleryItemComponent} from '../galleryitem/item.component';

import * as _ from 'lodash';
declare var $: any;

@Component({
    selector: 'app-gallerygrid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
})
export class GalleryGridComponent implements OnInit, OnDestroy {

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
        {headerName: 'Lot Type',field: 'LotType',width: 80}, 
        {headerName: 'Lot#',field: 'LotNum',width: 115}, 
        {headerName: 'Reg#',field: 'RegNum',width: 150}, 
        {headerName: 'Artist',field: 'ArtistLastName'}, 
        {headerName: 'Title',field: 'Title',width: 150} 
    ];  

    selectedItem = {};
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
      
    
        http.get('assets/server/ag-egallery.json')
            .subscribe((data) => {
                var list = data.json();
                if(list.length > 0){
                    this.selectedItem = list[0];
                    this.gridOptions.api.setRowData(list);
                    this.gridOptions.api.sizeColumnsToFit();
                }
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
        if(selectedRows.length > 0){
             this.selectedItem = selectedRows[0];
        }
    }
}