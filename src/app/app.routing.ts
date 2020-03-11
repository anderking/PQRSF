import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes =
[
	{path: '', canActivate: [],
		children:
		[
			{
				path: '',
                loadChildren: '../app/components/views/public/client/request/request.module#RequestModule',
			}
		]
	},

];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled',  useHash: true });