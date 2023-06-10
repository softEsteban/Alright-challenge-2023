import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './modules/module-home/home/home.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { DocListComponent } from './modules/module-docs/doc-list/doc-list.component';
// canActivate: [AuthGuard]
const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: 'home', component: HomeComponent },
      { path: 'docs/:docState', component: DocListComponent }
    ]
  },
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  {
    path: '**',
    component: NotFoundComponent,
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
