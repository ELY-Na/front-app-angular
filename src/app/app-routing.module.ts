import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CountryDetailsComponent } from './pages/country-details/country-details.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
   {
    path: 'country', 
    component: CountryDetailsComponent,
  },
  {
    path: 'country/:id', 
    component: CountryDetailsComponent,
  },
  {
    path: '**', // wildcard
    component: NotFoundComponent, // 404 toujours à mettre à la fin sinon erreur
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}
