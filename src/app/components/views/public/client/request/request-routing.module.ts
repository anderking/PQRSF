import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RequestComponent } from './request.component';
import { RequestsComponent } from './requests/requests.component';
import { RequestCreateComponent } from './request-create/request-create.component';

const routes: Routes = [

	{path: '', component: RequestComponent, canActivate: [],
		children:
		[
			{path: '', component: RequestsComponent},
			{path: 'create', component: RequestCreateComponent},
		]
	},

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class RequestRoutingModule { }
