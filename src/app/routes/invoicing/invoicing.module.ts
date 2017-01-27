import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-ng2/main';

import { SharedModule } from '../../shared/shared.module';
import { ListComponent } from './list/list.component';
import { InvoiceComponent} from './invoice/invoice.component';



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
        InvoiceComponent
    ],
    exports: [
        RouterModule
    ]
})
export class InvoicingModule { }
