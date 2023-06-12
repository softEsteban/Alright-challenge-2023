import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { Router, NavigationEnd } from '@angular/router';
import { DocsService } from '../services/docs.service';
import { AuthService } from 'src/app/services/auth.service';
import { CreateDocComponent } from '../create-doc/create-doc.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FirebaseService } from 'src/app/services/firebase.service';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

interface Log {
  _id: string;
  action: string;
  dateCreated: Date;
  docId: string;
  userId: { _id: string, name: string, lastName: string };
}

interface Doc {
  _id: string;
  name: string;
  url: string;
  state: string;
  dateCreated: Date;
  userId: string;
}

interface User {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-doc-list',
  templateUrl: './doc-list.component.html',
  styleUrls: ['./doc-list.component.scss']
})
export class DocListComponent implements OnInit {

  pageTitle: string = "";

  listOfDocs: Doc[] = [];
  selectedDoc: any;
  docHistory: Log[] = [];
  docState: string = "my-docs";

  userId: string = "";
  users: User[] = [];
  selectedUser: string | null = null;


  pdfSrc: string = "";

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
    this.getUsersSelect();

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

  async getUsersSelect() {
    let data: any = await this.docsService.getUsersSelect();
    if (data.length > 0) {
      this.users = data;
    }
  }

  async getHistoryLogs() {
    if (this.selectedDoc._id) {
      let data: any = await this.docsService.getDocHistory(this.selectedDoc._id);
      if (data.length > 0) {
        this.docHistory = data;
      }
    }
  }

  createMessage(type: string, text: string): void {
    this.message.create(type, `${text}`);
  }

  async openCreateDocModal(): Promise<any> {
    const modal = this.modal.create({
      nzTitle: 'Crear documento',
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
    const filePath = `${this.pdfSrc}`;
    this.firebaseService.downloadFile(filePath)
      .then((downloadUrl) => {
        this.pdfSrc = downloadUrl;
        console.log('Download URL:', downloadUrl);
        window.open(downloadUrl, '_blank');
      })
      .catch((error: any) => {
        console.error('Error downloading file:', error);
      });
  }


  async sendToRevision(): Promise<void> {
    if (!this.selectedDoc) {
      return;
    }

    const index = this.listOfDocs.findIndex((doc) => doc._id === this.selectedDoc._id);
    if (index === -1) {
      return;
    }

    const data: any = await this.docsService.requestRevision(this.selectedDoc._id, this.selectedUser as string, this.userId);
    if (data && data.message) {
      this.createMessage("success", data.message);
      return;
    }

    if (data) {
      this.listOfDocs.splice(index, 1);
      this.listOfDocs.push(data);
      this.createMessage("success", "El documento se ha enviado a revisión");
    }
  }

  downloadPdf(): void {
  }

  acceptDoc(item: any): void {
    const docId = item._id;
    const newState = "Aceptado";
    const userId = this.userId;
    this.docsService.handleDocument(docId, newState, userId);
    this.createMessage("success", "Documento aceptado");

  }

  declineDoc(item: any): void {
    const docId = item._id;
    const newState = "Rechazado";
    const userId = this.userId;
    this.docsService.handleDocument(docId, newState, userId);
    this.createMessage("success", "Documento denegado");

  }


  selectDoc(item: any): void {
    if (this.selectedDoc === item) {
      this.selectedDoc = null;
    } else {
      this.selectedDoc = item;
      this.getHistoryLogs();
    }
  }

}


