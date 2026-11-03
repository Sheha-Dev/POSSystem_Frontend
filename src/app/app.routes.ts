import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((page) => page.LoginPage)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout/main-layout.component')
      .then((page) => page.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard.component')
          .then((page) => page.DashboardComponent)
      }
    ]
  },
  {
    path: 'purchase-bill',
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./layout/main-layout/main-layout.component')
          .then((page) => page.MainLayoutComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/purchase-bill/purchase-bill-shell/purchase-bill-shell.component')
              .then((page) => page.PurchaseBillShell),
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'details/items' },
              {
                path: 'header',
                data: { title: 'Header' },
                loadComponent: () => import('./pages/purchase-bill/section-placeholder/section-placeholder.component')
                  .then((page) => page.PurchaseSectionPlaceholder)
              },
              {
                path: 'details',
                loadComponent: () => import('./pages/purchase-bill/details/details-shell.component')
                  .then((page) => page.PurchaseDetailsShell),
                children: [
                  { path: '', pathMatch: 'full', redirectTo: 'items' },
                  {
                    path: 'items',
                    loadComponent: () => import('./pages/purchase-bill/details/items/items-page.component')
                      .then((page) => page.PurchaseItemsPage)
                  },
                  ...['accounts', 'taxes'].map((title) => ({
                    path: title,
                    data: { title: title[0].toUpperCase() + title.slice(1) },
                    loadComponent: () => import('./pages/purchase-bill/section-placeholder/section-placeholder.component')
                      .then((page) => page.PurchaseSectionPlaceholder)
                  }))
                ]
              },
              ...['notes', 'documents'].map((title) => ({
                path: title,
                data: { title: title[0].toUpperCase() + title.slice(1) },
                loadComponent: () => import('./pages/purchase-bill/section-placeholder/section-placeholder.component')
                  .then((page) => page.PurchaseSectionPlaceholder)
              }))
            ]
          },
        ]
      }
    ]
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' }
];
