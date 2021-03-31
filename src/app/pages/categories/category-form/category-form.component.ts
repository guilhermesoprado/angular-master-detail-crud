import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

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

}
