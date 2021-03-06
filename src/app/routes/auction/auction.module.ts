import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { AuctionComponent } from './auction/auction.component';
import { SelectModule } from 'ng2-select';

const routes: Routes = [
    { path: '', component: AuctionComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        SelectModule
    ],
    declarations: [
       AuctionComponent
    ],
    exports: [
        RouterModule
    ]
})
export class AuctionModule { }
