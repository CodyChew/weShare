import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask, createStorageRef } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

// import { $ } from 'protractor';
declare var $: any;

@Component({
  selector: 'app-new-listing',
  templateUrl: './new-listing.component.html',
  styleUrls: ['./new-listing.component.css']
})
export class NewListingComponent implements OnInit {
  @ViewChild('dropArea') dropArea: ElementRef;
  modalOptions: NgbModalOptions;
  closeResult: string;

  //input image file
  public imagePath;

  //image display URL
  imgURL: any;

  //Error message
  public message: string;

  //listing input
  listingForm: FormGroup;

  //Listing creator
  createdBy: String;


  //Main task
  task: AngularFireUploadTask;

  //Progress monitoring
  percentage: Observable<number>;
  snapshot: Observable<any>;

  //Download URL
  downloadURL: Observable<string>;


  constructor(
    private auth: AuthService,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    public fb: FormBuilder,
    private modalService: NgbModal, ) {
    this.imgURL = "./assets/no-preview-available.png";
    this.listingForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(400)]],
      price: ['', Validators.required],
      contact: ['', Validators.required],
    })
  }


  //Get all inputs from form
  get title(): any { return this.listingForm.get('title') }
  get description(): any { return this.listingForm.get('description') }
  get price(): any { return this.listingForm.get('price') }
  get contact(): any { return this.listingForm.get('contact') }


  //Update creator of this listing
  ngOnInit(): void {
    this.auth.getUser().subscribe(usr => {
      this.createdBy = usr.uid;
    })
  }


  /****************** Upload Process ****************/
  startUpload(event: FileList) {


    if (this.listingForm.controls['title'].invalid.valueOf() || this.listingForm.controls['price'].invalid.valueOf()
   || this.listingForm.controls['description'].invalid.valueOf() || this.listingForm.controls['contact'].invalid.valueOf()) {
      alert("Incomplete Form!");
      this.modalService.dismissAll();
      return;
    }
    //get TimeStamp of this listing
    const timeStamp = Date.now();

    /********** Handle no image ********/
    if (event == null) {
      const path = `no-preview-available.png`
      var formDetails = {
        timeStamp: timeStamp,
        title: this.title.value,
        description: this.description.value,
        price: this.price.value,
        contact: this.contact.value,
        path: path,
        createdBy: this.createdBy,
      }
      this.db.collection('listings').add(formDetails).then(
        key => {
          this.db.collection('listings').doc(`${key.id}`).set({ ID: key.id }, { merge: true });
        }
      );
      $('#listingModal').modal('hide');
      this.listingForm.reset();
      this.modalService.dismissAll();
      return;
    }

    // The File Object
    const file = event.item(0)

    // Client-side validation
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      alert("Unsupported file type!");
      return;
    }

    //The Storage path
    const path = `listing-pics/${timeStamp}_${file.name}`;

    var formDetails = {
      timeStamp: timeStamp,
      title: this.title.value,
      description: this.description.value,
      price: this.price.value,
      contact: this.contact.value,
      path: path,
      createdBy: this.createdBy,
    }

    //The main task
    this.task = this.storage.upload(path, file)

    //Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      //dismiss loading modal 
      tap(snap => {
        if (snap.bytesTransferred === snap.totalBytes) {
          this.modalService.dismissAll();
        }
      }),

      //update firebase 
      finalize(() => {
        //update firestore on completion
        this.db.collection('listings').add(formDetails).then(
          key => {
            this.db.collection('listings').doc(`${key.id}`).set({ ID: key.id }, { merge: true });
          }
        );
      })
    );


    //Reset listing form
    $('#listingModal').modal('hide');
    this.clearImage();
    this.listingForm.reset();
  }

  /**************End of Upload *****************/



  /************* Preview images in new listing modal ****************/
  preview(files) {
    if (files.length === 0)
      return;

    //check input type
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = " *Only images are supported.*";
      return;
    }

    //update display image URL
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      this.message = "";

    }
  }
  /************** End of Preview *****************/



  clearImage() {
    this.imgURL = "./assets/no-preview-available.png";
    this.imagePath = null;
    this.dropArea.nativeElement.value = null;
  }


  open(content) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
