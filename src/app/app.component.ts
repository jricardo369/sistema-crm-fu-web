import { Component, OnInit } from '@angular/core';
import { SessionService, SessionServiceListener } from './services/session.service';
import { Router,RouterModule } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { query, trigger, transition, style, animateChild, group, animate } from '@angular/animations';
import { UtilService } from './services/util.service';
import { Usuario } from 'src/model/usuario';
import { BACKOFFICE, INTERVIEWER, INTERVIEWER_SCALES, MASTER, THERAPIST, VENDOR,VOC } from './app.config';
import { CommonModule } from '@angular/common'; 
import { BarComponent } from 'src/app/common/bar/bar.component'; 
import { myAnimationGus } from 'src/app/animations';

export const slideInAnimation =
    trigger('myAnimationGus', [
        transition('* => *', [
            query(
                ':enter .workspace',
                [style({
                    opacity: 0,
                    transform: 'translateX(-10px)'
                })],
                { optional: true }
            ),
            query(
                ':leave .workspace',
                [style({
                    opacity: 1,
                }),
                animate('0.1s', style({
                    opacity: 0,
                }))],
                { optional: true }
            ),
            query(
                ':enter .workspace',
                [style({
                    opacity: 0,
                    transform: 'translateX(-10px)'
                }),
                animate('0.2s', style({
                    opacity: 1,
                    transform: 'translateX(-0%)'
                }))],
                { optional: true }
            )
        ])
    ]);


@Component({
     standalone: true,imports: [RouterModule,CommonModule,BarComponent],
     
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    animations: [
        slideInAnimation
    ]
})
export class AppComponent implements OnInit, SessionServiceListener {

    title = 'contelec-app';

    isRouterOutletVisible = true;

    isAppBarVisible = false;

    constructor(
        public utilService: UtilService,
        private sessionService: SessionService,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private router: Router
    ) {
        [
            'menu', 'search', 'stop', 'account-circle', 'arrow-forward', 'check-box-outline-blank', 'star',
            'box', 'delete', 'refresh', 'add-box', 'oval', 'check-box', 'edit', 'more-vert','fedora-hat',
            'arrow-back', 'arrow-forward', 'person', 'security', 'done', 'done-all',
            'add', 'remove', 'airplane', 'areas', 'bar-code', 'print',
            'clasesg', 'close', 'file-upload', 'file-download', 'filter-list',
            'gi', 'group', 'remove-shopping-cart', 'report',
            'shop', 'shopping-cart', 'sort', 'tclases', 'test', 'cancel',
            'test2', 'travel', 'trolley', 'update', 'settings',
            'assignment', 'assignment-ind', 'assignment-turned-in','users','general-manage',
            'information', 'questions', 'alert', 'pending-black','to-do-list','pending-actions',
            'agenda', 'cita', 'historia', 'historial', 'pacientes', 'pago', 'pagos', 'administracion', 'users2', 'attach_file',
            'eye', 'external-link', 'scales', 'availability', 'users-report', 'payment', 'mail-sent',
            'reports', 'planning', 'closed', 'comments', 'comparison', 'schedule', 'pay-per-click-payment',
            'calendar-slash','trashD','eyeD','downloadD','calendarD','userD','fileD','moneyD','actionsD','listD','atachmentsD','moneyListD',
            'seenD','attachD','message-sendD','excelD','bellD','reassignD','pletterD','completeD','sendD','assignD','reopenD','assignD2',
            'saveD','playD','lawyers','dashboard','refused','calendarD2','cancel-event','exportD','searchD','filesFolderD','filesFolderDarkD','filesD','couponD',
            'integrationsD','cash','cashAll','cashAll2','syncD','salesD','pinD','circleD','okD','finishD','cancelD','important','reminder','reminderD','calendarMenuD',
            'reminderD2','reminderNaranja','unlockD','unlockD2','messagesD','phoneD','emailD','calendarD3','calendarD4','files-listD','files-listD2',
            'account-balanceD','numberFlagD','law-book','courthouse','history-file','cold','warning','warning2','chart-law','compare',
            'recurrenceD','signatureD','signedD','incompleteD'
        ].forEach(e => iconRegistry.addSvgIcon(e, this.sanitizer.bypassSecurityTrustResourceUrl('/assets/svg/' + e + '.svg')));

    }

    private registerAppIcons() {
    // Registro de iconos básicos
    this.registerIcon('menu', 'assets/svg/menu.svg');
    
  }

  private registerIcon(iconName: string, iconPath: string) {
    this.iconRegistry.addSvgIcon(iconName,this.sanitizer.bypassSecurityTrustResourceUrl(iconPath));
  }

    ngOnInit(): void {
         this.registerAppIcons();
        this.sessionService.addListener(this);
        /*this.sessionService
            .isSessionValid()
            .then(isValid => {
                if (!isValid) {
                    this.isAppBarVisible = false;
                    this.router.navigateByUrl('/ingresar');
                } else { this.isAppBarVisible = true; }
            })
            .catch(reason => alert(reason))
            .then(() => this.isRouterOutletVisible = true);*/
            if (localStorage.getItem('auth_token') === null) {
                this.isAppBarVisible = false;
                //this.isRouterOutletVisible = true;
                this.router.navigateByUrl('/ingresar');
            }
            else {
                this.isAppBarVisible = true;
                //this.isRouterOutletVisible = true;
                const objUsuarioStr = localStorage.getItem('objUsuario');
                if (objUsuarioStr) {
                  let usuario: Usuario = JSON.parse(objUsuarioStr);
                  if ([MASTER, VENDOR, BACKOFFICE, INTERVIEWER, INTERVIEWER_SCALES, THERAPIST].some(rol => rol == usuario.rol)) {
                    this.router.navigateByUrl('/solicitudes/citas');
                  }
                  else {
                    this.router.navigateByUrl('/inicio');
                  }
                }
            }
    }

    onIniciarSesion() {
        this.isAppBarVisible = true;
    }

    onCerrarSesion() {
        this.isAppBarVisible = false;
    }
}
