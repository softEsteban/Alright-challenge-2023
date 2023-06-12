import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public registerForm!: FormGroup;
  companies: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private message: NzMessageService,
    private globalService: GlobalService
  ) {
    globalService.setTitle("Register")
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
      passwordConfirm: ["", [Validators.required]]
    })
  }

  createMessage(type: string, text: string): void {
    this.message.create(type, `${text}`);
  }

  async register({ value, valid }: { value: any, valid: boolean }): Promise<any> {
    if (value.password != value.passwordConfirm) {
      return this.createMessage("error", "Passwords must match");
    }

    const user = {
      name: value.firstName,
      lastname: value.lastName,
      email: value.email,
      password: value.password,
      type: "user"
    };

    try {
      const data = await this.authService.register(user);
      if (data) {
        let response = JSON.parse(JSON.stringify(data));
        if (response["message"] === "User registered successfully") {
          this.createMessage("success", "User has been created!");
          this.router.navigate(["/login"]);
        }
        else if (response["message"] === "A user with this email already exists") {
          this.createMessage("error", "Email already belongs to another user");
        }
      } else {
        this.createMessage("error", "An error occurred during registration");
      }
    } catch (error) {
      console.log(error);
      this.createMessage("error", "Email already belongs to another user");
    }
  }

  public goToLogin() {
    this.router.navigate(["/login"]);
  }
} 
