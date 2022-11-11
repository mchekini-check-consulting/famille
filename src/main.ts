/*!

 =========================================================
 * Light Bootstrap Dashboard Angular - v1.8.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-angular2
 * Copyright 2020 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */
import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { VERSION as CDK_VERSION } from "@angular/cdk";
import { VERSION as MAT_VERSION } from "@angular/material/core";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

console.info("Angular CDK version", CDK_VERSION.full);
console.info("Angular Material version", MAT_VERSION.full);

platformBrowserDynamic().bootstrapModule(AppModule);
