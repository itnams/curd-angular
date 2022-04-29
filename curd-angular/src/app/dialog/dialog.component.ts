import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  freshnessList = ["Brand New", "Second Hand", "Refurbished"]
  productFrom !: FormGroup;
  actionBtn = "Save"
  constructor(private formBuilder: FormBuilder, private api: ApiService, @Inject(MAT_DIALOG_DATA) public editData: any, private dialogRef: MatDialogRef<DialogComponent>) { }
  ngOnInit(): void {
    this.productFrom = this.formBuilder.group({
      productName: ["", Validators.required],
      category: ["", Validators.required],
      freshness: ["", Validators.required],
      price: ["", Validators.required],
      date: ["", Validators.required],
      comment: ["", Validators.required]
    });
    if (this.editData) {
      this.actionBtn = "Update"
      this.productFrom.controls['productName'].setValue(this.editData.productName)
      this.productFrom.controls['category'].setValue(this.editData.category)
      this.productFrom.controls['freshness'].setValue(this.editData.freshness)
      this.productFrom.controls['price'].setValue(this.editData.price)
      this.productFrom.controls['date'].setValue(this.editData.date)
      this.productFrom.controls['comment'].setValue(this.editData.comment)
    }
  }
  updateProduct() {
    this.api.putProduct(this.editData.id, this.productFrom.value)
      .subscribe({
        next: (res) => {
          alert("Update Success");
          this.productFrom.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert("Update Error")
        }
      })
  }
  addProduct() {
    if (!this.editData) {
      if (this.productFrom.valid) {
        this.api.postProduct(this.productFrom.value)
          .subscribe({
            next: (res) => {
              alert("Product added succssfully")
              this.productFrom.reset();
              this.dialogRef.close('save');
            },
            error: () => {
              alert("Error while dding the product")
            }
          })
      }
    } else {
      this.updateProduct()
    }
  }
}
