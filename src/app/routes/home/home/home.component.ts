import { Component, OnInit,ViewChild,Input} from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

tmr;
$win = $(window)[0];


sigStringData = "";
sigStringImageData = "";

 @ViewChild("cnv") cnv;

 onSign()
{
   let canvas = this.cnv.nativeElement;
   var ctx =  canvas.getContext("2d");//document.getElementById('cnv').getContext('2d');         
   this.$win.SetDisplayXSize( 500 );
   this.$win.SetDisplayYSize( 100 );
   this.$win.SetTabletState(0, this.tmr);
   this.$win.SetJustifyMode(0);
   this.$win.ClearTablet();
   if(this.tmr == null)
   {
      this.tmr = this.$win.SetTabletState(1, ctx, 50);
   }
   else
   {
      this.$win.SetTabletState(0, this.tmr);
      this.tmr = null;
      this.tmr = this.$win.SetTabletState(1, ctx, 50);
   }
}

 onClear()
{
   this.$win.ClearTablet();
}

 onDone()
{
    var self = this;

   if(this.$win.NumberOfTabletPoints() == 0)
   {
      alert("Please sign before continuing");
   }
   else
   {
      this.$win.SetTabletState(0, this.tmr);
      //RETURN TOPAZ-FORMAT SIGSTRING
      this.$win.SetSigCompressionMode(1);
      this.sigStringData += this.$win.GetSigString();
      //this returns the signature in Topaz's own format, with biometric information


      //RETURN BMP BYTE ARRAY CONVERTED TO BASE64 STRING
      this.$win.SetImageXSize(500);
      this.$win.SetImageYSize(100);
      this.$win.SetImagePenWidth(5);
      this.$win.GetSigImageB64(function(str){
            self.sigStringImageData = str;
      } );
   }
}


}
