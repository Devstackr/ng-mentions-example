import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-demo',
  templateUrl: './main-demo.component.html',
  styleUrls: ['./main-demo.component.scss']
})
export class MainDemoComponent implements OnInit {

  messages: string[];

  constructor() { }

  ngOnInit() {
    this.messages = new Array<string>();
  }

  sendMessage(message: string) {
    message = message.trim();
    if (message.length > 0) {
      this.messages.push(message);
    }
  }

}
