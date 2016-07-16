import {enableProdMode} from 'angular2/core';
import {bootstrap}    from 'angular2/platform/browser';
import { HTTP_PROVIDERS } from 'angular2/http';
import {AppComponent} from './app.component';

enableProdMode();
bootstrap(AppComponent, [HTTP_PROVIDERS]);