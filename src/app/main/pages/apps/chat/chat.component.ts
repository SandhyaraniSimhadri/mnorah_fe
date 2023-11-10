import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
 
  host: { class: 'chat-application' }
})
export class ChatComponent {}
