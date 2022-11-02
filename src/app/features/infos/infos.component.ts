import { Component, OnInit } from '@angular/core';
import {NounouService} from "../../core/service/nounou.service";
import {NounouModel} from "../../core/model/nounou.model";

@Component({
  selector: 'app-infos',
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.scss']
})
export class InfosComponent implements OnInit {


  nounou: NounouModel;

  constructor(private nounouService: NounouService) { }

  ngOnInit(): void {

    this.nounouService.getNounouInformations().subscribe( nounou => {
      this.nounou = nounou;
    })
  }

}
