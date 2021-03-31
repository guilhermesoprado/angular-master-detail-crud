import { Component, OnInit } from '@angular/core';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  public categories: Category[] = [];
  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll():void{
    this.categoryService.getAll().subscribe(
      //categories => console.log(categories),
      categories =>  this.categories = categories,
      error => alert("Error loading the category list.")
    )
  }

  delete(category: Category):void{
    const mustDelete = confirm("Would you like to delete this category?");

    if(mustDelete)
      this.categoryService.delete(category.id).subscribe(
        ()=> this.categories = this.categories.filter(element => element != category),
        () => alert("Delete failed")
      )
  }

}
