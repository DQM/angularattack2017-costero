// Ref: http://stackoverflow.com/a/37176929

import { Injectable } from '@angular/core';

function getWindow (): any {
    return window;
}

@Injectable()
export class WindowRefService {
    get nativeWindow (): any {
        return getWindow();
    }
}
