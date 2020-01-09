import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Location} from '@angular/common';
import { DocumentService } from 'src/app/core/services/document.service';
import { OriginService } from 'src/app/core/services/origin.service';

@Component({
  selector: 'app-request-create',
  templateUrl: './request-create.component.html',
  styleUrls: ['./request-create.component.css']
})
export class RequestCreateComponent implements OnInit {

	public manifestation:string;
	public description:string="";
	public response:string="";
	public name:string="";
	public lastName:string="";
	public email:string="";
	public document:string="";
	public dni:string="";
	public origin:string="3";
	public fileName:string="Subir archivo";

	public origins:any;
	public documents:any;
	public isYes:boolean=false;
	public isNo:boolean=false;
	public filesToUpload:any;
	public isFileChosen:any;

	constructor
	(
		private _documentService: DocumentService,
		private _originService: OriginService,
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
        		this.manifestation = params.manifestation;
      		}
      	);
      	this.getDocuments();
      	this.getOrigins();
	}

	getDocuments()
	{
		this._documentService.All().subscribe
		(
			response =>
			{
				this.documents = response;
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
				this.origins = response;
			},
			error => 
			{
				console.log(error);
			}
		);
	}

	changeResponse(event)
	{
		if(event=="yes")
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
		console.log(form.value)
		alert("Formulario enviado")
		this.reset();
		
	}

	reset(){
		this.description="";
		this.response="";
		this.name="";
		this.lastName="";
		this.email="";
		this.document="";
		this.dni="";
		this.origin="2";
		this.fileName="Subir archivo"
		this.isYes=false;
		this.isNo=false;
	}

	goBack()
	{
		this._location.back();
	}

}
