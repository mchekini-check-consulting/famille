import {Component, OnInit} from "@angular/core";
import {InfosService} from "../../core/service/famille.service";
import {Famille} from "../../core/model/famille";
import {OAuthService} from "angular-oauth2-oidc";

import {ToastrService} from "ngx-toastr";

@Component({
    selector: "app-infos",
    templateUrl: "./infos.component.html",
    styleUrls: ["./infos.component.scss"],
})
export class InfosComponent implements OnInit {
    user: Famille;
    initialUser: Famille;
    email: string;
    submitIsDisabled: boolean;
    errMessage: string;
    errMessageForm: string;

    constructor(
        private userService: InfosService,
        public oauthService: OAuthService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit(): void {
        this.submitIsDisabled = true;
        this.userService.getInfosFamille().subscribe((data: Famille) => {
            this.user = data;
            this.initialUser = {...data};
        });
    }

    isValid(p: string) {
        var phoneRe = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        var digits = p.replace(/\D/g, "");
        return phoneRe.test(digits) && p.length == 10;
    }

    checkValidity(user: Famille) {
        this.errMessageForm = "";
        if (
            user.nom == "" ||
            user.prenom.length == 0 ||
            user.rue.length == 0 ||
            user.codePostal.length == 0 ||
            user.ville.length == 0
        ) {
            this.toastr.warning(
                "Veuillez vérifier les informations saisies",
                "Modification"
            );
            this.errMessageForm = "Veuillez remplir tous les champs !";
            return false;
        }
        return true;
    }

    handleForm(e: any) {
        if (e.target.name == "numeroTelephone") {
            this.errMessage = "";
            if (!this.isValid(e.target.value)) {
                this.toastr.warning(
                    "Veuillez vérifier le format du n° de téléphone",
                    "Modification"
                );
                this.errMessage = "Le numéro de téléphone n'est pas valide !";
                return (this.submitIsDisabled = true);
            }
        }
        this.user[e.target.name] = e.target.value;
        this.submitIsDisabled =
            JSON.stringify(this.initialUser) === JSON.stringify(this.user) ||
            !this.checkValidity(this.user);
    }

    submitInfos() {
        if (!this.isValid(this.user.telephone)) {
            this.toastr.error(
                "Veuillez vérifier le format du n° de téléphone",
                "Modification"
            );
            return false;
        }
        if (!this.checkValidity(this.user)) {
            this.toastr.error(
                "Veuillez vérifier les informations saisies",
                "Modification"
            );
            return false;
        }

        this.userService.putInfosFamille(this.user).subscribe({
            next: (res) => {
                this.toastr.success("Données modifiées avec succès", "Modification");
                this.initialUser = {...this.user};
                this.submitIsDisabled = true;
            },
            error: (error) => {
                this.toastr.error(
                    "Erreur lors de la modification. Veuillez réessayer",
                    "Modification"
                );
                this.submitIsDisabled = false;
                console.error("There was an error!", error);
            },
        });
    }
}
