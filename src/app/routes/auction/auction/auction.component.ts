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
  allLots = [];
  lot = {Artist:{},IsPieceSold:false,ArtDescription:{},ArtistDescription:{},StockCode:{},Artwork:{}};
  searchRegNum = "";
  searchArtist = "";
  searchBountyOnly = false;

  public regNums: Array<string> = [];
  public artists: Array<string> = [];

  constructor( private settings: SettingsService,private http:Http) {
    this.getLots();
    
  } 

  ngOnInit() {
  }

  keyDown($event) {

    var preventDefault = true;

    switch ($event.code) {
      case "Escape":
        this.settings.layout.offsidebarOpen = !this.settings.layout.offsidebarOpen;
        break;
      case "F1":
        this.firstLot();
        break;
      case "F2":
        this.prevLot();
        break;
      case "F3":
        this.nextLot();
        break;
      case "F4":
        this.lastLot();
        break;
      default:
        preventDefault =false;
        break;
    }
    if( preventDefault)
       $event.preventDefault();
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



  refreshRegNum($event){
    this.searchRegNum = "";
    if($event.id)
      this.searchRegNum = $event.id;
     this.filterLots();
  }

  refreshArtist($event){
    this.searchArtist = "";
    if($event.id)
        this.searchArtist = $event.id;
    this.filterLots();
  }

  bountyOnlyChanged($event){
    //searchBountyOnly
    this.filterLots();
  }

  private filterLots(){
     this.lotIndex = 0;

    this.lots = this.allLots.slice();

     if(this.searchRegNum != "" ){
         this.lots = this.lots.filter(l => l.RegNum === this.searchRegNum);
     }

    if(this.searchArtist != ""){
         this.lots = this.lots.filter(l => l.Artist.Code === this.searchArtist);
     }


     if(this.searchBountyOnly){
       this.lots = this.lots.filter(l => l.Bounty != 0);
     }

      this.regNums = [];
      this.artists = [];

      var artistDict = [];

      for (let l of this.lots) {
        this.regNums.push(l.RegNum);

        if(!artistDict[l.Artist.Code]){
           artistDict[l.Artist.Code] = true;
           this.artists.push(l.Artist.Code);
        }
      }

      this.artists.sort()

      this.getLot();
  }

   private getLots(){

    this.settings.spinning = true;
    
    this.http.get(this.settings.apiUrl+ "auction/getlots")
            .subscribe(
              data => {
                this.settings.spinning = false;
                this.allLots= data.json();
                this.filterLots();
                this. getLot();
              },
              err => {
                 this.settings.spinning = false;
                 //todo: show error 
                 alert('Error loading data')
              }
            );
  }

  private getLot(){

    if(!this.lots[this.lotIndex]){
      //todo: error
      alert("Error showing result");
      return;
    }

    this.settings.spinning = true;
    
    var lotId = this.lots[this.lotIndex].LotID;

    this.http.get(this.settings.apiUrl+ "auction/getlot?lotId="+lotId)
            .subscribe(
              data => {
                this.settings.spinning = false;
                this.lot= data.json();
              },
              err => {
                   this.settings.spinning = false;
                    //todo: show error 
                    alert('Error Loading Lot')
              }
            );

  }

}
