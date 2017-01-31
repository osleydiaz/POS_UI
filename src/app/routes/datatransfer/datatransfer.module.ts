import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ColorPickerModule, ColorPickerService } from 'angular2-color-picker/lib';
import { SelectModule } from 'ng2-select';
import { TextMaskModule } from 'angular2-text-mask';
// import { TagInputModule } from 'ng2-tag-input';
import { CustomFormsModule } from 'ng2-validation';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageCropperModule } from 'ng2-img-cropper';


import { SharedModule } from '../../shared/shared.module';
import { AddArtComponent } from './addart/addart.component';
import { AddeGalleryCodesComponent } from './addegallerycodes/addegallerycodes.component';
import { BrochureImportComponent } from './brochureimport/brochureimport.component';
import { POSExportComponent } from './posexport/posexport.component';
import { POSImportComponent } from './posimport/posimport.component';
import { RestoreFromBackupComponent } from './restorefrombackup/restorefrombackup.component';
import { TechSupportExportComponent } from './techsupportexport/techsupportexport.component';


const routes: Routes = [
    { path: 'addart', component: AddArtComponent },
    { path: 'addegallerycodes', component: AddeGalleryCodesComponent },
    { path: 'brochureimport', component: BrochureImportComponent },
    { path: 'posexport', component: POSExportComponent },
    { path: 'posimport', component: POSImportComponent },
    { path: 'restorefrombackup', component: RestoreFromBackupComponent },
    { path: 'techsupportexport', component: TechSupportExportComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        SelectModule,
        ColorPickerModule,
        TextMaskModule,
        // TagInputModule,
        CustomFormsModule,
        FileUploadModule,
        ImageCropperModule
    ],
    providers: [ColorPickerService],
    declarations: [
        AddArtComponent,
        AddeGalleryCodesComponent,
        BrochureImportComponent,
        POSExportComponent,
        POSImportComponent,
        RestoreFromBackupComponent,
        TechSupportExportComponent
    ],
    exports: [
        RouterModule
    ]
})
export class DatatransferModule { }
