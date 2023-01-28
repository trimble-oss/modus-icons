import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { HomeComponent } from './home/home.component';
import { SetComponent } from './set/set.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: ':setName', component: SetComponent },
  { path: ':setName/:iconName', component: DetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
