import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class ElementsService {
    public drawer: MatDrawer;
    constructor() {}
}
