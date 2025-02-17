import { NgModule, SecurityContext, importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataService } from './services/data.service';
import { BubbleComponent } from './components/bubble/bubble.component';
import { ChatComponent } from './components/chat/chat.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

@NgModule({
  declarations: [AppComponent, BubbleComponent, ChatComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MarkdownModule.forRoot({
      loader: HttpClient,
      sanitize: SecurityContext.NONE,
    }),
  ],
  providers: [
    importProvidersFrom(HttpClientModule),
    provideHttpClient(),
    provideClientHydration(withEventReplay()),
    DataService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
