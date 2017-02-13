import { Component, OnInit,Input } from '@angular/core';


@Component({
    selector: 'app-auctioneertool',
    templateUrl: './auctioneertool.component.html',
    styleUrls: ['./auctioneertool.component.scss']
})
export class AuctioneertoolComponent implements OnInit {

    @Input() lot;
    @Input() priceLevels;

    constructor() {
    }

    ngOnInit() { }


  
}
