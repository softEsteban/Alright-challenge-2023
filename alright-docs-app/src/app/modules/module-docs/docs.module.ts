import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocDetailComponent } from './doc-detail/doc-detail.component';
import { CreateDocComponent } from './create-doc/create-doc.component';
import { DocViewerComponent } from './doc-viewer/doc-viewer.component';
import { DocListComponent } from './doc-list/doc-list.component';



@NgModule({
  declarations: [
    DocDetailComponent,
    CreateDocComponent,
    DocViewerComponent,
    DocListComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DocsModule { }
