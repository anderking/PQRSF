import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  public isSuccess:boolean=false;

  constructor(private _sharedService: SharedService) {}

  ngOnInit() {
    this._sharedService.changeEmitted$.subscribe(
      response => {
          this.isSuccess = response;
          console.log(response)
      });
  }

}
