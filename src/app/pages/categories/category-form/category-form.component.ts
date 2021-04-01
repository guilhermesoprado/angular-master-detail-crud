import { toBase64String } from '@angular/compiler/src/output/source_map';
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';
import toastr from "toastr";


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  currentAction:string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessage: string[] = null;
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(private categoryService: CategoryService,
    private route: ActivatedRoute, 
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(){
    this.setTitlePage();
  }

  submitForm(){
    this.submittingForm = true;
    if(this.currentAction == "new")
      this.createCategory();
    else
      this.updateCategory();
  }


  // PRIVATE METHODS
  private setCurrentAction(){
    if(this.route.snapshot.url[0].path == "new")
      this.currentAction = "new";
    else
      this.currentAction = "edit";
  }

  private buildCategoryForm(){
    this.categoryForm = this.formBuilder.group({
      id:[null],
      name:[null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory(){
    if(this.currentAction == "edit"){
      this.route.paramMap.pipe(
        switchMap(params =>this.categoryService.getById(+params.get("id")))
      )
      .subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category); // bind loaded category data to categoryForm
        },
        (error) => {
          alert("It happened a issue in the server, try later please!");
        }
      )
    }
  }

  private setTitlePage(){
    if(this.currentAction == "new")
      this.pageTitle = "New category form register";
    else
    {
      const categoryName = this.category.name || "";
      this.pageTitle = "Updating category: " + categoryName;
    }

  }

  private createCategory(){
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.create(category).subscribe(
      category => this.actionForSuccess(category),
      error => this.actionsForError(error)
    );
  }

  private updateCategory(){
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.update(category).subscribe(
      category => this.actionForSuccess(category),
      error => this.actionsForError(error)
    );
  }

  private actionForSuccess(category: Category){
    toastr.success("successful request.");
    // redirecting / reload component page
    this.router.navigateByUrl("categories", {skipLocationChange: true}).then(
      () => this.router.navigate(["categories", category.id, "edit"])
    );

  }
  private actionsForError(error){
    toastr.error("An error occurred while making the request.");
    console.log(error);
    
    this.submittingForm = false;
    if(error.status === 422)
      this.serverErrorMessage = JSON.parse(error._body).errors;
    else
      this.serverErrorMessage = ["Communication with the server failed. Please try again later."];
  }

}
