import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { DataTableModule } from 'angular2-datatable';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { AgGridModule } from 'ag-grid-ng2/main';

import { SharedModule } from '../../shared/shared.module';
import { ListComponent } from './list/list.component';


const routes: Routes = [
    { path: '', component: ListComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        // DataTableModule,
        //Ng2TableModule,
        AgGridModule.withComponents([ListComponent])
    ],
    declarations: [
        ListComponent
    ],
    exports: [
        RouterModule
    ]
})
export class CustomerModule { }
