# Angular Frontend Development Rules

## 1. Technology Stack

Follow these technologies and standards throughout the project:

- Use the latest stable Angular version compatible with the existing project.
- Use TypeScript.
- Use Angular Standalone Components.
- Use Bootstrap 5.3+ for UI components and responsive layouts.
- Use SCSS for component and global styling.
- Use Angular Router for navigation.
- Use Reactive Forms for all forms.
- Use Angular HttpClient for backend communication.
- Use RxJS Observables for asynchronous operations.
- Use Angular Signals where they provide a clear benefit for state management.
- Follow Angular's recommended coding practices and conventions.

Do not introduce additional UI frameworks or libraries without checking whether an existing project dependency can fulfil the requirement.

## 2. Architecture

Follow a Component-Based Architecture.

Separate the application into reusable components, pages, services, models, guards, interceptors, and layouts.

Responsibilities:

- **Components:** Handle reusable UI elements and user interactions.
- **Pages:** Represent application pages and coordinate page-level functionality.
- **Services:** Handle API communication and shared business logic.
- **Models:** Define TypeScript interfaces and types for application data.
- **Guards:** Control access to routes.
- **Interceptors:** Handle common HTTP request and response behaviour.
- **Layouts:** Provide shared application structures such as headers, navigation, and footers.
- **Environments:** Maintain environment-specific application configuration.

Keep components small, reusable, and focused on a single responsibility.

Avoid placing API communication or complex business logic directly inside components.

## 3. Project Folder Structure

Maintain the following folder structure. Create additional folders or files when required by the application.

```text
src/
├── app/
│   ├── components/
│   │   └── common/
│   │       ├── autocomplete-dropdown/
│   │       │   ├── autocomplete-dropdown.component.ts
│   │       │   ├── autocomplete-dropdown.component.html
│   │       │   └── autocomplete-dropdown.component.scss
│   │       └── popup-message/
│   │           ├── popup-message.component.ts
│   │           ├── popup-message.component.html
│   │           └── popup-message.component.scss
│   │
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.development.ts
│   │
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── route.guard.ts
│   │
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   │
│   ├── layout/
│   │   └── main-layout/
│   │       ├── main-layout.component.ts
│   │       ├── main-layout.component.html
│   │       ├── main-layout.component.scss
│   │       ├── header/
│   │       └── footer/
│   │
│   ├── models/
│   │   └── [model-name].model.ts
│   │
│   ├── pages/
│   │   └── [page-name]/
│   │       ├── [page-name].component.ts
│   │       ├── [page-name].component.html
│   │       └── [page-name].component.scss
│   │
│   ├── services/
│   │   ├── api.service.ts
│   │   ├── auth.service.ts
│   │   └── theme.service.ts
│   │
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
│
├── assets/
├── styles.scss
└── index.html
```

### Folder Rules

- Put reusable components inside `components/common`.
- Create a separate folder for each common component.
- Keep component TypeScript, HTML, and SCSS files separate.
- Put application pages inside `pages`.
- Create a separate folder for each page.
- Put all backend communication services inside `services`.
- Put TypeScript interfaces and types inside `models`.
- Put authentication and route-related guards inside `guards`.
- Put HTTP interceptors inside `interceptors`.
- Keep shared layout components inside `layout`.
- Do not create unnecessary folders or duplicate functionality.
- Create additional folders when the application grows and separation is beneficial.

## 4. Component Development

Follow these rules when creating Angular components:

- Prefer standalone components.
- Use the `app-` prefix for component selectors.
- Keep TypeScript, HTML, and SCSS in separate files.
- Use Reactive Forms for form handling.
- Keep components focused on UI behaviour and user interactions.
- Move reusable logic into services or shared components.
- Avoid duplicate code across pages.
- Use Angular lifecycle hooks appropriately.
- Unsubscribe from long-lived subscriptions when necessary.
- Prefer the `async` pipe when displaying Observable data in templates.
- Use Signals when they simplify local or shared state management.

Before creating a new component, check whether an existing common component can be reused.

## 5. Common Popup Message Component

Create a reusable popup message component under:

`components/common/popup-message/`

Use it wherever the application needs to display messages or confirmation dialogs.

It should support:

- Success messages.
- Error messages.
- Warning messages.
- Information messages.
- Dynamic popup titles.
- Dynamic message content.
- Confirm and cancel buttons when required.
- Configurable button labels.
- Responsive layout.
- Light and dark themes.

Do not create separate popup implementations for individual pages.

Use one common component and configure its content and behaviour through inputs, outputs, or an appropriate service.

## 6. Environment Configuration and API URL

Maintain backend API configuration centrally.

Do not hardcode backend API URLs inside individual services or components.

Example:

`environment.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api'
};
```

`environment.development.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001/api'
};
```

Use the environment configuration inside API services.

Example:

```typescript
import { environment } from '../environments/environment';

private readonly apiUrl = environment.apiUrl;
```

When creating new API services, always use the central API URL configuration.

Do not duplicate API base URLs throughout the application.

## 7. Service Development

Services are responsible for backend communication and shared application logic.

Follow these rules:

- Use Angular HttpClient for API requests.
- Keep API methods inside the appropriate service.
- Return strongly typed Observables.
- Use interfaces or models for request and response data.
- Handle HTTP errors consistently.
- Avoid putting HTTP requests directly inside components.
- Avoid duplicating API request logic.
- Use dependency injection.
- Use RxJS operators where appropriate.
- Keep each service focused on a specific responsibility.

Example:

```typescript
getLocations(): Observable<LocationResponse[]> {
  return this.http.get<LocationResponse[]>(
    `${this.apiUrl}/locations`
  );
}
```

Do not subscribe inside a service unless there is a specific reason to manage the subscription there. Prefer returning the Observable so the calling component can decide how to consume it.

## 8. Models and DTOs

Create TypeScript interfaces or types for backend request and response objects.

Follow these rules:

- Match property names and data types with the backend DTOs.
- Use separate request and response models when their structures differ.
- Avoid using `any`.
- Use optional properties only when the API contract allows them.
- Reuse common models where appropriate.

Example:

```typescript
export interface LocationRequest {
  locationName: string;
  isActive: boolean;
}

export interface LocationResponse {
  id: number;
  locationName: string;
  isActive: boolean;
}
```

Do not create unnecessary duplicate models.

## 9. Routing and Route Guards

Use Angular Router for page navigation.

Maintain route definitions inside:

`app.routes.ts`

Follow these rules:

- Use lazy loading for feature pages where appropriate.
- Use `routerLink` for internal navigation.
- Use functional guards where appropriate.
- Use `AuthGuard` to protect authenticated routes.
- Use `RouteGuard` or equivalent route logic when additional access restrictions are required.
- Redirect unauthenticated users to the login page.
- Redirect authenticated users away from guest-only pages when appropriate.
- Keep route definitions organized and readable.

Example:

```typescript
{
  path: 'dashboard',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./pages/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
}
```

Frontend guards improve navigation and user experience. They must never replace backend authentication and authorization.

The backend must independently validate every protected request.

## 10. HTTP Interceptors

Use HTTP interceptors for common HTTP request and response behaviour.

Create interceptors inside:

`interceptors/`

Responsibilities may include:

- Adding common request headers.
- Configuring credentials for cookie-based authentication.
- Handling HTTP 401 Unauthorized responses.
- Handling common HTTP errors.
- Coordinating token refresh where required.

For HttpOnly cookie authentication, configure relevant authentication requests to include credentials.

Example:

```typescript
this.http.get<ApiResponse>(
  `${this.apiUrl}/locations`,
  { withCredentials: true }
);
```

Do not attempt to read an HttpOnly cookie using JavaScript.

Do not duplicate authentication error handling in every component.

Avoid infinite HTTP interceptor retry or refresh loops.

## 11. Main Layout

Create a shared Main Layout component.

The Main Layout should contain:

- Header.
- Navigation menu.
- Main content area.
- Footer.

Use Angular Router's `router-outlet` to load pages dynamically based on the selected navigation item.

Example:

```html
<app-header></app-header>

<main class="main-content">
  <router-outlet></router-outlet>
</main>

<app-footer></app-footer>
```

Authenticated pages should use the Main Layout where appropriate.

Keep the layout consistent across the application.

Do not duplicate header, navigation, or footer implementations inside individual pages.

## 12. Header and Navigation

The header should provide access to the application's main navigation and user actions.

Follow these rules:

- Display the application logo or name.
- Display the navigation menu.
- Use Angular Router navigation.
- Highlight the currently active navigation item.
- Support responsive navigation on mobile devices.
- Display the user profile or account dropdown on the right side.
- Provide the logout action inside the user dropdown.
- Keep the theme toggle accessible in the header.
- Ensure the header works in both light and dark themes.

Use Bootstrap navigation and dropdown components where appropriate.

Do not implement separate navigation logic inside every page.

## 13. Theme Management: Light and Dark Mode

Implement centralized theme management using a `ThemeService`.

The application must support:

- Light mode.
- Dark mode.
- Theme switching from the header.
- Persisting the user's selected theme.
- Applying the theme consistently across all pages and common components.

### Theme Toggle

Place the theme toggle on the right side of the header.

Use these icons:

- When the application is in light mode, display a moon icon.
- When the application is in dark mode, display a sun icon.

Clicking the toggle should switch between light and dark modes.

### Theme Implementation

Use Bootstrap 5.3+ theme support through:

```html
data-bs-theme="light"
```

and:

```html
data-bs-theme="dark"
```

Apply the selected theme to the root HTML element or another consistent application-wide element.

Use global CSS variables where appropriate.

The theme must apply consistently to:

- Header.
- Navigation.
- Forms.
- Inputs.
- Buttons.
- Dropdowns.
- Autocomplete components.
- Tables.
- Cards.
- Popup messages.
- Modals.
- Footer.
- All application pages.

### Theme Persistence

- Store the user's explicit theme selection in localStorage.
- When no saved selection exists, initially respect the operating system's preferred color scheme.
- Keep the selected theme when navigating between pages.
- Avoid implementing separate theme state inside individual components.
- Centralize theme logic inside `ThemeService`.

If the application uses server-side rendering, access browser-only APIs such as localStorage and window only in a browser-safe manner.

## 14. Page Development

Create pages inside the `pages` folder.

Each page should have its own folder containing:

- Component TypeScript file.
- Component HTML file.
- Component SCSS file.

Follow these rules:

- Use common components whenever possible.
- Keep page-specific logic inside the relevant page.
- Move reusable logic into services.
- Use Reactive Forms for forms.
- Use models for API requests and responses.
- Display loading indicators during API operations.
- Display appropriate success and error messages.
- Make every page responsive.
- Support both light and dark themes.

Do not duplicate common UI or API logic across pages.

## 15. Searchable Autocomplete Dropdowns

Whenever a dropdown is used to select a record, use a searchable autocomplete dropdown where appropriate.

Examples:

- Branch selection.
- Location selection.
- Product selection.
- Employee selection.
- Customer selection.
- Category selection.
- Other record-based dropdowns.

Avoid ordinary dropdowns containing a large number of records when autocomplete provides a better user experience.

### Autocomplete Requirements

The autocomplete dropdown must support:

- Searching by typing.
- Case-insensitive search.
- Dynamic option lists.
- Displaying the selected value.
- Clearing the selected value when allowed.
- Configurable placeholder text.
- Configurable display and value fields.
- A no-results-found message.
- Loading indicators when options are retrieved from an API.
- Appropriate error handling.
- Required and optional validation.
- Responsive layout.
- Light and dark themes.
- Keyboard navigation where practical.
- Accessible labels and interaction behaviour.

### Reusable Component

Create a common autocomplete component under:

`components/common/autocomplete-dropdown/`

Maintain separate TypeScript, HTML, and SCSS files.

Use Angular `ControlValueAccessor` so the component can integrate with Reactive Forms.

The component should be reusable across different pages without duplicating its implementation.

Support configurable properties such as:

- Options.
- Display field.
- Value field.
- Placeholder.
- Search behaviour.
- Disabled state.
- Required state.
- Loading state.

### API-Based Search

When the option list is large:

- Prefer server-side searching.
- Use RxJS debounce techniques to avoid sending an API request for every keystroke.
- Avoid loading unnecessarily large datasets into the browser.
- Cancel or disregard outdated search results where appropriate.
- Keep API communication inside services.

If an autocomplete library already exists in the project, evaluate whether it can be reused before implementing a new solution.

Do not introduce another UI library without checking existing dependencies.

## 16. User Profile and Logout Functionality

Provide a user profile dropdown on the right side of the application header.

The dropdown should contain:

- User information where available.
- Logout option.

Keep the theme toggle accessible in the header.

The profile dropdown and logout action must work in both light and dark themes and remain responsive on mobile devices.

### Logout Implementation

Centralize authentication-related operations inside `AuthService`.

When the user clicks Logout:

1. Call the backend logout endpoint when the backend provides one.
2. Allow the backend to invalidate or revoke the refresh token or session.
3. Allow the backend to clear the authentication cookie.
4. Clear frontend authentication-related state.
5. Redirect the user to the login page.
6. Display an appropriate message if required.

Ensure the application reaches a signed-out state even if the logout request fails.

Prevent duplicate logout requests.

Do not attempt to delete an HttpOnly cookie using JavaScript.

The backend must clear the cookie using the appropriate cookie name and matching path/domain attributes.

## 17. Authentication Expiration and Automatic Logout

Authentication expiration must be handled consistently.

The backend is the source of truth for authentication validity.

Follow these rules:

- Use the backend-issued cookie expiry and validation rules.
- Do not assume that the frontend can read an HttpOnly cookie.
- Do not rely only on a frontend timer to determine whether a session is valid.
- Handle HTTP 401 Unauthorized responses centrally through the authentication interceptor.
- If the session cannot be renewed, clear frontend authentication state and redirect to the login page.
- Avoid repeated redirects, duplicate popup messages, and infinite request loops.
- Ensure protected pages cannot be accessed through normal application navigation after the user is signed out.

### Refresh Token Flow

If the backend implements refresh token functionality:

1. The backend issues the refresh token through a secure HttpOnly cookie.
2. The frontend sends requests with credentials when required.
3. When an access token expires, the frontend may call the backend refresh endpoint.
4. The backend validates the refresh token and issues a new access token or session as designed.
5. If refresh fails, the frontend clears authentication state and redirects to the login page.

Additional requirements:

- Centralize refresh logic.
- Prevent multiple simultaneous refresh requests when several API calls receive 401 responses.
- Do not attempt to refresh repeatedly after a failed refresh.
- Do not store refresh tokens in localStorage or sessionStorage.
- Keep cookie security settings under backend control.
- Implement appropriate CSRF protection for cookie-based authentication.

## 18. Responsive UI Design

Every page and component must be responsive.

The application must work properly on:

- Desktop computers.
- Laptops.
- Tablets.
- Mobile phones.

Use Bootstrap's responsive grid system and utility classes.

Follow these rules:

- Use responsive containers and columns.
- Avoid fixed widths where they cause overflow.
- Use flexible layouts.
- Ensure tables remain usable on smaller screens.
- Make forms and inputs fit the available screen width.
- Ensure buttons remain accessible and usable on mobile devices.
- Adapt navigation for smaller screens.
- Avoid horizontal scrolling unless it is necessary for a specific component.

Always consider laptop-to-mobile responsiveness when creating a new page or component.

## 19. Styling Guidelines

Use Bootstrap classes for common styling and layout.

Use component-level SCSS for component-specific styles.

Use global `styles.scss` for application-wide styles and shared theme variables.

Follow these rules:

- Avoid unnecessary inline styles.
- Avoid duplicating CSS across components.
- Use consistent spacing, typography, and colours.
- Use reusable CSS classes for shared styles.
- Avoid excessive use of `!important`.
- Ensure styles support both light and dark themes.
- Avoid hardcoded colours when a shared theme variable or Bootstrap variable is available.

## 20. Naming Conventions

Follow consistent naming conventions throughout the project.

| Item | Naming Convention | Example |
|---|---|---|
| Variables | camelCase | `locationName` |
| Methods | camelCase | `getLocations()` |
| Parameters | camelCase | `locationId` |
| Classes | PascalCase | `LocationService` |
| Components | PascalCase | `LocationListComponent` |
| Interfaces | PascalCase | `LocationResponse` |
| Enums | PascalCase | `RequestStatus` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL` |
| Files | kebab-case | `location-list.component.ts` |
| Folders | kebab-case | `location-list` |
| Selectors | app prefix | `app-location-list` |

Use descriptive names.

Avoid unclear abbreviations and unnecessary short variable names.

## 21. Error Handling and Loading States

Handle API errors and loading states consistently.

Follow these rules:

- Display loading indicators while API requests are running.
- Prevent duplicate form submissions when a request is in progress.
- Display meaningful error messages.
- Display success messages after successful operations.
- Use the common popup message component where appropriate.
- Handle HTTP errors centrally when they are common to the application.
- Handle page-specific errors inside the relevant page.
- Avoid exposing technical exception details to end users.
- Keep error logging and diagnostics separate from user-facing messages.

## 22. Security Guidelines

Follow secure frontend development practices.

- Never hardcode passwords, API keys, or secrets in frontend code.
- Do not store refresh tokens in localStorage or sessionStorage.
- Do not attempt to access HttpOnly cookies through JavaScript.
- Use HTTPS for production API communication.
- Use backend authentication and authorization for protected operations.
- Validate user input on both frontend and backend.
- Avoid unsafe DOM manipulation.
- Use Angular's built-in template sanitization.
- Do not trust frontend route guards as the only security mechanism.
- Apply appropriate CSRF protection when using cookie-based authentication.
- Do not expose sensitive information in console logs.
- Do not store unnecessary sensitive user information in browser storage.

## 23. Code Quality and Best Practices

Maintain clean, readable, and maintainable code.

- Follow Angular and TypeScript best practices.
- Use strong typing.
- Avoid `any` wherever possible.
- Avoid duplicate code.
- Keep components and services focused.
- Prefer reusable components.
- Use Reactive Forms for form handling.
- Use RxJS operators appropriately.
- Use Angular Signals where they simplify state management.
- Remove unused imports, variables, and methods.
- Avoid unnecessary dependencies.
- Follow the existing project conventions.
- Do not modify unrelated files when implementing a feature.
- Do not break existing application functionality.

## 24. AI Agent Development Workflow

Before implementing any feature or making changes:

1. Inspect the existing project structure.
2. Read the existing components, services, models, routes, and configuration.
3. Understand the current implementation and existing business logic.
4. Reuse existing components and services whenever possible.
5. Check existing dependencies before installing new packages.
6. Follow this `AGENTS.md` file.
7. Implement changes using the existing project architecture.
8. Update or create models when required by backend API contracts.
9. Ensure API URLs are obtained from the environment configuration.
10. Check responsive behaviour and both themes.
11. Check for TypeScript errors and Angular build errors.
12. Summarize the files changed and explain the implementation.

### Important AI Agent Rules

- Do not unnecessarily recreate existing functionality.
- Do not change existing business logic unless the requirement specifically asks for it.
- Do not introduce a new architecture without a valid reason.
- Do not install unnecessary libraries.
- Do not duplicate API endpoints or base URLs.
- Do not place API calls directly inside components.
- Do not create separate implementations when a common component can be reused.
- Do not remove existing functionality while implementing new features.
- Ask for clarification when an important requirement or API contract is missing.
- Prefer small, focused changes that fit the existing application.

---

**Final Rule:** All new frontend development must follow this `AGENTS.md`, maintain the existing Angular architecture, reuse common components, use Bootstrap for responsive UI, and integrate with the backend through centralized services and environment configuration.