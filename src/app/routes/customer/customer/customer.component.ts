import { Component, ViewChild} from '@angular/core';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent {
  showDialog = false;

       @ViewChild('classicModal') classicModal ;
  
  
  constructor() {

   }


  show(user){
debugger;

      this.classicModal.show();

      console.log(user);
  }
}