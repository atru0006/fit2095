import { ThrowStmt } from '@angular/compiler';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'clinicapp';

  firstName: string = "";
  lastName: string = "";
  dob = new Date();
  suburb: string = "";
  state: string = "";
  postCode: number = 0;
  noOfPatients: number = 0;

  doctorsDB: Array<any> = [];
  noOfDoctors: number = 0;
  docsZeroPatients: number = 0;
  totalPatients: number = 0;
  
  addDoctor() {
    let newID = Math.floor((Math.random() * 100) + 1)
    let newDoctor = {
      doctorID: newID,
      firstName: this.firstName,
      lastName: this.lastName,
      dob: this.dob,
      address: this.suburb + ', ' + this.state + ', ' + this.postCode,
      noOfPatients: this.noOfPatients
    }
    this.doctorsDB.push(newDoctor);
    this.noOfDoctors++;
    if (this.noOfPatients == 0) {
      this.docsZeroPatients++;
    }
    this.totalPatients = this.totalPatients + this.noOfPatients;
  }

  deleteDocsZeroPatients() {
    for (let i = 0; i < this.doctorsDB.length; i++) {
      if (this.doctorsDB[i].noOfPatients == 0) {
        this.totalPatients = this.totalPatients - this.doctorsDB[i].noOfPatients;
        this.doctorsDB.splice(i, 1);
        this.noOfDoctors--;
        this.docsZeroPatients--;
        i = i - 1;
      }
    }
  }

  deleteDoctor(id: number) {
    let index = 0;
    for (let i = 0; i < this.doctorsDB.length; i++) {
      if (this.doctorsDB[i].doctorID === id) {
        index = i;
        break;
      }
    }
    if (this.doctorsDB[index].noOfPatients == 0) {
     this.docsZeroPatients--;
    }
    this.totalPatients = this.totalPatients - this.doctorsDB[index].noOfPatients;
    this.doctorsDB.splice(index, 1);
    this.noOfDoctors--;
  }
}