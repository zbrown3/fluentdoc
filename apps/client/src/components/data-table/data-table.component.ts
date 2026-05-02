import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DEFAULT_PAGINATION_CONFIG } from '../../utils/constants';

export interface TableAction {
  label: string; // Label for the action button
  icon?: string; // Optional icon for the action button
  isIconButton?: boolean; // Indicates if the action is an icon button; `false` for regular button
  isMenuItem?: boolean; // Indicates if the action is a menu item; `false` for button
  isDelete?: boolean; // Optional flag to indicate if the action is a delete action
  tooltip?: string; // Optional tooltip for the action button
  onClick: (rowData: any) => void; // Function to call when the action is clicked
  disabled?: boolean; // Optional flag to disable the action button
  class?: string; // Optional CSS class for the action button
}
export interface TableColumn {
  actions?: TableAction[];
  align?: 'left' | 'center' | 'right'; // Default is 'left
  filterable?: boolean; // Indicates if the column can be filtered
  formatDataFn?: (value: any) => any; // Custom function to format data in the column
  key: string;
  label: string;
  sortable?: boolean;
  showTooltip?: boolean; // Indicates if the column has a tooltip
  tooltip?: string; // Optional tooltip for the column header
  width?: string; // e.g., '150px' or '20%'
}

@Component({
  selector: 'app-fdds-data-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    NgFor,
    NgClass,
    TooltipModule,
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements AfterViewInit, OnInit, OnChanges {
  displayedColumns: string[] = [];
  columnsToFilterBy: TableColumn[] = [];
  actionMenuItems: TableAction[] = [];

  @Input() columns: TableColumn[] = [];
  @Input() data: Record<string, unknown>[] = [];
  @Input() showPaginationControls?: boolean = false;
  @Input() showSearchInput?: boolean = false;
  @Input() searchValue?: string = '';
  @Input() paginationConfig = DEFAULT_PAGINATION_CONFIG;
  // TODO: Add support for sticky header rows which would be nice to have when there's a lot of data to show
  @Input() stickyHeaderRow?: boolean = false;
  @Input() searchInputPlaceholder: string = 'Search...';
  @Input() isPublicRoute: boolean = false;

  dataSource = new MatTableDataSource(this.data);
  totalItems: number = this.data.length;
  searchString: string = this.searchValue || '';
  sortedColumnKey: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {}

  ngOnInit(): void {
    this.columnsToFilterBy = this.columns.filter((col) => col.filterable);

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.data);

    // This function will be used to filter the data based on the search input
    // It checks if any of the filterable columns contain the filter string
    // If no filter is applied, it returns true for all rows
    // If a filter is applied, it checks if any of the filterable columns contain the
    // filter string (case-insensitive)
    this.dataSource.filterPredicate = (
      data: Record<string, unknown>,
      filter: string
    ) => {
      // If no filter is applied, return true for all rows
      if (!filter) {
        return true;
      }
      // Convert the filter to lowercase for case-insensitive comparison
      const lowerCaseFilter = filter.toLowerCase();

      // Check if any of the filterable columns contain the filter string
      return this.columnsToFilterBy.some((column) => {
        const value = data[column.key];
        // If the value is an object, convert it to a string
        const valueAsString = column.formatDataFn
          ? column.formatDataFn(value)
          : value;
        // Check if the value contains the filter string
        return (
          valueAsString &&
          valueAsString.toString().toLowerCase().includes(lowerCaseFilter)
        );
      });
    };

    this.displayedColumns = this.columns.map((col) => col.key);

    const actionColumn = this.columns.filter(
      (col) => col.key === 'actions' && col.actions && col.actions.length > 0
    );

    if (actionColumn && actionColumn.length > 0) {
      this.actionMenuItems =
        actionColumn[0].actions?.filter(
          (actionItem) => actionItem.isMenuItem
        ) || [];
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Event fired when the value to the Input() variables has changed
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchValue']) {
      this.searchString = changes['searchValue'].currentValue || '';
      this.applyFilter();
    }

    if (changes['data']) {
      this.dataSource.data = changes['data'].currentValue;
    }
  }

  applyFilter() {
    const filterValue = this.searchString;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (!filterValue) {
      this.dataSource.data = this.data; // Reset to original data if no filter
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  formatColumnData(column: TableColumn, value: any): string {
    // If a custom format function is provided, use it
    if (
      column.formatDataFn &&
      typeof column.formatDataFn === 'function' &&
      value
    ) {
      const formattedValue = column.formatDataFn(value);

      return formattedValue;
    }

    // Just return the value as is if no format function is provided
    return value ? value.toString() : '';
  }

  handlePageEvent(event: PageEvent): void {
    this.paginationConfig!.pageSize = event.pageSize;
  }
}
