import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-ng2/main';

import { SharedModule } from '../../shared/shared.module';
import { GalleryGridComponent } from './gallerygrid/grid.component';
import { GalleryItemComponent} from './galleryitem/item.component';



const routes: Routes = [
    { path: '', component: GalleryGridComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        AgGridModule.withComponents([GalleryGridComponent])
    ],
    declarations: [
        GalleryGridComponent,
        GalleryItemComponent
    ],
    exports: [
        RouterModule
    ]
})
export class EGalleryModule { }
