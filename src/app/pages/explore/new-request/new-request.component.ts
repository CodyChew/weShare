import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../services/request/request.service'; 
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css']
})
export class NewRequestComponent implements OnInit {
    displayName: any;
    userID: any;
    items: any;
    requestForm: FormGroup;

    constructor(
        public auth: AuthService,
        private router: Router,
        private requestService: RequestService,
        public fb: FormBuilder,
    ) {
        this.requestForm = this.fb.group({
            title: '',
            description: '',
            urgency: '',
            duration: '',
            incentive: '',
        })
    }

    ngOnInit(): void {
        this.auth.getUser().pipe().subscribe(user => {

            // Get user details.
            this.userID = user.uid;
            this.displayName = user.displayName;
        })
    }

    get title() { return this.requestForm.get('title') }
    get description() { return this.requestForm.get('description') }
    get incentive() { return this.requestForm.get('incentive') }
    get duration() { return this.requestForm.get('duration') }
    get urgency() { return this.requestForm.get('urgency') }

    submitRequest() {
        var formDetails = {

            // Input details
            title: this.title.value,
            description: this.description.value,
            incentive: this.incentive.value,
            duration: Number(this.duration.value),
            urgency: this.urgency.value,

            // Other details
            createdBy: this.userID,
            timeStamp: Date.now(),
            status: "active",
        }

        this.requestService.addRequest(formDetails).then(() => {
            alert("Request successfully added!");
            this.requestForm.reset();
            location.reload();
        });


    }

}
