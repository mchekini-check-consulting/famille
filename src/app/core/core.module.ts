import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { TemplateModule } from "./template/template.module";

/**
 * Only the root AppModule should import the CoreModule
 */

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, TemplateModule],
  exports: [],
  providers: [],
})
export class CoreModule {}
