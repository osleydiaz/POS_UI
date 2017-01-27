import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { DataTableModule } from 'angular2-datatable';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { AgGridModule } from 'ag-grid-ng2/main';

import { SharedModule } from '../../shared/shared.module';
import { ListComponent } from './list/list.component';
import {CustomerComponent} from './customer/customer.component';



const routes: Routes = [
    { path: '', component: ListComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        AgGridModule.withComponents([ListComponent])
    ],
    declarations: [
        ListComponent,
        CustomerComponent
    ],
    exports: [
        RouterModule
    ]
})
export class CustomerModule { }
