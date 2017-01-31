import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-ng2/main';

import { SharedModule } from '../../shared/shared.module';
import { BrochuresGridComponent } from './brochuresgrid/grid.component';
//import { GalleryItemComponent} from './brochuresgrid/item.component';



const routes: Routes = [
    { path: '', component: BrochuresGridComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        AgGridModule.withComponents([BrochuresGridComponent])
    ],
    declarations: [
        BrochuresGridComponent,
        //GalleryItemComponent
    ],
    exports: [
        RouterModule
    ]
})
export class BrochuresModule { }
