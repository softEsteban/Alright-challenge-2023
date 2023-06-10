import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../../services/layout.service';
import { AuthService } from '../../services/auth.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class LayoutComponent implements OnInit {

  profileConfig: any = [{
    "title": "Mis documentos",
    "method": "router$docs/my-docs",
    "icon": "file",
    "children": []
  }, {
    "title": "Mis revisiones",
    "method": "router$docs/revision",
    "icon": "file",
  }];

  userData: any;
  userName: string = "";
  userPic: string = "";


  isCollapsed = true;
  itemCurrent: any;

  constructor(
    private router: Router,
    public layoutService: LayoutService,
    private authService: AuthService,
    private modalService: NzModalService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.getUserData();
    }, 4000);
    this.redirectToDocs('my-docs')
    // this.redirectToDocs('revision')
  }

  // redirectToDocs(docState: any) {
  //   this.router.navigate(['/docs', docState], { state: { docState: docState } });
  // }

  // redirectToDocs(docState: any) {
  //   const url = `/docs/${docState}`;
  //   this.router.navigateByUrl(url, { state: { docState: docState } });
  // }
  redirectToDocs(docState: any) {
    const url = `/docs/my-docs`;
    this.router.navigateByUrl(url);
  }


  getUserData() {
    let user = localStorage.getItem("user");
    if (user != null) {
      this.userData = JSON.parse(user);
      this.userName = this.userData.name;
      // this.userPic = this.userData.use_pic;
    }
  }

  /**
   * Receives configured in "method" key.
   * Executes a method in the class or navigates
   * with $ wildcard
   * @param name 
   * @returns 
   * @author Esteban Toro
   */
  executeMethod(name: string) {
    let split = name.split("$");
    if (name == null) {
      return;
    } else if (name === 'logout') {
      this.logout();
    } else if (split[0] == "router") {
      this.router.navigate(["/", split[1]]);
    }
    return;
  }

  logout() {
    const modal: NzModalRef = this.modalService.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Do you want to leave?',
      nzOkText: 'Yes',
      nzOnOk: () => this.authService.logout()
    });
  }

}
