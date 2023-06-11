import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { Router, NavigationEnd } from '@angular/router';
import { DocsService } from '../services/docs.service';
import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CreateDocComponent } from '../create-doc/create-doc.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FirebaseService } from 'src/app/services/firebase.service';



interface Doc {
  id: string;
  name: string;
  url: string;
  state: string;
  dateCreated: Date;
  userId: string;
}

@Component({
  selector: 'app-doc-list',
  templateUrl: './doc-list.component.html',
  styleUrls: ['./doc-list.component.scss']
})
export class DocListComponent implements OnInit {

  pageTitle: string = "";

  listOfDocs: Doc[] = [];
  docState: string = "";
  pdfSrc: string = "";

  userId: string = "";

  constructor(
    private globalService: GlobalService,
    private docsService: DocsService,
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private viewContainerRef: ViewContainerRef,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router) {
    globalService.setTitle("Docs");
  }


  ngOnInit(): void {


    //Subscribes to detect changes in route
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentState = this.router.getCurrentNavigation()?.extras.state;
        if (currentState && currentState['docState']) {
          this.pageTitle = currentState['docState'] == "my-docs" ? "Mis documentos" : "Mis revisiones"
          this.docState = currentState['docState'];
        } else {
          this.docState = "";
        }
      }
    });

    //Fetchs data
    this.userId = this.authService.getSessionUserId();
    this.getDocuments();

    // const pdfDocGenerator = pdfMake.createPdf(this.pdfDefinition);

    // pdfDocGenerator.getBase64((data) => {
    //   const base64 = `data:application/pdf;base64,${data}`;
    //   this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(base64);
    // });
  }

  async getDocuments() {
    let data: any = await this.docsService.getAllDocsByUser(this.userId);
    console.log(data);
    if (data.length > 0) {
      this.listOfDocs = data;
      // this.listOfData = data.data;
      // this.filteredData = data.data;
    }
  }

  async openCreateDocModal(): Promise<any> {
    const modal = this.modal.create({
      nzTitle: 'Create document',
      nzStyle: {
        "@media (max-width: 767px)": {
          width: "560px",
          top: '0px'
        },
        "@media (min-width: 768px)": {
          width: "700px",
          top: '0px'
        }
      },
      nzContent: CreateDocComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        userId: this.userId
      },
      nzFooter: null,
      nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000))
    });
    modal.getContentComponent();
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    await modal.afterClose.subscribe(createdUser => {
      // this.getUsers();
    });

  }

  viewPdf(url: string) {
    // this.pdfSrc = url;
    const filePath = `${this.pdfSrc}`; // Replace with the actual file path in Firebase Storage
    this.firebaseService.downloadFile(filePath)
      .then((downloadUrl) => {
        this.pdfSrc = downloadUrl;
        console.log('Download URL:', downloadUrl);
        window.open(downloadUrl, '_blank'); // Open the download URL in a new tab/window
      })
      .catch((error: any) => {
        console.error('Error downloading file:', error);
      });
  }

  sendToRevision(item: {}) {
    console.log(item)
  }

  downloadPdf(): void {
    // // Replace the following URL with your desired PDF URL
    // const pdfUrl = 'https://firebasestorage.googleapis.com/v0/b/mantis-project-7c277.appspot.com/o/alright-docs%2Freglamento-fic-inmobiliario-rentamas.pdf?alt=media&token=9e0602d5-0557-4384-b4b5-99a5d8825532&_gl=1*175a73*_ga*ODU4MzgwMDIuMTY3OTg3OTU4NQ..*_ga_CW55HF8NVT*MTY4NjQ1MjIzMC4zNC4wLjE2ODY0NTIyMzAuMC4wLjA.';

    // // Sanitize the PDF URL
    // this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl) as string;


  }
}


