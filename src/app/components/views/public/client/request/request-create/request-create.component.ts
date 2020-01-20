import { Component, OnInit } from '@angular/core';
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

	preUpload(event: any)
	{
		let file = event.target.files[0];
		if (event.target.files.length > 0)
		{
			this.isFileChosen = true;
		}        
		this.fileName = file.name;
		this.filesToUpload = <Array<File>>event.target.files;
		console.log(this.filesToUpload)
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
					this.reset();
				},
				error => {
					console.log(error);
					this.reset();
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
		this.originRequest="";
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
