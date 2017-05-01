import { Component, OnInit, OnDestroy,ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { Http } from '@angular/http';
import { SettingsService } from '../../../core/settings/settings.service';
import { BrochureService } from '../../../core/api/brochure.service';

//import {GalleryItemComponent} from '../galleryitem/item.component';

import * as _ from 'lodash';
declare var $: any;

@Component({
    selector: 'app-brochuresgrid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
})
export class BrochuresGridComponent implements OnInit, OnDestroy {

    @ViewChild('brochureModal') brochureModal ;

    resizeEvent = 'resize.ag-grid';
    $win = $(window);

    gridOptions: GridOptions;
    http :Http;

    isAvailableRenderer = function(params) {
        var isFileAvailable = params.value;
        if(isFileAvailable == 'No')
            return "<div style='width:100%;text-align:center'><i class='fa fa-close text-danger'></i></div>"        
        else
            return "style='width:100%;text-align:center'<i class='fa fa-check text-success'></i></div>";
    };

    columnDefsFilter = [ 
        {headerName: 'Artist Code',field: 'ArtistCode',width: 80}, 
        {headerName: 'Brochure Name',field: 'PDFName',width: 115}, 
        {headerName: 'Available',field: 'IsFileAvailable',width: 150,cellRenderer: this.isAvailableRenderer}, 
    ];  

    selectedItem = {PDFName:""};
    constructor(http: Http,private settings:SettingsService,private service:BrochureService) {     

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
      
        this.loadBrochures();
    }

     private onQuickFilterChanged($event) {
         this.gridOptions.api.setQuickFilter($event.target.value);
     }

    
    ngOnInit() { }

    ngOnDestroy() {
        this.$win.off(this.resizeEvent);
    }

    loadBrochures(){
        var self =this;
        self.settings.spinning = true;
        this.service.getPromotionBrochures(
            function(data){
                self.settings.spinning = false;
                self.selectedItem = data[0];
                self.gridOptions.api.setRowData(data);
                self.gridOptions.api.sizeColumnsToFit();
            },
            function(error){
                self.settings.spinning = false;
                console.log(error); //log error
            }
        );
    }

    cellDoubleClicked($event){
       var brochurePdf = document.getElementById('brochurePdf');
       brochurePdf.setAttribute('src', "pwgassets/brochures/"+$event.data.PDFName + '.pdf');
       this.brochureModal.show();
         //window.open("pwgassets/brochures/"+$event.data.PDFName + '.pdf');
    }

    onSelectionChanged = function($event) {
        // var selectedRows =  this.gridOptions.api.getSelectedRows();
        // if(selectedRows.length > 0){
        //      this.selectedItem = selectedRows[0];
        //         var brochurePdf = document.getElementById('brochurePdf');
        //         brochurePdf.setAttribute('src', 'pwgassets/brochures/'+ this.selectedItem.PDFName);
        // }
    }
}