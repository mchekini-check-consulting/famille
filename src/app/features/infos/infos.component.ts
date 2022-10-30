import { Component, OnInit } from '@angular/core';
import { FamilleService } from '../../service/famille.service';
import { Famille } from '../../service/famille';

import {OidcSecurityService} from "angular-auth-oidc-client";

@Component({
  selector: 'app-infos',
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.scss']
})
export class InfosComponent implements OnInit {
  user: Famille;
  initialUser: Famille;
  email: string;
  submitIsDisabled: boolean;
  errMessage: string;
  errMessageForm: string;

  constructor(private userService: FamilleService, public oidcSecurityService: OidcSecurityService) { }

  isValid(p) {
     var phoneRe = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
     var digits = p.replace(/\D/g, "");
     return phoneRe.test(digits) && p.length == 10;
  }

  checkValidity(user){
    this.errMessageForm = "";
    if(user.nom == "" || user.prenomRepresentant.length == 0 || user.adresse.length == 0){
        this.errMessageForm = "Veuillez remplir tous les champs !";
        return false;
     }
    return true;
  }

  handleForm(e) {
    if(e.target.name == "numeroTelephone"){
        this.errMessage = "";
        if(!this.isValid(e.target.value)){
            this.errMessage = "Le numéro de téléphone n'est pas valide !";
            return this.submitIsDisabled = true;
        }
     }
     this.user[e.target.name] = e.target.value;
     this.submitIsDisabled = JSON.stringify(this.initialUser) === JSON.stringify(this.user) || !this.checkValidity(this.user);
  }

  submitInfos() {
    if(!this.isValid(this.user.numeroTelephone)){
       return false;
    }
    if(!this.checkValidity(this.user)){
        return false;
    }
    this.userService.putFamille(this.user)
        .subscribe({
          next: res => {
            this.submitIsDisabled = true;
            console.log(res);
          },
          error: error => {
             this.submitIsDisabled = false;
             console.error('There was an error!', error);
          }
      });
  }

  ngOnInit(): void {
   this.submitIsDisabled = true
   this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData }) => {
          if(!isAuthenticated) return this.oidcSecurityService.logoff();
          this.email = userData.email;
    });

    this.userService.getFamille(this.email).subscribe((data: Famille) => {
        this.user = data;
        this.initialUser = {...data};
    });
  }
}
