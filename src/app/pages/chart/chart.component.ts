import { Component, OnInit, ElementRef, ViewChild, OnDestroy, Input } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { Router } from '@angular/router';
import { OlympicService } from '../../core/services/olympic.service'; // Import du service
import { Chart } from 'chart.js/auto';

@Component({ // Création du component
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})

export class ChartComponent implements OnInit, OnDestroy {
  // Médaille par année
  @Input() participations!: { year: number; medalsCount: number }[]; 
  // Stocker l'abonnement
  private subscription: Subscription = new Subscription(); 

  // Utilisation de ViewChild plus performant que getElementById
  @ViewChild('myChart') myChart!: ElementRef<HTMLCanvasElement>; // Sélectionne l’élément HTML <canvas> avec l’ID #myChart

  constructor(private olympicService: OlympicService, private router: Router) {} // Ajout de l'injection

  private chart!: Chart; // Stocke l’objet Chart.js pour pouvoir le manipuler

  ngOnInit() {
    this.olympicService.getOlympicData().pipe(take(1)).subscribe(({ labels, data, ids }) => {
      console.log('create chart')
      this.createChart(labels, data, ids); // Passe les données au graphique
      window.addEventListener('resize', this.onResize.bind(this));
    });
  }

  // Chart home page
  createChart(labels: string[], values: number[], ids: number[]) {
    this.chart = new Chart(this.myChart.nativeElement, {
      type: 'pie',  // this.chartType as ChartType
      data: {
        labels: labels, // Utilisation des labels dynamiques
        datasets: [{
          label: '🏅Medal per country',
          data: values, // Utilisation des valeurs dynamiques
          borderWidth: 1,
          backgroundColor: ['#956165', '#7a3e52', '#89a2dc', '#9781a1', '#bfe1f1', '#b8cbe8']
        }]
      },
      options: {
        responsive: true,
        layout: {
          padding: 20
        },
        plugins:{
          legend: {
            labels: {
              font: {
                size: 20
              }
            }
          }
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const countryId = ids[index]; // 🔹 Récupère l'ID du pays cliqué
            console.log("✅ Clic détecté sur l'ID :", countryId);
            this.navigateToCountry(countryId);
          } else {
            console.log("❌ Aucun élément sélectionné");
          }
        }
      }
    })
  };

  // Forcer le resize en fonction de la taille de l'écran car l'ajout de la font-size dans les options de chart.js oblige le rechargement de la page pour prendre en compte la nouvelle font-size en fonction de la taolle de l'écran
  onResize() {
    const sizeChart = Math.max(12, window.innerWidth * 0.015);
    this.chart.options.plugins!.legend!.labels!.font = {
      size: sizeChart
    };
    this.chart.update();
  }

  navigateToCountry(countryId: number) {
    console.log("🚀 Redirection vers la page de détails du pays avec l'ID :", countryId);
    this.router.navigate([`/country/${countryId}`]); // 🔹 Utilisation de l'ID dans l'URL
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Désabonnement propre
  }
}
