import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Document } from 'src/app/models/document';
import { DocumentService } from 'src/app/core/services/document.service';
import { Origin } from 'src/app/models/origin';
import { OriginService } from 'src/app/core/services/origin.service';
import { Request } from 'src/app/models/request';
import { RequestService } from 'src/app/core/services/request.service';
import { environment } from 'src/environments/environment';

declare var $: any

interface FileI {
	Content: string;
	FileName: string;
}

@Component({
	selector: 'app-request-create',
	templateUrl: './request-create.component.html',
	styleUrls: ['./request-create.component.css']
})
export class RequestCreateComponent implements OnInit, AfterContentChecked {

	//Variables que manejan los inputs del formulario
	public manifestacionType: string;
	public description: string = "";
	public fileName: string = "Subir archivo";
	public manifestacionResponse: string = "";
	public firstName: string = "";
	public lastName: string = "";
	public email: string = "";
	public documentType: string = "";
	public document: string = "";
	public originRequest: string = "1";

	//Variables que manejan los objetos de los modelos respectivos
	public request: Request;
	public originRequests: Origin;
	public documentTypes: Document;

	public isYes: boolean = false;//Indica si selecionaste la opcion si en el formulario
	public isNo: boolean = false;//Indica si selecionaste la opcion no en el formulario
	public isButton: boolean = false;//Indica si el formulario es valido o no para habilitar el button de enviar

	public isFileChosen: boolean = false;//Indica si hay un file cargado
	public isFileValid: boolean = true;//Indica si el proceso de cargar files es valido
	public isFailedConectBool: boolean = false; //Indica si hay problemas de conexion no se puede enviar nada
	public fileArrayName: object[];//Arreglo para almacenar los nombres de los files cargados en el html
	public fileArrayDelete: object[];//Arreglo para almacenar los files restantes luego de borrar alguno
	public isFileArrayDelete: boolean = false;//Indica si se borro algun file por el usuario
	public isLoading: boolean = false;//Indica si hay un proceso de carga que requiere esperar
	public failedConect: string;//String que almacena el message de falla de conexion con la api

	constructor
		(
			private _documentService: DocumentService,
			private _originService: OriginService,
			private _requestService: RequestService,
			private _router: Router,
			private _route: ActivatedRoute,
	) {
	}

	//#region Ciclo de vida angular

	ngOnInit(): void {
		this._route.queryParams.subscribe
			(
				params => {
					this.manifestacionType = params.manifestacionType;
				}
			);
		this.getDocuments();
		this.getOrigins();
		this.initInterface();
	}

	ngAfterContentChecked(): void {
		//Despues de chequear la carga del componente debemos quitar algunos estilos para el bootstrap-select
		$(".selectpicker").selectpicker();
		$(".selectpicker~.btn").removeClass('btn-light');
		$(".selectpicker~.btn").css("border", "1px solid #ced4da");
		$(".selectpicker~.btn").css("border-radius", "0px");
		//Si al seleccionar la opcion de Si y sale el mensaje de falla de conexion o
		//Si al selecionar la opcion de Si y no sale el mensaje de falla de conexion y tampoco se han cargado los tipos de documentos
		if ((this.isYes && this.failedConect != undefined) || (this.isYes && !this.failedConect && (!this.documentTypes || !this.originRequests))) {
			this.isFailedConectBool = true;
		}
		//Si se cargaron exitosamente los tipos de documentos y los origines entonces hay que volver a habilitar
		if (this.documentTypes && this.originRequests) {
			this.isFailedConectBool = false;
		}
	}

	//#endregion Ciclo de vida angular

	//#region funciones para el manejo de carga de files

	//Evento que se dispara cuando cambias de respuesta Si o No y así cambiar el estado de los booleanos respectivos
	changeResponse(event): void {
		if (event == "Si") {
			this.isYes = true;
			this.isNo = false;
			if (this.isFailedConectBool) {
				this.isFailedConectBool = false;
			}
		} else {
			this.isNo = true;
			this.isYes = false;
			if (this.isFailedConectBool) {
				this.isFailedConectBool = false;
			}
		}
	}

	//Inicializa el event file a vacío para que no interfiera el proceso de carga de files
	resetInputFile(event: any): void {
		event.target.value = ''
	}

	//Almacena un array de objetos de files cargados en la variable Request.Files y retorna un boolean
	uploadPic(event: any): boolean {

		//Inicializa las variables que ayudaran a las validaciones de la carga de files
		let docx = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
		let doc = 'application/msword';
		let xlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
		let xls = 'application/vnd.ms-excel';
		let pptx = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
		let ppt = 'application/vnd.ms-powerpoint';
		let mdb = 'application/vnd.ms-access';
		let pdf = 'application/pdf';
		let jpg = 'image/jpg';
		let jpeg = 'image/jpeg';
		let png = 'image/png'
		let txt = 'text/plain'
		let allowed_types = [];
		allowed_types = [docx, doc, xlsx, xls, pptx, ppt, mdb, jpg, jpeg, png, pdf, txt];
		const max_size = 1000000; // 5 Mb

		let filesInput = event.target.files;//Almacena el array de files detectado en el evento

		if (filesInput.length > 0) {

			this.isFileChosen = true;
			let arrayFile = [];//Inicializamos un array para almacenar de forma temporal los files cargados
			let maxFiles = filesInput.length;//Almacena la cantidad total de files cargados
			let maxFilesAcum: number;//Almacena la cantidad total de files acumulados durante la carga

			//Si es la primera carga de files y no se ha borrado nada
			if (this.fileArrayDelete) {
				maxFilesAcum = this.fileArrayDelete.length + maxFiles;
			} else {
				maxFilesAcum = this.request.Files.length;
			}
			//Validacion para subir no mas de 5 files
			if (maxFiles > 5 || maxFilesAcum > 5) {
				this.fileName = 'La cantidad maxima de archivos permitidos es de 5';
				this.isFileValid = false;
				if ((maxFilesAcum - maxFiles) > 6) {
					this.isFileValid = false;
					return false;
				} else {
					this.isFileValid = true;
					return false
				}
			}

			this.fileArrayName = [];

			/*Leemos los files guardados hasta el momento y los agregamos a los array de
			Archivos cargados temporalmente y el de los nombres que se muestran en el html */
			this.request.Files.forEach(element => {
				arrayFile.push(element);
				this.fileArrayName.push(element);
			});

			//Ciclo para realizar el procedimiento de carga y almacenado de files
			for (var i = 0; i < filesInput.length; i++) {
				this.isFileValid = true;
				let currentFile = filesInput[i];
				let extension = allowed_types.includes(currentFile.type);

				//Validamos si la extension actual se encuentra en la indicada por el array de extensiones validas
				if (!extension) {
					this.fileName = 'Solo se permiten archivos de tipo IMG, DOCS, PDF o TXT';
					if (maxFilesAcum > 6) {
						this.isFileValid = false;
						return false;
					} else {
						this.isFileValid = true;
						return false
					}
				}

				//Validamos si el tamaño del file actual excede el tamaño del file predefinido
				if (currentFile.size > max_size) {
					this.fileName = 'Tamaño maximo permitido ' + max_size / 1000000 + 'Mb';
					if (maxFilesAcum > 6) {
						this.isFileValid = false;
						return false;
					} else {
						this.isFileValid = true;
						return false
					}
				}

				let file: File = currentFile;
				this.fileName = "Subir archivo"
				let reader = new FileReader();

				//Funcion que realiza la conversion a base64
				reader.onload = (e: any) => {

					let fileI: FileI
					let result = e.target.result;
					//Para extraer solo el base64 del file actual
					let separator = "base64,";
					let arrayResult = result.split(separator);
					let newContent = arrayResult[1];

					//Armamos el objeto final con los datos del file cargado
					fileI = {
						Content: newContent,
						FileName: file.name
					}

					arrayFile.push(fileI);//Agregamos el file actual a el array de files temporales
					this.fileArrayName.push(fileI);//Agregamos el file actual al file de nombres
					this.request.Files = arrayFile;//Agregamos el array de objetos al atributo del objeto Request
					this.fileArrayDelete = arrayFile;//Creamos el array para files borrados, esto evita el undefined
				}

				reader.onerror = (e) => { console.log(e); }
				reader.readAsDataURL(file);
			}

		}
	}

	//Elimina los files y almacena el array de files restantes
	deleteFile(file: object, index: number): void {
		this.isFileArrayDelete = true;
		this.fileArrayDelete = [];//Reiniciamos en vacio el array de files borrados
		let array = this.request.Files; //Almacenamos los files actuales en un array auxiliar
		for (let i = 0; i < array.length; i++) {
			if (i == index) {
				$('#file-' + i).css("display", "none")
				delete array[index];
			}
		}
		//Vamos agregando los files restantes
		array.forEach(element => {
			this.fileArrayDelete.push(element);
		});

		//Necesario para las validaciones
		if (this.fileArrayDelete.length <= 5) {
			this.isFileValid = true;
			this.fileName = "Subir archivo"
		} else {
			this.isFileValid = false;
		}
	}

	//#endregion funciones para el manejo de carga de files

	//#region CRUD

	//Obtiene todos los documentos de la lista de configuracion de la api
	getDocuments(): void {
		this._documentService.All().subscribe
			(
				response => {
					this.documentTypes = response;
				},
				error => {
					console.log(error);
					this.failedConect = environment.failed;
				}
			);
	}
	//Obtiene todos los origines de la lista de configuracion de la api
	getOrigins(): void {
		this._originService.All().subscribe
			(
				response => {
					this.originRequests = response;
				},
				error => {
					console.log(error);
					this.failedConect = environment.failed;
				}
			);
	}

	//Envia la peticion para reigstrar una request
	register(form: NgForm) {
		this.isLoading = true;
		this.isButton = true;
		let string = form.value.manifestacionResponse;
		let stringResponse = string.charAt(0).toUpperCase() + string.slice(1);

		//Si se han borrado files durante el proceso de carga, actualizamos el request.Files para evitar los empty
		if (this.isFileArrayDelete) {
			this.request.Files = this.fileArrayDelete;
		}

		//Seteamos los atributos respectivos
		if (stringResponse === "No") {
			this.request.description = form.value.description;
			this.request.manifestacionResponse = stringResponse;
			this.request.firstName = "";
			this.request.lastName = "";
			this.request.email = "";
			this.request.documentType = "";
			this.request.document = "";
			this.request.originRequest = "";
		}

		if (stringResponse === "Si") {
			this.request.description = form.value.description;
			this.request.manifestacionResponse = stringResponse;
			this.request.firstName = form.value.firstName;
			this.request.lastName = form.value.lastName;
			this.request.email = form.value.email;
			this.request.documentType = form.value.documentType;
			this.request.document = form.value.document;
			this.request.originRequest = form.value.originRequest;
		}

		//Llamamos al servicio para generar la peticion
		this._requestService.create(this.request).subscribe(
			response => {
				this.isLoading = false;
				let url = "http://www.eafit.edu.co/Paginas/PortalAccesoPQRSFQA.aspx";
				window.top.location.href = url; //Esto hace que redireccione fuera del iframe
			},
			error => {
				console.log(error);
				alert(environment.conexionFailed)
				this.reLoad()
				/* this.isButton = false;
				this.isLoading = false; */
			}
		);
	}

	//#endregion CRUD

	//#region funciones utiles

	//Inicializo una request
	initInterface(): void {
		this.request = {
			manifestacionType: this.manifestacionType,
			description: this.description,
			Files: [],
			manifestacionResponse: this.manifestacionResponse,
			firstName: this.firstName,
			lastName: this.lastName,
			email: this.email,
			documentType: this.documentType,
			document: this.document,
			originRequest: this.originRequest
		}
	}

	//Reseteamos los valores a sus estados originales
	resetAll() {
		this.description = "";
		this.fileName = "Subir archivo"
		this.manifestacionResponse = "";
		this.firstName = "";
		this.lastName = "";
		this.email = "";
		this.documentType = "";
		this.document = "";
		this.originRequest = "1:1";
		this.isYes = false;
		this.isNo = false;
		this.isButton = false;
		this.isFileValid = true;
		this.isLoading = false;
		this.isFailedConectBool = false;
		this.fileArrayName = null;
		this.fileArrayDelete = [];
		this.isFileArrayDelete = false;
		this.request.Files = [];
	}

	//Retroceder
	goBack() {
		this._router.navigate(['/']);
	}

	//Recargar la pagina
	reLoad() {
		window.location.reload();
	}

	//#endregion funciones utiles

}
