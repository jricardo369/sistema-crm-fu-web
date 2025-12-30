import { TareaProgramada } from "src/model/tarea-programada";

export class PaginationManager {

    public page: number = 0;
    public begin: number = 0;
    public end: number = 0;
    public size: number = 20;
    public array: any[] = [];

    public fix(): void {
        while ((this.page) * this.size > this.array.length)
            this.page--;
        if (this.page < 0) this.page = 0;
        this.begin = this.page * this.size;
        this.end = Math.min((this.page + 1) * this.size, this.array.length);
    }

    public setArray(array: any[],size: number) {
        this.array = array;
        this.size = size;
        this.fix();
    }

    public forward(): void {
        this.page++;
        this.fix();
    }

    public back(): void {
        this.page--;
        this.fix();
    }
}
