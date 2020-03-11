// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: 'https://pqrsfdev.azurewebsites.net/api/',
  failed: 'Hay problemas para cargar los datos, revise su conexion a internet o recargue la página',
  conexionFailed: 'Ha ocurrido un error al enviar sus datos!!! posiblemente esto se deba a problemas con su conexión a internet, para asegurarnos de esto, recargaremos la página y por favor intente de nuevo. Si el problema persiste intente mas tarde.',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
