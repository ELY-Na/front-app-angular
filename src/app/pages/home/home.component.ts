import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription(); // Stocker l'abonnement
  public olympics$!: Observable<Olympic[]>;
  public maxParticipations!: number;
  public allCountries!: number;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    
    this.subscription.add(
      this.olympicService.getNumberOfParticipations().subscribe((maxParticipations: number) => {
        this.maxParticipations = maxParticipations;
        console.log(`Max participations : ${maxParticipations}`);
      })
    );

    this.subscription.add(
      this.olympicService.getNumBerOfCountries().subscribe((allCountries: number) => {
        this.allCountries = allCountries;
        console.log(`All Countries: ${allCountries}`)
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Désabonnement
    console.log('HomeComponent détruit, abonnement nettoyé.');
  }
}
