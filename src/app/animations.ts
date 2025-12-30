import { trigger, state, style, animate, transition } from '@angular/animations';

export const myAnimationGus = trigger('myAnimationGus', [
  state('in', style({ opacity: 1 })),
  transition(':enter', [
    style({ opacity: 0 }),
    animate('600ms ease-in')
  ]),
  transition(':leave', [
    animate('600ms ease-out', style({ opacity: 0 }))
  ])
]);