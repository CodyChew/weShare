import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import * as firebase from 'firebase';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private afs: AngularFirestore,
    private s: AngularFireModule,
  ) { }

  getUser(userID) {
    return this.afs.doc(`user/${userID}`).valueChanges();
  }

  getUsers() {
    return this.afs.collection(`user`).valueChanges();
  }

  updateDetails(userID, data) {
    return this.afs.doc(`user/${userID}`).set(data, { merge: true });
  }

  

  

  // increaseListingCount(userID) {
  //   const increment = firebase.firestore.FieldValue.increment(1);
  //   return this.afs.doc(`user/${userID}`).update({listingCount : increment});
  // }

  // increaseCompletedListingCount(userID) {
  //   const increment = firebase.firestore.FieldValue.increment(1);
  //   return this.afs.doc(`user/${userID}`).update({completedListingCount : increment});
  // }

  // decreaseListingCount(userID) {
  //   const decrement = firebase.firestore.FieldValue.increment(-1);
  //   return this.afs.doc(`user/${userID}`).update({listingCount : decrement});
  // }

  // increaseCompletedRequest(userID) {
  //   const increment = firebase.firestore.FieldValue.increment(1);
  //   return this.afs.doc(`user/${userID}`).update({completedRequestCount : increment});
  // }

  // decreaseCompletedRequest(userID) {
  //   const decrement = firebase.firestore.FieldValue.increment(-1);
  //   return this.afs.doc(`user/${userID}`).update({completedRequestCount : decrement});
  // }

  // getListingCount() {
  //   return this.afs.collection(`user`, ref => ref.orderBy('listingCount', 'desc').limit(3)).valueChanges();
  // }




}
