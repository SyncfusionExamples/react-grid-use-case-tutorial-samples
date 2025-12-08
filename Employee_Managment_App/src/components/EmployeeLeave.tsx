// src/components/EmployeeLeave.tsx
import * as React from 'react';
import { useState, useCallback, useRef } from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Sort,
  Filter,
  Page,
  Toolbar,
  ColumnChooser,
  ExcelExport,
  Edit,
  Inject,
  RowInfo
} from '@syncfusion/ej2-react-grids';
import { ChangeEventArgs, SwitchComponent } from '@syncfusion/ej2-react-buttons';
import { DataManager, Query, UrlAdaptor, Predicate } from '@syncfusion/ej2-data';
import {
  DateRangePickerComponent,
  PresetsDirective,
  PresetDirective,
  RangeEventArgs
} from '@syncfusion/ej2-react-calendars';
import { EmployeeDetails, EmployeeLeaveDetails } from '../interface.ts';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';

const gridData: DataManager = new DataManager({
  url: 'https://ej2services.syncfusion.com/aspnet/development/api/EmployeesLeaveData',
  adaptor: new UrlAdaptor()
});

const yearStart: Date = new Date(new Date(new Date().getFullYear(), 0, 1).toDateString());
const yearEnd: Date = new Date(new Date(new Date().getFullYear(), 11, 31).toDateString());

const Presets = (props: { dateRangeChange: (args: RangeEventArgs) => void }) => {
  const monthStart: Date = new Date(new Date(new Date().setDate(1)).toDateString());
  const monthEnd: Date = new Date(
    new Date(new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(0)).toDateString()
  );
  const lastStart: Date = new Date(
    new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)).toDateString()
  );
  const lastEnd: Date = new Date(new Date(new Date().setDate(0)).toDateString());
  const lastSixStart: Date = new Date(
    new Date(
      new Date(
        new Date().setMonth(new Date().getMonth() - 6 > 0 ? new Date().getMonth() - 6 : 0)
      ).setDate(1)
    ).toDateString()
  );
  const lastSixEnd: Date = new Date(
    new Date(new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(0)).toDateString()
  );

  return (
    <DateRangePickerComponent
      placeholder="Select a range"
      value={[yearStart, yearEnd]}
      change={props.dateRangeChange}
      width={190}
    >
      <PresetsDirective>
        <PresetDirective label="This Month" start={monthStart} end={monthEnd}></PresetDirective>
        <PresetDirective label="Last Month" start={lastStart} end={lastEnd}></PresetDirective>
        <PresetDirective label="Last 6 Months" start={lastSixStart} end={lastSixEnd}></PresetDirective>
        <PresetDirective label="This Year" start={yearStart} end={yearEnd}></PresetDirective>
      </PresetsDirective>
    </DateRangePickerComponent>
  );
};

const EmployeeLeave = (props: { employeeData: EmployeeDetails; userInfo: EmployeeDetails }) => {
  const [leaveCount, setLeaveCount] = useState({ casual: 0, sick: 0, others: 0, request: 0 });

  let predicate = new Predicate('EmployeeCode', 'equal', props.employeeData.EmployeeCode)
    .and('From', 'greaterthanorequal', yearStart)
    .and('From', 'lessthanorequal', yearEnd);

  const [query, setQuery] = useState(() => new Query().where(predicate));
  const leaveGridIns = useRef<GridComponent>(null);
  const toolbar: string[] = ['ColumnChooser', 'Search', 'ExcelExport'];

  const emptyRecordTemplate = useCallback(() => {
    return <div> No Results Found </div>;
  }, []);

  type LeaveRow = {
    AbsenceType?: string;
    Status?: string;
    Days?: number | string;
  };

  // Count rules:
  // - Finalized leaves: Approved, Closed -> add to Casual/Sick/Others buckets
  // - Request/pending: Need to Approve, Requested, Request, Pending -> add to request
  function computeBadgeTotals(rows: LeaveRow[]) {
    let casual = 0,
      sick = 0,
      others = 0,
      request = 0;

    const finalized = new Set(['approved', 'closed']);
    const requesting = new Set(['need to approve', 'requested', 'request', 'pending']);

    for (const r of rows ?? []) {
      const days = Number(r.Days) || 0;
      const status = String(r.Status || '').toLowerCase().trim();
      const type = String(r.AbsenceType || '').toLowerCase().trim();

      if (finalized.has(status)) {
        if (type === 'casual') casual += days;
        else if (type === 'sick') sick += days;
        else others += days; // Treat any non-casual/sick as others (e.g., Emergency)
      } else if (requesting.has(status)) {
        request += days;
      }
    }

    return { casual, sick, others, request };
  }

  const recomputeFromView = () => {
    if (!leaveGridIns.current) return;
    const viewRows = leaveGridIns.current.getCurrentViewRecords() as EmployeeLeaveDetails[];
    setLeaveCount(computeBadgeTotals(viewRows));
  };

  const dataBound = (): void => {
    // Fires after data is fetched/bound (including after date-range query changes)
    recomputeFromView();
  };

  const actionComplete = (args: any) => {
    // Recompute after actions that change the visible/view data
    const reactions = new Set([
      'filtering',
      'searching',
      'sorting',
      'grouping',
      'ungrouping',
      'reorder',
      'columnstate',
      'paging',
      'refresh',
      'dataSource'
    ]);
    if (reactions.has(args?.requestType)) {
      recomputeFromView();
    }
  };

  const dateRangeChange = (args: RangeEventArgs): void => {
    const [start, end] = args.value as Date[];
    const newPredicate: Predicate = new Predicate('EmployeeCode', 'equal', props.employeeData.EmployeeCode)
      .and('From', 'greaterthanorequal', start)
      .and('From', 'lessthanorequal', end);

    setQuery(() => new Query().where(newPredicate));
    // No direct recompute here; dataBound will fire after the new query loads data.
  };

  const toolbarClick = (args: ClickEventArgs): void => {
    if (args.item.id === 'leave_grid_excelexport') {
      leaveGridIns.current?.excelExport();
    }
  };

  const statusTemplate = (args: any) => {
    return (
      <div>
        {args.Status === 'Closed' ? (
          <div id="status" className="statustemp closed">
            <span className="statustxt closed">{args.Status}</span>
          </div>
        ) : args.Status === 'Approved' ? (
          <div id="status" className="statustemp approved">
            <span className="statustxt approved">{args.Status}</span>
          </div>
        ) : (
          <div id="status" className="statustemp needtoapprove">
            <span className="statustxt needtoapprove">{args.Status}</span>
          </div>
        )}
      </div>
    );
  };

  const approveChange = (args: ChangeEventArgs) => {
    const td = ((args.event as any).target as HTMLElement)?.closest('td');
    const rowInfo: RowInfo = leaveGridIns.current?.getRowInfo(td as Element) as RowInfo;
    const rowData = rowInfo?.rowData as EmployeeLeaveDetails;

    rowData.Status = rowData.Status === 'Approved' ? 'Need to Approve' : 'Approved';
    leaveGridIns.current?.setRowData(rowData.AttendanceID, rowData);

    // Reflect the change in badges immediately
    recomputeFromView();
  };

  const approveTemplate = (args: any) => {
    return (
      <SwitchComponent
        id="checked"
        disabled={args['Status'] === 'Closed'}
        checked={args['Status'] === 'Approved'}
        cssClass="e-small"
        change={approveChange}
      ></SwitchComponent>
    );
  };

  return (
    <div>
      <div className="employeeLeave-header">
        <div className="leaveinfo">
          <b>Leave:</b>{' '}
          <span className="e-badge badge-casual">{leaveCount.casual} d</span> Casual |{' '}
          <span className="e-badge badge-sick">{leaveCount.sick} d</span> Sick |{' '}
          <span className="e-badge badge-others">{leaveCount.others} d</span> Others |{' '}
          <span className="e-badge badge-request">{leaveCount.request} d</span> Request
        </div>
        <div className="daterange">
          <Presets dateRangeChange={dateRangeChange} />
        </div>
      </div>

      <GridComponent
        id="leave_grid"
        ref={leaveGridIns}
        dataSource={gridData}
        editSettings={{ allowEditing: true }}
        query={query}
        allowPaging={false}
        allowFiltering={true}
        filterSettings={{ type: 'Excel' }}
        toolbar={toolbar}
        toolbarClick={toolbarClick}
        allowExcelExport={true}
        showColumnChooser={true}
        width={'100%'}
        height={'auto'}
        allowSorting={true}
        emptyRecordTemplate={emptyRecordTemplate}
        dataBound={dataBound}
        actionComplete={actionComplete}
      >
        <ColumnsDirective>
          <ColumnDirective field="EmployeeCode" headerText="Code" visible={false} width="120" />
          <ColumnDirective field="AttendanceID" headerText="Task ID" isPrimaryKey={true} width="140" />
          <ColumnDirective field="AbsenceType" headerText="Leave Type" width="120" />
          <ColumnDirective field="ShiftName" headerText="Shift Name" width="120" />
          <ColumnDirective field="From" type="date" format="d MMM yyyy" textAlign="Right" width="120" />
          <ColumnDirective field="To" type="date" format="d MMM yyyy" textAlign="Right" width="120" />
          <ColumnDirective field="Days" headerText="Day(s)" textAlign="Right" width="120" />
          <ColumnDirective field="Status" template={statusTemplate} width="150" />
          {props.employeeData &&
            props.userInfo &&
            props.employeeData.TeamLead === props.userInfo.Name && (
              <ColumnDirective field="Approve" headerText="Approve" template={approveTemplate} width="120" />
            )}
          <ColumnDirective field="CreatedBy" headerText="Created By" width="150" />
        </ColumnsDirective>
        <Inject services={[Page, Filter, Sort, Toolbar, ExcelExport, ColumnChooser, Edit]} />
      </GridComponent>
    </div>
  );
};

export default EmployeeLeave;