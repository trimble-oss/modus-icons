import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = this.activatedroute.snapshot.data.title;

  constructor(private router: Router, private activatedroute: ActivatedRoute) {}

  ngOnInit() {
    console.log('title', this.activatedroute.snapshot.data.title);

    this.activatedroute.data.subscribe((data) => {
      console.log('data', data);

      this.title = data.title;
    });
  }
}
