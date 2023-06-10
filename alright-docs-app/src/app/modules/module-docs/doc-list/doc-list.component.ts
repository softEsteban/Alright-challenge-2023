import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-doc-list',
  templateUrl: './doc-list.component.html',
  styleUrls: ['./doc-list.component.scss']
})
export class DocListComponent implements OnInit {

  docState: string = "";

  constructor(
    private globalService: GlobalService) {
    globalService.setTitle("Docs");
  }


  ngOnInit(): void {
    this.docState = history.state.docState;
    // this.globalService.setTitle(this.docState);
    console.log(this.docState)
  }


}
