import { BehaviorSubject } from 'rxjs';
import { EventEmitter } from '@angular/core';

export interface IMainTopScreenComponent {
    output: EventEmitter<any>;
    data?: boolean;
}