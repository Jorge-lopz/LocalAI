import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { Model } from '../model/model';
import { environment } from '../../environments/environment';

interface ApiResponse {
  response?: any;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  isBrowser: boolean = false;
  models: Record<string, Model> = {};

  // private supabase = createClient(
  //   'https://fvocvtqxawyljdmdclbu.supabase.co', //environment.supabaseUrl,
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2b2N2dHF4YXd5bGpkbWRjbGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNTc4NzIsImV4cCI6MjA1NDkzMzg3Mn0.GpZ0XGvKytQIikFFEfX6RqidUvKhpt1t8mJXGBn1qFM' //environment.supabaseKey
  // );

  subdomain: string | undefined = undefined;

  url = 'https://' + this.subdomain + '.trycloudflare.com';
  headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  constructor(@Inject(PLATFORM_ID) platformId: any) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.models =
        JSON.parse(window.localStorage.getItem('models') || '[]') || [];
      this.fetchModels();

      // this.supabase
      //   .channel('api_url_channel')
      //   .on(
      //     'postgres_changes',
      //     { event: 'UPDATE', schema: 'public', table: 'api' },
      //     (payload) => {
      //       this.url = 'https://' + payload.new['url'] + '.trycloudflare.com';
      //       console.log('Change received!', payload);
      //       console.log('New url', this.url);
      //     }
      //   )
      //   .subscribe();
    }
  }

  async fetchModels() {
    try {
      const response = await fetch(`${this.url}/models`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      this.models = ((await response.json()) as ApiResponse).response;
      window.localStorage.setItem('models', JSON.stringify(this.models));
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  }
}
