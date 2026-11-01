# POSSystem Frontend

Angular frontend for the POS system. The development server runs at `http://localhost:4200/` and uses the API at `https://localhost:7060/api`.

## Requirements

- Git
- Node.js and npm

Check that Node.js and npm are available in Windows Command Prompt:

```cmd
node --version
npm --version
```

## Clone the frontend

In Command Prompt, navigate to the parent folder where you want the project. Replace `REPLACE_WITH_FRONTEND_REPOSITORY_URL` with the Git URL for the repository that contains this frontend:

```cmd
cd /d C:\path\to\your\projects
git clone REPLACE_WITH_FRONTEND_REPOSITORY_URL POSSystem_Frontend
cd POSSystem_Frontend
```

If the frontend is in a subfolder of a larger repository, clone that repository and navigate into `POSSystem_Frontend` instead:

```cmd
git clone REPLACE_WITH_REPOSITORY_URL
cd REPOSITORY_FOLDER\POSSystem_Frontend
```

Replace the example paths and URL before running the commands. Run the remaining commands from the frontend folder containing `package.json` and `package-lock.json`.

## Install dependencies

For a clean install from the checked-in lockfile, run:

```cmd
npm ci
```

If `package-lock.json` is missing or needs to be updated, use `npm install` instead:

```cmd
npm install
```

If npm reports cache errors, clear the local npm cache and retry the install:

```cmd
npm cache clean --force
npm ci
```

## Run the development server

Start the backend API first, then run the frontend from the `POSSystem_Frontend` folder:

```cmd
npm start
```

Open `http://localhost:4200/` in a browser. The Angular development server reloads when source files change. The development API URL is `https://localhost:7060/api`; trust the local ASP.NET Core HTTPS development certificate if the browser reports a certificate warning.

## Build and test

```cmd
npm run build
npm test
```

## Source layout

- `src/app/components/common/` contains shared autocomplete and popup components.
- `src/app/environments/` contains environment-specific configuration.
- `src/app/guards/` and `src/app/interceptors/` contain route guards and HTTP interceptors.
- `src/app/layout/main-layout/` contains the authenticated header, navigation, and footer.
- `src/app/models/` contains frontend data types.
- `src/app/pages/` contains route-level pages grouped by feature.
- `src/app/services/` contains API and application services.
- `src/assets/` contains static assets copied into the build output.
- `src/styles.scss` contains global styles; component styles live beside their components.
