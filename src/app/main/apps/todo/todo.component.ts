import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
 
  host: { class: 'todo-application' }
})
export class TodoComponent {}
