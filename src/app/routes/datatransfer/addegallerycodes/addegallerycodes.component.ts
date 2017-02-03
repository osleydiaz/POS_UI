import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-addegallerycodes',
  templateUrl: './addegallerycodes.component.html',
  styleUrls: ['./addegallerycodes.component.scss']
})
export class AddeGalleryCodesComponent implements OnInit {

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
