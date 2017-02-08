import { Component, OnInit, Injector } from '@angular/core';
import { SettingsService } from '../../core/settings/settings.service';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html'
})
export class SpinnerComponent implements OnInit {

    showing = false;

    constructor( private settings: SettingsService) {
    }

    ngOnInit() {
    }

    show(){
        this.showing = true;
    }

    hide(){
        this.showing = false;
    }

}
