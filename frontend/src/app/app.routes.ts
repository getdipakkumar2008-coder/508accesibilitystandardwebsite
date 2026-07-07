import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
  { path: '', component: Home, title: 'Home | Accessible Gov Site', pathMatch: 'full' },
  { path: 'contact', component: Contact, title: 'Contact | Accessible Gov Site' },
  { path: '**', redirectTo: '' },
];
