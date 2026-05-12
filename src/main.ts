import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppComponent } from './app/app.component';
import { provideRouter, withPreloading } from '@angular/router';
import { routes } from 'src/app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { importProvidersFrom } from '@angular/core';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes,
    ),
    provideHttpClient(),
    provideAnimationsAsync(),
    // Todos tus providers globales van aquí
    // Ejemplo: provideAnimations(), provideToastr()
    importProvidersFrom(
      MatProgressSpinnerModule,
      MatFormFieldModule,
      MatInputModule,
      MatDatepickerModule,
      MatNativeDateModule
    )
  ]
}).catch(err => console.error(err));