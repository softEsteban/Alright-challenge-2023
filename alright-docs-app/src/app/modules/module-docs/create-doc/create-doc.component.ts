// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-create-doc',
//   templateUrl: './create-doc.component.html',
//   styleUrls: ['./create-doc.component.scss']
// })
// export class CreateDocComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }



import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DocsService } from '../services/docs.service';
import { FirebaseService } from 'src/app/services/firebase.service';


interface IFile {
  doc_url: string;
  doc_type: string;
}

@Component({
  selector: 'app-create-doc',
  templateUrl: './create-doc.component.html',
  styleUrls: ['./create-doc.component.scss']
})
export class CreateDocComponent implements OnInit {

  public docForm!: FormGroup;
  userId: string = "";

  public uploadedFiles!: File[];
  fileList: any = [];

  loading = false;
  avatarUrl?: string;



  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private authService: AuthService,
    private docsService: DocsService,
    private modalRef: NzModalRef,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.firebaseService.listAllFiles();
  }
  private initForm(): void {
    this.docForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  // previewFile(file: File): void {
  //   const reader = new FileReader();
  //   reader.onload = (event: any) => {
  //     this.avatarUrl = event.target.result;
  //   };
  //   reader.readAsDataURL(file);
  // }

  handleFilesUpload(event: NzUploadChangeParam): void {
    const fileList: NzUploadFile[] = event.fileList;
    if (fileList.length > 0) {
      const list = fileList
        .map((file) => file.originFileObj as File | undefined)
        .filter((file): file is File => file !== undefined);
      console.log(list);
      this.uploadedFiles = list;
    }
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    // Define allowed file types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    // Define maximum file size in bytes
    const maxFileSize = 2 * 1024 * 1024;

    // Perform file type and size checks
    const isValidType = typeof file.type === 'string' && allowedTypes.includes(file.type);
    const isValidSize = typeof file.size === 'number' && file.size <= maxFileSize;

    if (!isValidType) {
      this.createMessage("error", "Invalid file type. Please upload an image (JPEG, PNG, PDF, DOC, EXCEL).");
    }

    if (!isValidSize) {
      this.createMessage("error", "File size exceeds the maximum limit (2MB).");
    }

    return isValidType && isValidSize;
  };



  async createDoc({ value, valid }: { value: any, valid: boolean }) {

    const userId = this.authService.getSessionUserId();
    let files: IFile[] | undefined = [];

    // // Processes files
    let fileUrls: string[] = [];

    if (this.uploadedFiles.length > 0) {
      // Uploads to Firebase
      fileUrls = await this.firebaseService.uploadFiles(this.uploadedFiles, "docs/", { "useCode": userId });

      // Assign the file URLs to the files array
      files = fileUrls.map((fileUrl, index) => ({
        doc_url: fileUrl,
        doc_type: this.uploadedFiles[index].type
      }));
    }

    //Request object
    const docData = {
      name: this.docForm.get('name')?.value,
      url: fileUrls[0],
      dateCreated: new Date(),
      userId: this.userId
    };

    try {
      const data = await this.docsService.createDoc(docData);
      let response = JSON.parse(JSON.stringify(data))

      if (response && response["message"] === "Doc was created") {
        this.modalRef.close();
        this.createMessage("success", `Doc has been created`)
      } else if (response["message"] === "Failed to create document") {
        this.createMessage("error", "There was a problem create the doc")
      }
    } catch (error) {
      this.modalRef.close();
      this.createMessage("error", "An error has ocurred")
    }
  }

  createMessage(type: string, text: string): void {
    this.message.create(type, `${text}`);
  }

}