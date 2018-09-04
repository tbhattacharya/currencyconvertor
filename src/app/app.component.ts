import { HttpService } from './utils/service/http-service';
import { AjaxConstant } from './utils/AjaxConstant';
import { supportedCurrency } from './utils/constants';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public form: FormGroup;
  public title = 'Currency Converter';
  public sourceCurrency = supportedCurrency;
  public ajaxSource = new BehaviorSubject<any>(0);
  public ajaxSource$;
  public ajaxSubscription: Subscription;
  public isRequesting: boolean = false;
  public rateCalc: Function;
  public rows: Array<any> = [{
    dest: 'dest1',
    destAmt: 'destAmt1'
  }];
  public controls: any = {
    source: [{ value: '', disabled: false }],
    sourceAmt: [{ value: '', disabled: false }],
    dest1: [{ value: '', disabled: false }],
    destAmt1: [{ value: '', disabled: true }]
  };

  constructor(private formBuilder: FormBuilder, private httpService: HttpService,
    private zone: NgZone) {
    this.ajaxSource$ = this.ajaxSource.asObservable();
    this.ajaxSubscription = this.ajaxSource$.subscribe(event => {
      if (event !== 0) {
        this.zone.run(() => {
          switch (event) {
            case AjaxConstant.START:
              this.isRequesting = true;
              break;
            case AjaxConstant.COMPLETE:
              this.isRequesting = false;
              break;
          }
        });
      }
    });
    this.rateCalc = this.httpService.memoizedRate();
  }

  ngOnInit() {
    this.form = this.formBuilder.group(this.controls);
  }

  public calculate() {
    this.rateCalc(this.form.controls['source'].value, this.form.controls['dest'].value).subscribe(data => {
      const rate: number = parseFloat(data[this.form.controls['source'].value + '_' + this.form.controls['dest'].value].val);
      this.form.controls['destAmt'].setValue(rate * parseInt(this.form.controls['sourceAmt'].value, 10));
    });
  }

  public addNewRow() {
    const count = this.rows.length + 1;
    this.controls = {
      ...this.controls, ['dest' + count]: [{ value: '', disabled: false }],
      ['destAmt' + count]: [{ value: '', disabled: true }]
    };
    this.rows.push({ dest: 'dest' + count, destAmt: 'destAmt' + count });
    this.form = this.formBuilder.group(this.controls);
  }
}
