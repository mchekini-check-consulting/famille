import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {FormControl, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";


export interface Jours {
    text: string,
    id : number
}

@Component({
    selector: "app-recherche",
    templateUrl: "./recherche.component.html",
    styleUrls: ["./recherche.component.scss"],
})
export class RechercheComponent implements AfterViewInit {
    myForm = new FormGroup({
        nom: new FormControl(""),
        prenom: new FormControl(""),
        ville: new FormControl(""),
        debut : new FormControl(""),
        fin : new FormControl(""),
        jour : new FormControl("")
    });

    jours: Jours [] = [
        {text: "Lundi", id: 0},
        {text: "Mardi", id : 1},
        {text: "Mercredi", id : 2},
        {text: "Jeudi", id : 3},
        {text: "Vendredi", id : 4},
        {text: "Samedi", id : 5},
        {text: "Dimanche", id :6},
    ];
    data: Nounou[] = [];

    displayedColumns: string[] = [
        "nom",
        "prenom",
        "adresse",
        "telephone",
        "mail",
        "contact",
    ];
    dataSource = new MatTableDataSource<Nounou>(this.data);

    constructor(private http: HttpClient, private _router: Router) {
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.searchNounouByCriteria();
    }

    ngOnInit(): void {
    }

    searchNounouByCriteria() {
        const nom = this.myForm.get("nom").value;
        const prenom = this.myForm.get("prenom").value;
        const ville = this.myForm.get("ville").value;
        const debut = this.myForm.get("debut").value;
        const fin = this.myForm.get("fin").value;
        const jour = this.myForm.get("jour").value;
        this.http
            .get<Nounou[]>(
                "api/v1/search/nounou?nom=" +
                nom +
                "&prenom=" +
                prenom +
                "&ville=" +
                ville +
                "&debut=" +
                debut +
                "&fin=" +
                fin +
                "&jour=" +
                jour
            )
            .subscribe((resp) => {
                this.data = resp;
                this.dataSource = new MatTableDataSource<Nounou>(this.data);
            });
    }

    goToChat(email: string): void {
        this._router.navigate(["/messagerie", email]);
    }
}

export interface Nounou {
    nom: string;
    prenom: string;
    adresse: string;
    telephone: string;
    mail: string;
}
