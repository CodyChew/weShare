// Angular core modules.
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { ExploreComponent } from './pages/explore/explore.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RequestSectionComponent } from './pages/explore/request-section/request-section.component';


const routes: Routes = [

    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent},
    { path: 'explore', component: ExploreComponent,
        children: [{path: 'request-section', component: RequestSectionComponent}]},
    
    {path: '**', redirectTo: 'home'}
    //{ path: 'explore', redirectTo: '/explore'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
