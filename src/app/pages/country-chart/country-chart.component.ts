import { Component, AfterViewInit, ElementRef, ViewChild, OnInit,OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-country-chart',
  templateUrl: './country-chart.component.html',
  styleUrl: './country-chart.component.scss'
})

export class CountryChartComponent implements AfterViewInit, OnDestroy {
  private subscription: Subscription = new Subscription(); 
  @Input() country!: Olympic; // Récupération des données du pays
  private lineChart!: Chart; // Instance du graphique, stocke l’objet Chart.js pour pouvoir le manipuler
  

  ngAfterViewInit(): void {
    console.log("Pays reçu dans CountryChartComponent :", this.country);
    console.log("📊 Pays reçu dans CountryChartComponent :", this.country);
    if (this.country) {
      this.createCountryChart();
    }
  }

  createCountryChart(): void {
    const ctx = document.getElementById('countryChart') as HTMLCanvasElement;

    // Trouver la valeur maximale des médaille et calculer la dizaine supérieure
    const maxMedalsCount = Math.max(...this.country.participations.map(p => p.medalsCount));
    const maxY = Math.ceil(maxMedalsCount / 10) * 10;  // Arrondir à la dizaine supérieure
    const sizeChart = Math.max(10, window.innerWidth * 0.016)

    this.lineChart = new Chart(ctx, {
      
      type: 'line',
      data: {
        labels: this.country.participations.map(p => p.year.toString()), // Années
        datasets: [{
          label: 'Medals',
          data: this.country.participations.map(p => p.medalsCount),
          borderColor: '#42A5F5',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              font: {
                size: sizeChart,
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true, // L'axe des Y commence à zéro
            max: maxY, // Utiliser la dizaine supérieure comme valeur maximale de l'axe Y
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Désabonnement propre
    console.log('ChartComponent détruit, abonnement nettoyé.');
  }
}



