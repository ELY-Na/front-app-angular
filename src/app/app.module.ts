import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ChartComponent } from './pages/chart/chart.component'; // Ajout de Chart component
import { CountryDetailsComponent } from './pages/country-details/country-details.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CountryChartComponent } from './pages/country-chart/country-chart.component';


@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, ChartComponent, HeaderComponent, FooterComponent, CountryDetailsComponent, CountryChartComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
