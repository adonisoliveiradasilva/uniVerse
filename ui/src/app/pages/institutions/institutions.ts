import { Component } from '@angular/core';
import { Table } from '../../shared/organisms/table/table';
import { TableTdType } from '../../core/models/table-td.type';

@Component({
  selector: 'app-institutions',
  imports: [Table],
  templateUrl: './institutions.html',
  styleUrl: './institutions.scss'
})
export class Institutions {
  TableTdType = TableTdType;

  _rows = [
    {
      id: 1,
      name: 'Universidade Federal de Ouro Preto'
    },
    {
      id: 2,
      name: 'Universidade Federal de Minas Gerais'
    },
    {
      id: 3,
      name: 'Universidade Federal de São Paulo'
    },
    {
      id: 4,
      name: 'Universidade Federal de Alagoas'
    },
    {
      id: 5,
      name: 'Universidade Federal de Pernambuco'
    },
    {
      id: 6,
      name: 'Universidade Federal de Santa Catarina'
    },
    {
      id: 7,
      name: 'Universidade Federal de Rio Grande do Sul'
    },
    {
      id: 8,
      name: 'Universidade Federal de Goiás'
    },
    {
      id: 9,
      name: 'Universidade Federal de Mato Grosso do Sul'
    },
    {
      id: 10,
      name: 'Universidade Federal de Paraná'
    },
    {
      id: 11,
      name: 'Universidade Federal de Rio de Janeiro'
    },
    {
      id: 12,
      name: 'Universidade Federal de Bahia'
    },
    {
      id: 13,
      name: 'Universidade Federal de Maranhão'
    },
    {
      id: 14,
      name: 'Universidade Federal de Rondônia'
    },
    {
      id: 15,
      name: 'Universidade Federal de Acre'
    },
    {
      id: 16,
      name: 'Universidade Federal de Alagoas'
    },  
  ]

  _columns = [ 
    {
      key: 'name',
      header: 'Nome da Insituioção',
      type: TableTdType.Text
    },
  ]



}
