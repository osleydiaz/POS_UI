import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../core/settings/settings.service';
import { Http } from '@angular/http';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss']
})
export class AuctionComponent implements OnInit {

  lotIndex = 0;
  lots = [];
  lot = {Artist:{},IsPieceSold:false,ArtDescription:{},ArtistDescription:{},StockCode:{},Artwork:{}};

  public regNums: Array<string> = ['Amsterdam', 'Antwerp', 'Athens', 'Barcelona',
      'Berlin', 'Birmingham', 'Bradford', 'Bremen', 'Brussels', 'Bucharest',
      'Budapest', 'Cologne', 'Copenhagen', 'Dortmund', 'Dresden', 'Dublin',
      'Düsseldorf', 'Essen', 'Frankfurt', 'Genoa', 'Glasgow', 'Gothenburg',
      'Hamburg', 'Hannover', 'Helsinki', 'Kraków', 'Leeds', 'Leipzig', 'Lisbon',
      'London', 'Madrid', 'Manchester', 'Marseille', 'Milan', 'Munich', 'Málaga',
      'Naples', 'Palermo', 'Paris', 'Poznań', 'Prague', 'Riga', 'Rome',
      'Rotterdam', 'Seville', 'Sheffield', 'Sofia', 'Stockholm', 'Stuttgart',
      'The Hague', 'Turin', 'Valencia', 'Vienna', 'Vilnius', 'Warsaw', 'Wrocław',
      'Zagreb', 'Zaragoza', 'Łódź'];

  constructor( private settings: SettingsService,private http:Http) {
    this.settings.spinning = true;
     http.get(this.settings.apiUrl+ "auction/getlotids")
            .subscribe((data) => {
                this.settings.spinning = false;
                this.lots= data.json();
                this. getLot();
            });
  } 

  ngOnInit() {
  }

  keyDown($event) {
    $event.preventDefault();
    console.log($event);

    switch ($event.code) {
      case "Escape":
        this.settings.layout.offsidebarOpen = !this.settings.layout.offsidebarOpen;
        break;
      case "F1":
        this. firstLot();
        break;
      case "F2":
        this. prevLot();
        break;
      case "F3":
        this. nextLot();
        break;
      case "F4":
        this. lastLot();
        break;
    
      default:
        break;
    }
  }


  firstLot(){
    this.lotIndex  = 0;
     this.getLot();
  }

  lastLot(){
    this.lotIndex  = this.lots.length -1;
    this.getLot();
  }

  nextLot(){
    if(this.lotIndex  == this.lots.length -1)
      this.lotIndex = 0;
    else
      this.lotIndex++;

     this.getLot();
  }

  prevLot(){
    if(this.lotIndex  == 0)
      this.lotIndex = this.lots.length -1;
    else
      this.lotIndex--;

      this.getLot();
  }

  private getLot(){

    this.settings.spinning = true;
    
    var lotId = this.lots[this.lotIndex];

    this.http.get(this.settings.apiUrl+ "auction/getlot?lotId="+lotId)
            .subscribe((data) => {
              this.settings.spinning = false;
              this.lot= data.json();
            });

  }

}
