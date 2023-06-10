import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroModule } from 'src/app/shared/ng-zorro.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateUserComponent } from './create-user/create-user.component';


@NgModule({
  declarations: [
    CreateUserComponent
  ],
  imports: [
    CommonModule,
    NgZorroModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class UsersModule { }
