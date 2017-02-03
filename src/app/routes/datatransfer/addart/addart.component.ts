import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-addart',
  templateUrl: './addart.component.html',
  styleUrls: ['./addart.component.scss']
})
export class AddArtComponent implements OnInit {

 public uploader: FileUploader = new FileUploader({ url: 'url' });
    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public fileOverAnother(e: any): void {
        this.hasAnotherDropZoneOver = e;
    }

    fileBrowseChanged(e){
      e.currentTarget.value = "";
      this.uploader.queue = [];
    }

    constructor() { }

    ngOnInit() {
    }


}
