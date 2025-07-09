//list-expedientes.component.ts
import { Component, OnInit } from '@angular/core';
import { ExpedienteService } from '../../services/expediente.service';
import { Expediente } from '../model.expediente';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-list-expedientes',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RouterModule, CardModule],
  templateUrl: './list-expedientes.component.html',
  styleUrls: ['./view-expedientes.component.css']
})
export class ListExpedientesComponent implements OnInit {
  expedientes: Expediente[] = [];
  loading = true;
  error = '';

  constructor(private expedienteService: ExpedienteService) {}

  ngOnInit(): void {
    this.expedienteService.getExpedientes().subscribe({
      next: (data) => {
        this.expedientes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al cargar los expedientes';
        this.loading = false;
      }
    });
  }
}