import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Olympic } from '../models/Olympic';
import { Observable, map, catchError, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  // ActivatedRoute => Lire les paramètres de l'URL	
  // Router	Changer de page dynamiquement ie 404 si pas trouver avec id
  constructor(private http: HttpClient, private route: ActivatedRoute) {} 

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // Can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympicData(): Observable<{ labels: string[], data: number[], ids: number[] }> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      map((olympics: Olympic[]) => {
        // Pays comme labels
        const labels = olympics.map(o => o.country); 
        const data = olympics.map(o =>
          // Somme des médailles
          o.participations.reduce((sum, p) => sum + p.medalsCount, 0) 
        );
        const ids = olympics.map(o => o.id); 
        // Format adapté pour Chart.js
        return { labels, data, ids }; 
      })
    );
  }

  getOlympics() { // typer l'observable -> done
    return this.olympics$.asObservable().pipe(
      map((olympics: Olympic[]) =>
        olympics.map(olympic => ({
          id: olympic.id,
          country: olympic.country,
          // Calcul du total des médailles
          medalsCount: olympic.participations.reduce((sum, p) => sum + p.medalsCount, 0),
          // Conserve la liste des participations
          participations: olympic.participations
        }))
      )
    );
  }

  getNumberOfParticipations(): Observable<number> {
    return this.olympics$.pipe(
      map((data: Olympic[]) => {
        if (data && data.length > 0) {
          // Trouver le max, spread operator (...) transforme le tableau en liste de valeurs pour Math.max()
          return Math.max(...data.map(olympic => olympic.participations.length));
        }
        // Si aucune donnée, on retourne 0
        return 0; 
      })
    );
  }

  getNumBerOfCountries(): Observable<number> {
    return this.olympics$.pipe(
      map((data: Olympic[]) => {
        return data.map(olympic => olympic.country).length;
      })
    );
  }

  getOlympicById(countryId: number): Observable<Olympic | null> {
    return this.getOlympics().pipe( // Remplace par ta vraie méthode
      map((data: Olympic[]) => {
        console.log("📊 Liste complète des pays :", data);
        return data.find(country => country.id === countryId) || null;
      })
    );
  }
}






