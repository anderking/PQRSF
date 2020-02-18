import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, AfterContentChecked } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { DocumentService } from 'src/app/core/services/document.service';
import { OriginService } from 'src/app/core/services/origin.service';
import { RequestService } from 'src/app/core/services/request.service';
import { Request } from 'src/app/models/request';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/core/services/shared.service';

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

	public manifestacionType: string;
	public description: string = "";
	public manifestacionResponse: string = "";
	public firstName: string = "";
	public lastName: string = "";
	public email: string = "";
	public documentType: string = "";
	public document: string = "";
	public originRequest: string = "1";
	public fileName: string = "Subir archivo";

	public request: Request;
	public originRequests: any;
	public documentTypes: any;

	public isYes: boolean = false;
	public isNo: boolean = false;
	public isButton: boolean = false;

	public filesToUpload: any;
	public isFileChosen: any;
	public isFileValid: boolean = true;
	public fileArrayName:object[];
	public fileArrayDelete:object[];
	public isFileArrayDelete: boolean = false;
	public isLoading: boolean = false;
	public failedConect: string;

	constructor
		(
			private _documentService: DocumentService,
			private _originService: OriginService,
			private _requestService: RequestService,
			private _sharedService: SharedService,
			private _router: Router,
			private route: ActivatedRoute,
	) {
	}

	ngOnInit() {
		this.route.queryParams.subscribe
			(
				params => {
					this.manifestacionType = params.manifestacionType;
				}
			);

		this.getDocuments();
		this.getOrigins();
		this.initInterface();
	}

	ngAfterContentChecked() {
		$(".selectpicker").selectpicker();
		$(".selectpicker~.btn").removeClass('btn-light');
		$(".selectpicker~.btn").css("border", "1px solid #ced4da");
		$(".selectpicker~.btn").css("border-radius", "0px");
	}

	initInterface() {
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

	getDocuments() {
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

	getOrigins() {
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

	changeResponse(event) {
		if (event == "Si") {
			this.isYes = true;
			this.isNo = false;
		} else {
			this.isNo = true;
			this.isYes = false;
		}
	}

	resetInputFile(event) {
		event.target.value = ''
	}

	uploadPic(event) {
		let filesInput = event.target.files;
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

		if (filesInput.length>0) {
			this.isFileChosen = true;

			let arrayFile = [];

			let maxFiles = filesInput.length;
			let maxFilesAcum;
			
			if(this.fileArrayDelete){
				maxFilesAcum = this.fileArrayDelete.length+maxFiles;
			}else{
				maxFilesAcum = this.request.Files.length;
			}

			if (maxFiles > 5 || maxFilesAcum > 5) {
				this.fileName = 'La cantidad maxima de archivos permitidos es de 5';
				if ( (maxFilesAcum-maxFiles) > 6) {
					this.isFileValid = false;
					return false;
				}else{
					this.isFileValid = true;
					return false
				}
			}

			this.fileArrayName = [];

			this.request.Files.forEach(element => {
				arrayFile.push(element);
				this.fileArrayName.push(element);
			});

			for (var i = 0; i < filesInput.length; i++) {
				this.isFileValid = true;

				let currentFile = filesInput[i];

				let extension = allowed_types.includes(currentFile.type);

				if (!extension) {
					this.fileName = 'Solo se permiten archivos de tipo IMG, DOCS, PDF, TXT';
					if (maxFilesAcum > 6) {
						this.isFileValid = false;
						return false;
					}else{
						this.isFileValid = true;
						return false
					}
				}

				if (currentFile.size > max_size) {
					this.fileName = 'Tamaño maximo permitido ' + max_size / 1000000 + 'Mb';
					if (maxFilesAcum > 6) {
						this.isFileValid = false;
						return false;
					}else{
						this.isFileValid = true;
						return false
					}
				}

				let file: File = currentFile;
				if (maxFiles > 1) {
					this.fileName = "Subir archivo"
				} else {
					this.fileName = "Subir archivo"
				}

				let reader = new FileReader();

				reader.onload = (e: any) => {
					let fileI: FileI
					let result = e.target.result;
					let separator = "base64,";
					let arrayResult = result.split(separator);
					let newContent = arrayResult[1];

					fileI = {
						Content: newContent,
						FileName: file.name
					}
					arrayFile.push(fileI);
					this.fileArrayName.push(fileI);
					this.request.Files = arrayFile;
					this.fileArrayDelete = arrayFile;
				}
				reader.onerror = (e) => { console.log(e); }
				reader.readAsDataURL(file);
			}

		}
	}

	deleteFile(file:object,index:number){
		this.isFileArrayDelete = true;
		this.fileArrayDelete = [];
		let array = this.request.Files;
		for (let i = 0; i < array.length; i++) {
			if(i==index){
				$('#file-'+i).css("display","none")
				delete array[index];
			}	
		}
		array.forEach(element => {
			this.fileArrayDelete.push(element);
		});
		if(this.fileArrayDelete.length<=5){
			this.isFileValid = true;
			this.fileName = "Subir archivo"
		}else{
			this.isFileValid = false;
		}
	}

	

	register(form: NgForm) {
		//this.isLoading = true;
		//this.isButton = true;
		let string = form.value.manifestacionResponse;
		let stringResponse = string.charAt(0).toUpperCase() + string.slice(1);
		if(this.isFileArrayDelete){
			this.request.Files = this.fileArrayDelete;
		}else{
		}

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

		console.log(this.request)

		/*this._requestService.create(this.request).subscribe(
			response => {
				this.isLoading = false;
				//alert("Solicitud Enviada Correctamente");
				this._sharedService.emitChange(true);
				window.location.reload();
			},
			error => {
				console.log(error);
				alert(error.message)
				this.isButton = false;
				this.isLoading = false;
			}
		);*/
	}

	resetAll() {
		this.description = "";
		this.manifestacionResponse = "";
		this.firstName = "";
		this.lastName = "";
		this.email = "";
		this.documentType = "";
		this.document = "";
		this.originRequest = "1:1";
		this.fileName = "Subir archivo"
		this.isYes = false;
		this.isNo = false;
		this.isButton = false;
		this.isFileValid = true;
		this.isLoading = false;
		this.fileArrayName = null;
		this.fileArrayDelete = [];
		this.isFileArrayDelete = false;
		this.request.Files = [];
	}

	goBack() {
		this._router.navigate(['/']);
	}

	reLoad() {
		window.location.reload();
	}

}
