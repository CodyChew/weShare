import { Component, OnInit, Input } from '@angular/core';
import { RequestService } from "../../services/request/request.service";
declare var $ : any;

@Component({
  selector: 'app-request-listing-card',
  templateUrl: './request-listing-card.component.html',
  styleUrls: ['./request-listing-card.component.css']
})
export class RequestListingCardComponent implements OnInit {
    @Input() requestID: any;
    @Input() title: any;
    @Input() description: any;
    

  constructor(
      private request: RequestService,
  ) { }

  ngOnInit(): void {
      this.display();
  }
  display() {
      this.request.getRequests().pipe().subscribe(requests => {
          console.log(requests);
      })
  }

  seeRequestDetails() {
      console.log("hello");
      $('#request-details').modal('show');
  }

}
