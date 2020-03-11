import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

  goBack(){
    let url = "http://www.eafit.edu.co/Paginas/PortalAccesoPQRSFQA.aspx";
		window.parent.location.href = url;
  }

}
