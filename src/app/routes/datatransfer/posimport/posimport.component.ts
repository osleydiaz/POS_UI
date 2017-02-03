import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";
import { FileUploader } from 'ng2-file-upload';

const URL = 'http://localhost:8080/api/datatransfer/posimport' //'https://evening-anchorage-3159.herokuapp.com/api/';
import {ChannelService, ConnectionState} from "../../../core/signalr/channel.service";


@Component({
  selector: 'app-posimport',
  templateUrl: './posimport.component.html',
  styleUrls: ['./posimport.component.scss']
})
export class POSImportComponent implements OnInit {

     connectionState$: Observable<string>;


    public uploader: FileUploader = new FileUploader({ url: URL });
    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public fileOverAnother(e: any): void {
        this.hasAnotherDropZoneOver = e;
    }

    constructor(
        private channelService: ChannelService
    ) { 
        
        // Let's wire up to the signalr observables
        //
        this.connectionState$ = this.channelService.connectionState$.map((state: ConnectionState) => { return ConnectionState[state]; });

        this.channelService.error$.subscribe(
            (error: any) => { console.warn(error); },
            (error: any) => { console.error("errors$ error", error); }
        );

        // Wire up a handler for the starting$ observable to log the
        //  success/fail result
        //
        this.channelService.starting$.subscribe(
            () => { console.log("signalr service has been started"); },
            () => { console.warn("signalr service failed to start!"); }
        );
    }

     fileBrowseChanged(e){
        e.currentTarget.value = "";
        this.uploader.queue = [];
    }

    ngOnInit() {
         this.channelService.start();
    }

}
