import { Component, ViewChild} from '@angular/core';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent {
  showDialog = false;

  @ViewChild('classicModal') classicModal ;

  user = {};

  inMailingList = false;

  constructor() {
  }

  show(user){
      this.user = user;
      this.classicModal.show();
  }
}