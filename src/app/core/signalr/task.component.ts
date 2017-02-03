import {Component, OnInit, Input} from "@angular/core";  
import {Http, Response} from "@angular/http";

import {ChannelService, ChannelEvent} from "./channel.service";

class StatusEvent {  
    State: string;
    PercentComplete: number;
}

@Component({
    selector: 'task',
    template: `
        <div>
            Progress Detail
        </div>

        <div>
            <p *ngFor="let ev of events" [ngClass]="{'text-success': ev.Data.Success,'text-danger': !ev.Data.Success}"> {{ev.Data.Description}} : {{ev.Data.PercentComplete}} % complete</p>
        </div>        
    `
})
export class TaskComponent implements OnInit {  

// <div class="commands">
//     <textarea 
//         class="console"
//         cols="50" 
//         rows="15"
//         disabled
//         [value]="messages" style="width:100%;background-color:#ffffff;"></textarea> 
// </div>

    @Input() eventName: string;
    @Input() apiUrl: string;

    messages = "";
    events = [];

    private channel = "datatransfer";

    constructor(
        private http: Http,
        private channelService: ChannelService
    ) {

    }

    public progress = 0;

    ngOnInit() {
        // Get an observable for events emitted on this channel
        //
        this.channelService.sub(this.channel).subscribe(
            (x: ChannelEvent) => {
                switch (x.Name) {
                    case this.eventName: { this.appendStatusUpdate(x); }
                }
            },
            (error: any) => {
                console.warn("Attempt to join channel failed!", error);
            }
        )
    }


    private appendStatusUpdate(ev: ChannelEvent): void {
        // Just prepend this to the messages string shown in the textarea
        //
        this.events.push(ev);
        let date = new Date();
        this.progress = ev.Data.PercentComplete;
        this.messages = `${date.toLocaleTimeString()} : ${ev.Data.Description} : ${ev.Data.PercentComplete} % complete\n` + this.messages;
    }
}