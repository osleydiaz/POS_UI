import { Component, OnInit,ViewChild } from '@angular/core';
import { SettingsService } from '../../../core/settings/settings.service';
import { Http,Headers,RequestOptions} from '@angular/http';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss']
})
export class AuctionComponent implements OnInit {

  @ViewChild('msgModal') msgModal ;
  msg = {Title:"",Body:"",YesCallback:null,NoCallback:null,ShowYesNoBtns:false};

  lotIndex = 0;
  lots = [];
  allLots = [];
  lot = {LotID:0,Artist:{},SerNum:"",RegNum:"",IsPieceSold:false,IsPiecePriced:false,IsPieceBackOrdered:false,LowestSellingPriceCalculated:0,ArtDescription:{},ArtistDescription:{},StockCode:{},Artwork:{}};
  searchRegNum = "";
  searchArtist = "";
  searchBountyOnly = false;

  priceLevels = [];
  hammerPrice = "";
  bidNum = "";
  framed = false;
  bidderLastName = "";
  bidderName = "";

  sortBy = "Lot";

  public regNums: Array<string> = [];
  public artists: Array<string> = [];


  private headers = new Headers({ 'Content-Type': 'application/json' });
  private requestOptions =  new RequestOptions({ headers: this.headers });

  constructor( private settings: SettingsService,private http:Http) {
    this.getLots();    
  } 

  ngOnInit() {
  }

  keyDown($event) {

    var preventDefault = true;

    switch ($event.code) {
      case "Escape":
        this.settings.layout.auctioneerToolOpen = !this.settings.layout.auctioneerToolOpen;
        break;
      case "F2":
        this.firstLot();
        break;
      case "F3":
        this.prevLot();
        break;
      case "F4":
        this.nextLot();
        break;
      case "F5":
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

      this.sortLots();
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
                this.getPriceLevels(lotId);
              },
              err => {
                   this.settings.spinning = false;
                    //todo: show error 
                    alert('Error Loading Lot')
              }
            );

  }


private getPriceLevels(lotId){

    this.settings.spinning = true;

    this.http.get(this.settings.apiUrl+ "auction/getPriceLevels?lotId="+lotId)
            .subscribe(
              data => {
                this.settings.spinning = false;
                this.priceLevels= data.json();
              },
              err => {
                   this.settings.spinning = false;
                    //todo: show error 
                    alert('Error Loading Lot')
              }
            );

  }

  sortLots(){
    switch (this.sortBy) {
      case "Artist":
        this.lots.sort((l1,l2)=> l1.Artist.Code > l2.Artist.Code ? 1 : -1);
        break;
      case "Lot":
         this.lots.sort((l1,l2)=> l1.LotNum > l2.LotNum ? 1 : -1);
        break;
      case "Reg":
         this.lots.sort((l1,l2)=> l1.RegNum > l2.RegNum ? 1 : -1);
        break;
    
      default:
        break;
    }

     this.lotIndex = 0;

     this.getLot();
    
  }

  private sellLotClick(){
    debugger;

    if(isNaN(parseFloat(this.hammerPrice)) || !isFinite(parseFloat(this.hammerPrice)) || parseFloat(this.hammerPrice) <=0){
      this.showMessage("Error","Please enter valid Price");
      return;
    }
    
    if(isNaN(parseInt(this.bidNum)) || !isFinite(parseInt(this.bidNum)) || parseInt(this.bidNum) <=0){
      this.showMessage("Error","Please enter valid Bidder Number");
      return;
    }
    
     if(!this.lot.IsPiecePriced){
       this.showMessage("Error","This lot has not been priced and/or appraised. Please contact Park West Gallery if you wish to sell this piece.");
      return;
    }

    if(this.lot.IsPieceBackOrdered){
       this.showMessage("Error","This piece is required to fill a backorder and cannot be sold. Please refer to the special instruction box for more information.");
      return;
    }

    if(this.priceLevels.length > 0){
      var maxPrice = Math.max.apply(Math,this.priceLevels.map(function(o){return o.Amount;}))
      if ( parseFloat(this.hammerPrice) > maxPrice * 1.40){ //todo: && AuctionItemIsPiecePriced && Globals.FollowThreeBidRule == true && AuctionItemFollowThreeBidRule == true
          this.showMessage("Warning","Please ensure you are following the 3-bid rule. This work should be offered to multiple bidders once you’ve reached your 3rd bid increment.");
      }
    }

    if(this.lot.IsPieceSold){
      this.showMessage("Error","This piece can only be sold once. No additional orders can be made on this lot.");
      return;
    }
   

    var self = this;
    if(parseFloat(this.hammerPrice) < this.lot.LowestSellingPriceCalculated ){
        if(this.settings.app.info.SellBelowA){
            this.showYesNoMessage(
              "Warning",
              "The price you have entered is below the minimum sale price for this lot. Are you intentionally selling this lot for less than the minimum price?",
              function(){
                  self.isPieceSoldToCustomer();
              },
              function(){
              }
            );
        }else{
            this.showMessage("Error","The price entered cannot be this low. Please enter valid price.");
        }
    }else{
      self.isPieceSoldToCustomer();
    }
  }

  private sellLot(){

    this.settings.spinning = true;

    var request = {
        LotId: this.lot.LotID,
        BidNum: this.bidNum,
        Price: this.hammerPrice,
        Framed: this.framed,
        RegNum: this.lot.RegNum,
        SerNum: this.lot.SerNum
    };


   this.http.post(this.settings.apiUrl+ "auction/sellLot",JSON.stringify(request),this.requestOptions)
            .subscribe(
              data => {
                this.settings.spinning = false;
                var resp = data.json();
                if(resp.Success){
                   this.showMessage("Success","The sale has been successfully processed.");
                   this.clearBid();
                   this. getLot();
                }
                else{
                   this.showMessage("Error",resp.ResultDescription);
                }                
              },
              err => {
                 this.settings.spinning = false;
                 this.showMessage("Error","Server error, please try again.");
              }
            );
  }

  private isPieceSoldToCustomer(){
    var self = this;
    this.http.get(this.settings.apiUrl+ "auction/IsPieceSoldToCustomer?lotId="+this.lot.LotID+"&bidNum="+this.bidNum)
          .subscribe(
            data => {
              if( data.json()){
                  this.showYesNoMessage(
                        "Warning",
                        "This lot has already been sold to bidder number "+ self.bidNum +". Are you sure you want to sell it to the same bidder number again?",
                        function(){
                          self.sellLot();
                        },
                        function(){
                  });
              }else{
                 self.sellLot();
              }
          
            },
            err => {
                //todo: show error 
                this.showMessage("Error","Server error, please try again.");
            }
          );
  }

  private clearBid(){   
    this.hammerPrice = "";
    this.bidNum = "";
    this.framed = false;
    this.bidderLastName = "";
    this.bidderName = "";
  }

  showMessage(title,body){
    this.msg.Title = title;
    this.msg.Body = body;
    this.msg.ShowYesNoBtns =false;
    this.msg.YesCallback = null;
    this.msg.NoCallback = null
    this.msgModal.show();
  }

  showYesNoMessage(title,body,yesCallback,noCallback){
    this.msg.Title = title;
    this.msg.Body = body;
    this.msg.ShowYesNoBtns =true;
    this.msg.YesCallback = yesCallback;
    this.msg.NoCallback = noCallback
    this.msgModal.show();
  }

}
