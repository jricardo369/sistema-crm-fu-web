import { Component, OnInit, ContentChild, ViewChild, ViewContainerRef, Input, ElementRef, ContentChildren, QueryList, Directive, } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Directive({ selector: 'button' })
class ChildDirective {
}

@Component({
    standalone: true,
    imports: [RouterModule,CommonModule,MatIconModule,FormsModule],
    selector: 'app-experimental-menu',
    templateUrl: './experimental-menu.component.html',
    styleUrls: ['./experimental-menu.component.scss']
})
export class ExperimentalMenuComponent implements OnInit {

    mobileMode: boolean;

    @Input("titulo")
    title: string;

    @Input("backButtonEnabled")
    isBackButtonEnabled: boolean;

    @Input("moreButtonVisible")
    isMoreButtonVisible: boolean = true;

    @ViewChild("items", { static: true })
    itemsElement: ElementRef<HTMLDivElement>;

    isMenuOpen = false;

    constructor(
        private elRef: ElementRef,
        private utilService: UtilService) {
    }

    ngOnInit() {
        this.updateSizes();
        
        
        // ESTE DE ABAJO ES PARA ESCUCHAR EVENTOS DE REDIMENSIONAMIENTO
        /*
        import ResizeObserver from 'resize-observer-polyfill';
        const ro = new ResizeObserver((entries, observer) => {
            for (const entry of entries) {
                const { left, top, width, height } = entry.contentRect;
                console.log('Element:', entry.target);
                console.log(`Element's size: ${width}px x ${height}px`);
                console.log(`Element's paddings: ${top}px ; ${left}px`);
            }
        });
        ro.observe(this.elRef.nativeElement);
        */
    }

    goBack() {
        this.utilService.goBack();
    }

    openMenu() {

        if (this.isMenuOpen) return;

        this.isMenuOpen = true;

        let closeMenu = () => {
            document.removeEventListener('mousedown', mouseDownEventListener);
            document.removeEventListener('click', mouseDownEventListener);
            setTimeout(() => this.isMenuOpen = false, 100);
        }
        let mouseDownEventListener = e => {
            if (this.itemsElement.nativeElement.contains(e.srcElement)) return;
            closeMenu();
        };
        let mouseClickEventListener = (e: MouseEvent) => {
            let clickOnList = e.srcElement == this.itemsElement.nativeElement;
            let clickOnListChild = this.itemsElement.nativeElement.contains(e.srcElement as Node);
            if (clickOnListChild && !clickOnList) closeMenu();
        };

        document.addEventListener('mousedown', mouseDownEventListener);
        document.addEventListener('click', mouseClickEventListener);
    }

    hel() {
        this.updateSizes();
    }

    updateSizes() {
        //console.log("UPDATE SIZES");
        //this.mobileMode = window.innerWidth <= 480;
    }
}

