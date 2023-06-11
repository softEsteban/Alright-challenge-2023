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
import { DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

interface Doc {
  _id: string;
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
    private viewContainerRef: ViewContainerRef,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router) {
    globalService.setTitle("Docs");
    registerLocaleData(localeEs);
  }


  ngOnInit(): void {

    //Fetch data
    this.userId = this.authService.getSessionUserId();
    this.getDocuments();

    //Subscribes to detect changes in route
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentState = this.router.getCurrentNavigation()?.extras.state;

        if (currentState && currentState['docState']) {
          this.pageTitle = currentState['docState'] === 'my-docs' ? 'Mis documentos' : 'Mis revisiones';
          this.docState = currentState['docState'];

          if (currentState['docState'] === 'revision') {
            this.listOfDocs = this.listOfDocs.filter((doc) => doc.state === 'En revisión');
          } else {
            this.getDocuments();
          }
        } else {
          this.docState = '';
        }
      }
    });
  }

  async getDocuments() {
    let data: any = await this.docsService.getAllDocsByUser(this.userId);
    console.log(data);
    if (data.length > 0) {
      this.listOfDocs = data;
    }
  }

  createMessage(type: string, text: string): void {
    this.message.create(type, `${text}`);
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
    await modal.afterClose.subscribe(createdDoc => {
      this.getDocuments();
    });

  }

  viewPdf(url: string) {
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

  async sendToRevision(item: any) {
    const index = this.listOfDocs.findIndex((doc) => doc._id === item._id);
    if (index !== -1) {
      this.listOfDocs.splice(index, 1);
    }

    const data: any = await this.docsService.requestRevision(item._id);
    if (data) {
      this.listOfDocs.push(data);
      this.createMessage("success", "El documento se ha enviado a revisión");
    }
  }

  downloadPdf(): void {
  }
}


