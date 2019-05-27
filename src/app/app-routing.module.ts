import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainDemoComponent } from './pages/main-demo/main-demo.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

const routes: Routes = [
  { path: '', component: MainDemoComponent },
  { path: 'users/:username', component: UserProfileComponent },


  // LAST ROUTE - 404
  { path: '**', redirectTo: '' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
