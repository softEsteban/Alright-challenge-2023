import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from 'src/app/services/global.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;
  public showSpinner = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService,
    private globalService: GlobalService
  ) {
    globalService.setTitle("Login");
  }

  ngOnInit(): void {
    this.initForm();
  }

  createMessage(type: string, text: string): void {
    this.message.create(type, `${text}`);
  }

  private initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]]
    })
  }

  /**
   * 
   */
  async login({ value, valid }: { value: any, valid: boolean }): Promise<any> {

    if (value.email == "" || value.password == "") {
      return this.createMessage("error", "Wanna trick me? Complete the login")
    }

    let credentials = { email: value.email, password: value.password }
    let data = await this.authService.login(credentials);
    let user = JSON.parse(JSON.stringify(data))

    if (user && user["message"] == "Invalid email") {
      return this.createMessage("warning", "Invalid email")
    }
    // if (user && user["message"] == "User email hasn't been confirmed!") {
    //   return this.createMessage("warning", "User email hasn't been confirmed!")
    // }
    if (user["message"] == "Invalid password") {
      return this.createMessage("error", "Wrong password. Have another go!")
    }
    if (user && user["user"]) {
      // localStorage.setItem('token', user["user"][0]["token"]);
      // localStorage.setItem('profile', JSON.stringify(user["user"][0]["pro_config"]));
      localStorage.setItem('user', JSON.stringify(user["user"]));
      localStorage.setItem('token', "anytokenhere");
      this.router.navigate(["/"]);
    }
  }


  public loginWithGoogle() {

  }

  public goToRegister() {
    this.router.navigate(["/register"]);
  }
}

