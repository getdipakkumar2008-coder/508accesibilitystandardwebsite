import { Routes } from '@angular/router';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';
import { Home } from './pages/home/home';
import { Services } from './pages/services/services';

export const routes: Routes = [
  { path: '', component: Home, title: 'Home | Accessible Gov Site', pathMatch: 'full' },
  { path: 'about', component: About, title: 'About | Accessible Gov Site' },
  { path: 'services', component: Services, title: 'Services | Accessible Gov Site' },
  { path: 'contact', component: Contact, title: 'Contact | Accessible Gov Site' },
  { path: '**', redirectTo: '' },
];
