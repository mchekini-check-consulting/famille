import { NgModule } from "@angular/core";
import { TemplateComponent } from "./container/template.component";
import { CommonModule } from "@angular/common";
import { AppRoutingModule } from "../../app.routing";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    TemplateComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
  ],
  imports: [CommonModule, RouterModule, AppRoutingModule],
  exports: [],
})
export class TemplateModule {}
