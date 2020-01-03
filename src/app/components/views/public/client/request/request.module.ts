import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OriginService } from 'src/app/core/services/origin.service';
import { DocumentService } from 'src/app/core/services/document.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { RequestRoutingModule } from './request-routing.module';
import { RequestComponent } from './request.component';
import { RequestsComponent } from './requests/requests.component';
import { RequestCreateComponent } from './request-create/request-create.component';


@NgModule({
  declarations:
  [
  	RequestComponent,
  	RequestsComponent,
    RequestCreateComponent,
  ],
  imports: [
    CommonModule,
    RequestRoutingModule,
    FormsModule
  ],
  providers:
  [
    OriginService,
    DocumentService,
  ]
})

export class RequestModule { }
