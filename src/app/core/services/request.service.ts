import { Injectable } from '@angular/core';
import { HeaderService } from './header.service';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment';
import { Request } from 'src/app/models/request';


@Injectable()
export class RequestService extends HeaderService{

	url: string = environment.api + 'GenerateRequets';

	constructor(
		private http: HttpClient
	){
		super();
    }
    
    create(request: Request): Observable<any>{
		let params = JSON.stringify(request);
		return this.http.post(this.url, params, {headers: this.header});
	}
	
}
