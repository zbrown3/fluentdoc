# FluentdocClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.0.

## Component Docs
- [Angular Material](https://material.angular.io/)
  - [Mat-Table](https://material.angular.io/components/table/overview)
- [Bootstrap 5](https://getbootstrap.com/docs/5.2/getting-started/introduction/)
- [ngx-bootstrap](https://valor-software.com/ngx-bootstrap/#/)
- [ngx-toastr](https://www.npmjs.com/package/ngx-toastr)
- [ngx-spinner](https://www.npmjs.com/package/ngx-spinner)
- [ngx-quill](https://github.com/KillerCodeMonkey/ngx-quill)

## Design resources
- [unDraw](https://undraw.co/illustrations)
- [Phosphor Icons](https://phosphoricons.com/)
  - [Phosphor web](https://github.com/phosphor-icons/web) (used in this project)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Making changes to the bootstrap variables
1. override bootstrap variables first in custom.scss
2. if that doesn't work, scroll to the bottom of the custom.scss file and manually override the styles. the variable overrides don't always work unfortunately.

### Compile changes for the bootstrap variable overrides:
Run `npm run compile:bs-css` in the terminal, and you should see changes to the custom.css file if you've made changes

### Watch for changes to the boostrap variable overrides:
Run `npm run watch:bs-css` in the terminal with the app running

---

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running the linter
Run `ng lint` to run the linter on the project.

## CI/CD
We use gitlab CI/CD to automate the build and deployment process. The configuration file is located at `.gitlab-ci.yml`.
- [Gitlab CI/CD](https://docs.gitlab.com/ee/ci/yaml/)
- [Gitlab CI/CD Pipeline Configuration](https://docs.gitlab.com/ee/ci/pipelines/settings.html)

## Deployment
This app is deployed to Digital Ocean via the Dockerfile. The Dockerfile
is only used to build the image for test and prod and not used to run this project locally as it is not necessary.

During the pipeline deploy stage on the test and master branches, a deployment is triggered to the Digital Ocean app platform.

_Note: The deployment is only triggered when the pipeline is successful._

You can access the qa environment at [https://test.fluentdoc.com](https://test.fluentdoc.com) and
the production environment at [https://app.fluentdoc.com](https://app.fluentdoc.com)

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
