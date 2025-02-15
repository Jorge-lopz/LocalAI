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

  subdomain: string | undefined = undefined;

  supabase: any;

  url: string = '';
  headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  constructor(@Inject(PLATFORM_ID) platformId: any) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      // SUPABASE
      this.supabase = createClient(
        'https://fvocvtqxawyljdmdclbu.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2b2N2dHF4YXd5bGpkbWRjbGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNTc4NzIsImV4cCI6MjA1NDkzMzg3Mn0.GpZ0XGvKytQIikFFEfX6RqidUvKhpt1t8mJXGBn1qFM' //environment.supabaseKey
      );

      this.url = window.localStorage.getItem('url') || '';

      this.supabase
        .from('api')
        .select('url')
        .single()
        .then(
          ({ data, error }: { data: { url: string } | null; error: any }) => {
            if (error) return console.error('Error fetching URL:', error);
            this.url = data?.url ?? '';
            window.localStorage.setItem('url', this.url);
          }
        );

      this.supabase
        .channel('api_url_channel')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'api' },
          (payload: any) => {
            this.url = payload.new['url'];
            window.localStorage.setItem('url', this.url);
          }
        )
        .subscribe();

      // API - MODELS
      this.models =
        JSON.parse(window.localStorage.getItem('models') || '[]') || [];
      this.fetchModels();
    }
  }

  loginOAuth() {
    console.log('HI2');
    this.supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    // this.supabase.auth.updateUser({ password: 'validpassword' });
  }

  logout() {
    this.supabase.auth.signOut();
  }

  async checkUserSession(): Promise<Boolean> {
    const {
      data: { session },
    } = await this.supabase.auth.getSession();

    if (session) {
      return true;
    }
    return false;
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

  async sendPromptToAPI(
    inputText: string,
    model: string,
    length: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.url}/generate`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          prompt: inputText,
          model: model,
          length: length,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Usar el reader para leer la respuesta en streaming
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No se pudo obtener el reader de la respuesta.');
      }
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          // Decodificar el chunk recibido
          const chunk = decoder.decode(value, { stream: true });
          // Llamar al callback para actualizar el bubble
          onChunk(chunk);
        }
      }
    } catch (error) {
      console.error('Error al enviar datos:', error);
    }
  }
}
