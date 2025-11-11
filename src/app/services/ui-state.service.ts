import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export interface HeroState {
  type: 'carousel' | 'banner' | 'none';
  title?: string;
  imageUrl?: string;
}
@Injectable({
  providedIn: 'root'
})
export class UiStateService {
  private heroState = new BehaviorSubject<HeroState>({ type: 'carousel' });
  public heroState$ = this.heroState.asObservable();
  constructor() { }
  setHeroState(newState: HeroState): void {
    this.heroState.next(newState);
  }
}