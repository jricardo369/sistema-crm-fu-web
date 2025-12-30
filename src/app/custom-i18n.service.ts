import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { registerLocaleData } from '@angular/common';

// =====================

let en = new Map<string, string>();
en.set("", "");

// =====================

let es = new Map<string, string>();

en.forEach((v, k, m) => {
    es.set(k, k);
});

es.set('', '');

// =====================

@Injectable({
    providedIn: 'root'
})
export class CustomI18nService {

    translate(moduleItem: import("./app-nav-item").AppBarNavItem, items: import("./app-nav-item").AppBarNavItem[]) {
        if (moduleItem && !(moduleItem as any).traducido) {
            moduleItem.title = this.get(moduleItem.title);
            moduleItem.subtitle = this.get(moduleItem.subtitle);
            (moduleItem as any).traducido = true;
        }
        if (items) items.filter(e => !(e as any).traducido).forEach(e => {
            e.title = this.get(e.title);
            e.subtitle = this.get(e.subtitle);
            (e as any).traducido = true;
        });
    }

    constructor(@Inject(LOCALE_ID) public localeId: string) {
    }

    get(key: string): any {
        if (!key) return key;
        let map = this.map(this.localeId);
        if (!map.has(key)) throw "La llave '" + key + "' no se encuentra";
        return map.get(key);
    }

    private map(locale: string) {
        if (locale == 'es' || locale.startsWith("es")) return es;
        if (locale == 'en' || locale.startsWith("en")) return en;
        throw "Locale '" + locale + "' no se encuentra";
    }
}
