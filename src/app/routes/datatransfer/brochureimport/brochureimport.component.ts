import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-brochureimport',
  templateUrl: './brochureimport.component.html',
  styleUrls: ['./brochureimport.component.scss']
})
export class BrochureImportComponent implements OnInit {

   public uploader: FileUploader = new FileUploader({ url: 'URL' });
    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public fileOverAnother(e: any): void {
        this.hasAnotherDropZoneOver = e;
    }

    constructor() { }

     fileBrowseChanged(e){
      e.currentTarget.value = "";
      this.uploader.queue = [];
    }

    ngOnInit() {
    }


}
