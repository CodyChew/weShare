import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { NavbarService } from '../services/navbar/navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
    @Input() navstate: any;
    subscription:Subscription[]=[];
    isLogin:boolean;
    userID:any;
    userImg:any;
    faBars = faBars;

  constructor(
      public auth: AuthService,
      private router: Router,
      private navbarService: NavbarService,
      private afs: AngularFirestore,
  ) {
      this.subscription.push(this.auth.getUser().subscribe(user => {
          if (user) {
              this.userID = user.uid;
              this.isLogin = true;
              this.userImg = user.photoURL;
          } else {
            this.isLogin = false;
          }
      }))
   }

  ngOnInit(): void {
  }

  toggleSidenav() {
    this.navbarService.sendSidenavToggle();
  }

  showNotifications() {
    alert("This notification service has not been done yet!");
  }
}
