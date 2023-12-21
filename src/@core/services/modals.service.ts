import {Injectable} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Injectable({
    providedIn: 'root',

})
export class ModalsService {
item:any;

    constructor(private modalService: NgbModal,
                //private transfer: FileTransfer,
               ) {
       
    }
    modalOpenDanger(modalDanger,item:any) {
        this.item=item;
        this.modalService.open(modalDanger, {
          centered: true,
          windowClass: 'modal modal-danger'
        });
      }
}
