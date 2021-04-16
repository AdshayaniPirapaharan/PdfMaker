import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
//import { platform } from 'node:os';
import { HttpClient } from '@angular/common/http';
import { Plugins, CameraResultType, CameraSource, FilesystemDirectory } from '@capacitor/core';
const {Camera, Filesystem} = Plugins;
import { FileOpener } from '@ionic-native/file-opener/ngx';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({ 
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
   myForm: FormGroup;
   pdfObj = null;
   base64Image = null;
   photoPreview = null;
   logoData = null;

  constructor(private fb: FormBuilder,  private  http: HttpClient, private fileopener: FileOpener) {}

   ngOnInit(){
     this.myForm = this.fb.group({
       showLogo: true,
       from: 'Simon',
       to: 'Max',
       text: 'TEST'

     });
     this.loadLocalAssetToBase64();
   }

   loadLocalAssetToBase64(){
     this.http.get('',{ responseType: 'blob'})
     .subscribe(res=> {
       const reader = new FileReader();
       reader.onloadend = () => {
         this.logoData = reader.result;
       }
       reader.readAsDataURL(res);
      }); 
     

     

   }
   createPdf() {
     const formValue = this.myForm.value;

     const docDefinition = {
       watermark: { text: 'Ionic Academy', color: 'blue', opacity: 0.2, bold:true},
       content: [
        {
          columns: [
             {
               text: new Date().toTimeString(),
               alignemnet: 'right'
             }

          ]
        },
        {text:'Reminder', style: 'header'},
        { columns: [
          {
            width: '50%',
            text: 'From',
            style: 'subheader'
          },
          {
            width: '50%',
            text: 'To',
            style: 'subheader'
          }
        ]
      },
      {
        columns: [
          {
            width: '50%',
            text: formValue.from
          },
          {
            width: '50%',
            text: formValue.to
          }
        ]
      }

      ],
       styles: {
        header:{
          fontSize: 18,
          bold: true,
          margin: [0,15,0,0]
        },
        subheader:{
         fontSize: 14,
         bold: true,
         margin: [0,15,0,0]
       }
       
      }
       
     }
     
     this.pdfObj = pdfMake.createPdf(docDefinition);
     console.log(this.pdfObj);
     
   }
   downloadPdf(){
     this.pdfObj.download();
   }

   
}