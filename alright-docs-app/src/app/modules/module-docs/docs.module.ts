import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DocDetailComponent } from './doc-detail/doc-detail.component';
import { CreateDocComponent } from './create-doc/create-doc.component';
import { DocViewerComponent } from './doc-viewer/doc-viewer.component';
import { DocListComponent } from './doc-list/doc-list.component';
import { NgZorroModule } from 'src/app/shared/ng-zorro.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    DocDetailComponent,
    CreateDocComponent,
    DocViewerComponent,
    DocListComponent
  ],
  imports: [
    CommonModule,
    NgZorroModule,
    PdfViewerModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    DatePipe
  ]
})
export class DocsModule { }
