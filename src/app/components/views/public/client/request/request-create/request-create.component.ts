import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Location} from '@angular/common';
import { DocumentService } from 'src/app/core/services/document.service';
import { OriginService } from 'src/app/core/services/origin.service';
import { RequestService } from 'src/app/core/services/request.service';
import { Request } from 'src/app/models/request';

@Component({
  selector: 'app-request-create',
  templateUrl: './request-create.component.html',
  styleUrls: ['./request-create.component.css']
})
export class RequestCreateComponent implements OnInit {

	public manifestacionType:string;
	public description:string="";
	public manifestacionResponse:string="";
	public firstName:string="";
	public lastName:string="";
	public email:string="";
	public documentType:string="";
	public document:string="";
	public originRequest:string="1";
	public fileName:string="Subir archivo";

	public request:Request;
	public originRequests:any;
	public documentTypes:any;

	public isYes:boolean=false;
	public isNo:boolean=false;
	public isButton:boolean=false;

	public filesToUpload:any;
	public isFileChosen:any;
	public isFileValid:boolean=true;
	@ViewChild('registerForm',{static:false}) registerForm;

	constructor
	(
		private _documentService: DocumentService,
		private _originService: OriginService,
		private _requestService: RequestService,
		private _router: Router,
		private route: ActivatedRoute,
		private _location: Location,
	)
	{
	}

	ngOnInit()
	{
		this.route.queryParams.subscribe
		(
			params =>
			{
        		this.manifestacionType = params.manifestacionType;
      		}
      	);
      	this.getDocuments();
		this.getOrigins();
		this.initInterface();
	}

	initInterface(){
		this.request = {
			manifestacionType:this.manifestacionType,
			description:this.description,
			file:null,
			manifestacionResponse:this.manifestacionResponse,
			firstName:this.firstName,
			lastName:this.lastName,
			email:this.email,
			documentType:this.documentType,
			document:this.document,
			originRequest:this.originRequest
		}
	}

	getDocuments()
	{
		this._documentService.All().subscribe
		(
			response =>
			{
				this.documentTypes = response;
			},
			error => 
			{
				console.log(error);
			}
		);
	}

	getOrigins()
	{
		this._originService.All().subscribe
		(
			response =>
			{
				this.originRequests = response;
			},
			error => 
			{
				console.log(error);
			}
		);
	}

	changeResponse(event)
	{
		if(event=="si")
		{
			this.isYes=true;
			this.isNo=false;
		}else
		{
			this.isNo=true;
			this.isYes=false;
		}
	}

	uploadPic(event)
	{
		let file: File = event.target.files[0];
		if (file)
		{
			this.isFileChosen = true;
			this.fileName = file.name;

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
			const allowed_types = [docx,doc,xlsx,xls,pptx,ppt,mdb,jpg,jpeg,png,pdf];
			const max_size = 6000000; // 6 Mb
            const max_height = 15200;
            const max_width = 25600;
 
            if (file.size > max_size) {
				this.fileName = 'Tamaño maximo permitido ' + max_size / 1000000 + 'Mb';
				this.isFileValid = false;
                return false;
            }
 
            /*if (!_.includes(allowed_types, file)) {
                this.fileName = 'Only Images are allowed ( JPG | PNG )';
                return false;
            }*/

			let reader = new FileReader();

			reader.onload = (e: any) =>
			{
				this.request.file = e.target.result;
				this.isFileValid = true;
				
				//console.log(typeof(this.request.file));
			}

			reader.onerror = (e) => {
				console.log(e);
			}

			reader.readAsDataURL(file);
		}
	}

	register(form: NgForm)
	{
		this.isButton = true;

			if(form.value.manifestacionResponse=="no")
			{
				this.request.description = form.value.description;
				this.request.manifestacionResponse = form.value.manifestacionResponse;
				this.request.firstName = "";
				this.request.lastName = "";
				this.request.email = "";
				this.request.documentType = "";
				this.request.document = "";
				this.request.originRequest="";
			}

			if(form.value.manifestacionResponse=="si")
			{
				this.request.description = form.value.description;
				this.request.manifestacionResponse = form.value.manifestacionResponse;
				this.request.firstName = form.value.firstName;
				this.request.lastName = form.value.lastName;
				this.request.email = form.value.email;
				this.request.documentType = form.value.documentType;
				this.request.document = form.value.document;
				this.request.originRequest=form.value.originRequest;
			}


			this._requestService.create(this.request).subscribe(
				response => {
					console.log("Registrado Exitosamente");
					//this.reset();
					form.reset();
					this.reset();
				},
				error => {
					console.log(error);
				}
			);
		
	}

	reset(){
		this.description="";
		this.manifestacionResponse="";
		this.firstName="";
		this.lastName="";
		this.email="";
		this.documentType="";
		this.document="";
		this.originRequest="1";
		this.fileName="Subir archivo"
		this.isYes=false;
		this.isNo=false;
		this.isButton=false;
	}

	goBack()
	{
		this._location.back();
	}

}
