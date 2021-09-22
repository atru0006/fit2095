import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../database.service";

@Component({
  selector: "app-actor",
  templateUrl: "./actor.component.html",
  styleUrls: ["./actor.component.css"],
})

export class ActorComponent implements OnInit {
  actorsDB: any[] = [];
  section: number = 1;
  fullName: string = "";
  bYear: number = 0;
  actorId: string = "";
  moviesDB: any[] = [];
  title: string = "";
  year: number = 0;
  aTitle: string = "";
  aYear1: number = 0;
  aYear2: number = 0;
  movieId: string = "";

  constructor(private dbService: DatabaseService) {}
  
  // Get all actors
  onGetActors() {
    this.dbService.getActors().subscribe((data: any) => {
      this.actorsDB = data;
    });
  }
  
  // Add an actor
  onSaveActor() {
    let obj = { name: this.fullName, bYear: this.bYear };
    this.dbService.createActor(obj).subscribe(result => {
      this.onGetActors();
    });
  }

  // Update an actor
  onSelectUpdate(item: any) {
    this.fullName = item.name;
    this.bYear = item.bYear;
    this.actorId = item._id;
  }

  onUpdateActor() {
    let obj = { name: this.fullName, bYear: this.bYear };
    this.dbService.updateActor(this.actorId, obj).subscribe(result => {
      this.onGetActors();
    });
  }
  
  // Delete an actor
  onDeleteActor(item: any) {
    this.dbService.deleteActor(item._id).subscribe(result => {
      this.onGetActors();
    });
  }

  // Get all movies
  onGetMovies() {
    this.dbService.getMovies().subscribe((data: any) => {
      this.moviesDB = data;
    });
  }

  // Add a movie
  onSaveMovie() {
    let obj = { title: this.title, year: this.year };
    this.dbService.createMovie(obj).subscribe(result => {
      this.onGetMovies();
    });
  }

  // Delete a movie by title
  onDeleteMovieTitle() {
    this.dbService.deleteMovieTitle(this.aTitle).subscribe(result => {
      this.onGetMovies();
    });
  }

  // Delete movies between aYear1 and aYear2
  onDeleteMovieYear() {
    this.dbService.deleteMovieYear(this.aYear1, this.aYear2).subscribe(result => {
      this.onGetMovies();
    });
  }

  // Add an actor to a movie
  onSelectActor(item: any) {
    this.fullName = item.name;
    this.bYear = item.bYear;
    this.actorId = item._id;
  }

  onSelectMovie(item: any) {
    this.title = item.title;
    this.year = item.year;
    this.movieId = item._id;
  }

  onAddActor() {
    this.dbService.addActor(this.movieId, this.actorId).subscribe(result => {
      this.onGetMovies();
    });
  }

  resetMovieValues() {
    this.title = "";
    this.year = 0;
    this.movieId = "";
  }
  
  // This lifecycle callback function will be invoked with the component get initialized by Angular.
  ngOnInit(): void {
    this.onGetActors();
    this.onGetMovies();
  }

  changeSection(sectionId: number) {
    this.section = sectionId;
    this.resetValues();
  }

  resetValues() {
    this.fullName = "";
    this.bYear = 0;
    this.actorId = "";
    this.title = "";
    this.year = 0;
    this.movieId = "";
  }
}