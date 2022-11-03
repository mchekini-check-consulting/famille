import { Component, OnInit } from '@angular/core';
import { FamilleService } from '../../service/famille.service';//importation du service

@Component({
  selector: 'app-infos',
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.scss']
})
export class InfosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
