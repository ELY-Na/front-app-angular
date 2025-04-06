
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, map, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
// import { catchError} from 'rxjs/operators';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrl: './country-details.component.scss'
})

export class CountryDetailsComponent implements OnInit, OnDestroy{
  public olympics$!: Observable<Olympic[]>;
  public countryId!: number | null;
  public countryDetails$!: Observable<Olympic | null>;
  public numberOfEntries!: number; // pour tous les pays
  public numberOfAthletes$!: Observable<number>;
  public numberOfMedals$!: Observable<number>;
  public numberOfEntriesForCountry$!: Observable<number>; // pour un seul pays

  // Stocker l'abonnement
  private subscription: Subscription = new Subscription(); 

  constructor(
    private olympicService: OlympicService, 
    private route: ActivatedRoute, 
    private location: Location, // Ajout de Location pour revenir à la page précédente pas forcément à home
    private router: Router
  ) {}

 ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id')); // Récupère l'id de l'URL

  // Charge d'abord les données !
  this.olympicService.loadInitialData().subscribe({
    next: () => {
      // Ensuite on peut chercher le pays
      this.countryDetails$ = this.olympicService.getOlympicById(id).pipe(
        tap(country => {
          if (!country) {
            console.warn('⛔ No country found, redirecting to /404...');
            this.router.navigate(['/404']);
          }
        })
      );

      // Calculer le nombre total d'athlètes par pays
      this.numberOfAthletes$ = this.countryDetails$.pipe(
        map(country => country ? country.participations.reduce((sum, participation) => sum + participation.athleteCount, 0) : 0)
      );

      // Calculer le nombre total de medailles par pays
      this.numberOfMedals$ = this.countryDetails$.pipe(
        map(country => country ? country.participations.reduce((sum, participation) => sum + participation.medalsCount, 0) : 0)
      );

      // Calculer le nombre total de medailles par pays
      this.numberOfEntriesForCountry$ = this.countryDetails$.pipe(
        map(country => country ? country.participations.length : 0)
      );
    },
    error: () => {
      console.error('💥 Failed to load data');
      this.router.navigate(['/404']);
    }
  });
}

  // Revient à la page précédente
  goBack(): void {
    this.location.back(); 
  }
    
  // Désabonnement
  ngOnDestroy(): void {
    this.subscription.unsubscribe(); 
    console.log('CountryDetailsComponent détruit, abonnement nettoyé.');
  }
}

// créer nouveau chart details component
// créer le chart
// créer le lien entre home et pays
// refacto les methodes dans service

// page 404 => chargement des data se fait plusieurs fois, la première fois ne fonctionne pas car pas le temps de charger les data