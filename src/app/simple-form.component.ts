import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Title } from './title.model';
import { TitleService } from './title.service';

@Component({
  selector: 'simple-form',
  templateUrl: './simple-form.component.html',
  styleUrls: ['./simple-form.component.css']
})
export class SimpleFormComponent implements OnInit {
  public titles: Title[] = [];
  public simpleForm = this.fb.group({
    title: [''],
    firstName: [''],
    lastName: ['', Validators.required],
    acceptTerms: [false]
  });

  constructor(
    private fb: FormBuilder,
    private titleService: TitleService,
  ) {}

  get lastName() { return this.simpleForm.get('lastName'); }
  get terms() { return this.simpleForm.get('acceptTerms'); }
  
  ngOnInit(): void {
    this.getTitles();
  }

  getTitles() {
    this.titleService.getTitles().pipe(
      map(titles => titles.filter(title => title.name !== '!').sort((a, b) => a.name.localeCompare(b.name)))
    ).subscribe(titles => {
      this.titles = titles;
      this.setDefaultTitle();
    });
  }

  setDefaultTitle() {
    const defaultTitle = this.titles.find(title => title.isDefault);
    this.simpleForm.get('title').setValue(defaultTitle.name);
  }

  onSubmit() {
    if (this.simpleForm.valid) {
      return console.log(this.simpleForm.value);
    } else {
      this.validateAllFormFields(this.simpleForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }
}
