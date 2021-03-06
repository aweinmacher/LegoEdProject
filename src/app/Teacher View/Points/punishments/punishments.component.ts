import { Component, OnInit } from '@angular/core';
import { StudentsViewService } from '../../../students-view.service';
import PointItem from '../../../../models/point-model';
import { MatTableDataSource } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PointsFormDialogComponent } from '../points-form-dialog/points-form-dialog.component';
import { WarningDialogComponent } from '../../warning-dialog/warning-dialog.component';

@Component({
  selector: 'app-punishments',
  templateUrl: './punishments.component.html',
  styleUrls: ['./punishments.component.css']
})
export class PunishmentsComponent implements OnInit {
  displayedColumns = ['Toggle', 'Penalty', 'Cost', 'Edit'];
  dataSource: MatTableDataSource<PointItem>;

  constructor(private service: StudentsViewService, public dialog: MatDialog) { }

  ngOnInit() {
    this.service.penaltiesData$.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    },
      error => { console.error(error); }
    );
    this.service.getPenalties();
  }

  displayItem(penalty) {
    this.service.displayItem(penalty).subscribe(data => {
      this.service.getPenalties();
      this.service.getDisplayedPoints();
    });
  }

  // EDIT STUDENT
  openEditDialog(point: PointItem): void {
    this.service.show = false;
    let dialogRef = this.dialog.open(PointsFormDialogComponent, {
      width: '290px',
      data: {
        category: point.category,
        description: point.description,
        amount: point.amount,
        btnText: 'Edit',
        title: 'Edit ' + point.category
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      var updPointItem = Object.assign({}, result);
      updPointItem.pointId = point.pointId;
      updPointItem.cat_id = 2;
      console.log(updPointItem);
      if (result) {
        this.service
          .updPointItem(updPointItem)
          .subscribe(data => {
            this.service.getPenalties();
          });
      }
      this.service.show = true;
    });
  }


  //DELETE (archieve) STUDENT
  openArchieveDialog(point: PointItem): void {
    let dialogRef = this.dialog.open(WarningDialogComponent, {
      width: '310px',
      data: {
        text: 'Are you sure you want to remove "' + point.description + '" from Penalties?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.
          archievePoint(point).subscribe(
            data => {
              this.service.getPenalties();
            },
            error => {
              console.error(error)
            });
      }
    });
  }

}




