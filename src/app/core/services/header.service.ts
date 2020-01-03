import { HttpHeaders } from "@angular/common/http";

export class HeaderService {

  protected header: HttpHeaders = new HttpHeaders();
  
  constructor() {
    this.header = this.header.set('Content-Type', 'application/json');
   }
}