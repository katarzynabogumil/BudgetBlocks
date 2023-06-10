import { Component, Input, OnInit } from '@angular/core';
import { ExpenseService } from '@app/core';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  @Input() item: string = '';
  @Input() link: string = '';
  compareMode: boolean = false;

  constructor(
    public expenseApi: ExpenseService,
  ) { }

  ngOnInit(): void {
    this.expenseApi.compareMode$.subscribe((isTrue: boolean) => this.compareMode = isTrue);
  }
}
