import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoriesRoutingModule } from './categories-routing.module';


@NgModule({
  declarations: [CategoryFormComponent, CategoryListComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule
  ]
})
export class CategoriesModule { }
