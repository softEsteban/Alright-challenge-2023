import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CreateDocComponent } from './create-doc/create-doc.component';
import { DocListComponent } from './doc-list/doc-list.component';
import { NgZorroModule } from 'src/app/shared/ng-zorro.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CreateDocComponent,
    DocListComponent
  ],
  imports: [
    CommonModule,
    NgZorroModule,
    PdfViewerModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    DatePipe
  ]
})
export class DocsModule { }
