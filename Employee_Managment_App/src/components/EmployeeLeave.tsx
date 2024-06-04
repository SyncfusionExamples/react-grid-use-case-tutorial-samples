import * as React from 'react';
import { useState, useCallback, useRef } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Sort, Filter, Page, Toolbar, ColumnChooser, ExcelExport, Edit, Inject, RowInfo } from '@syncfusion/ej2-react-grids';
import { ChangeEventArgs, SwitchComponent } from '@syncfusion/ej2-react-buttons';
import { DataManager, Query, UrlAdaptor, Predicate } from '@syncfusion/ej2-data';
import { DateRangePickerComponent, PresetsDirective, PresetDirective, RangeEventArgs } from '@syncfusion/ej2-react-calendars';
import { EmployeeDetails, EmployeeLeaveDetails } from '../interface.ts';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';

const gridData: DataManager = new DataManager({
    url: 'https://ej2services.syncfusion.com/aspnet/development/api/EmployeesLeaveData',
    adaptor: new UrlAdaptor(),
});
const yearStart: Date = new Date(new Date(new Date().getFullYear(), 0, 1).toDateString());
const yearEnd: Date = new Date(new Date(new Date().getFullYear(), 11, 31).toDateString());

const Presets = (props: { dateRangeChange: (args: RangeEventArgs) => void }) => {
    const monthStart: Date = new Date(new Date(new Date().setDate(1)).toDateString());
    const monthEnd: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(0)).toDateString());
    const lastStart: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)).toDateString());
    const lastEnd: Date = new Date(new Date(new Date().setDate(0)).toDateString());
    const lastSixStart: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() - 6 > 0 ? new Date().getMonth() - 6 : 0)).setDate(1)).toDateString());
    const lastSixEnd: Date = new Date(new Date(new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(0)).toDateString());

    return (
        <DateRangePickerComponent placeholder="Select a range" value={[yearStart, yearEnd]} change={props.dateRangeChange} width={190}>
            <PresetsDirective>
                <PresetDirective label="This Month" start={monthStart} end={monthEnd} ></PresetDirective>
                <PresetDirective label="Last Month" start={lastStart} end={lastEnd} ></PresetDirective>
                <PresetDirective label="Last 6 Months" start={lastSixStart} end={lastSixEnd} ></PresetDirective>
                <PresetDirective label="This Year" start={yearStart} end={yearEnd} ></PresetDirective>
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

    const dataBound = (): void => {
        if (leaveGridIns) {
            const currentViewData: EmployeeLeaveDetails[] = leaveGridIns.current?.currentViewData as EmployeeLeaveDetails[];
            let casual: number = 0; let sick: number = 0; let request: number = 0; let others: number = 0;
            currentViewData.forEach((x): void => {
                if (x.Status === 'Approved') {
                    if (x.AbsenceType === 'Casual') {
                        casual += x.Days;
                    } else if (x.AbsenceType === 'Sick') {
                        sick += x.Days;
                    } else {
                        others += x.Days;
                    }
                } else {
                    request += x.Days;
                }
            });
            setLeaveCount({ casual: casual, sick: sick, others: others, request: request });
        }
    };

    const dateRangeChange = (args: RangeEventArgs): void => {
        let predicate: Predicate = new Predicate('EmployeeCode', 'equal', props.employeeData.EmployeeCode)
            .and('From', 'greaterthanorequal', (args.value as Date[])[0])
            .and('From', 'lessthanorequal', (args.value as Date[])[1]);
        setQuery(() => new Query().where(predicate));
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
        let rowInfo: RowInfo = leaveGridIns.current?.getRowInfo(((args.event as any).target).closest('td')) as RowInfo;
        let rowData = rowInfo?.rowData as EmployeeLeaveDetails;
        rowData.Status = rowData.Status === 'Approved' ? 'Need to Approve' : 'Approved';
        leaveGridIns.current?.setRowData(rowData.AttendanceID, rowData);
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
                    <span className="e-badge badge-casual">{leaveCount.casual} d</span>{' '}
                    Casual |{' '}
                    <span className="e-badge badge-sick">{leaveCount.sick} d</span> Sick |{' '}
                    <span className="e-badge badge-others">{leaveCount.others} d</span>{' '}
                    Others |{' '}
                    <span className="e-badge badge-request">{leaveCount.request} d</span>{' '}
                    Request
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
            >
                <ColumnsDirective>
                    <ColumnDirective
                        field="EmployeeCode"
                        headerText="Code"
                        visible={false}
                        width="120"
                    ></ColumnDirective>
                    <ColumnDirective
                        field="AttendanceID"
                        headerText="Task ID"
                        isPrimaryKey={true}
                        width="140"
                    ></ColumnDirective>
                    <ColumnDirective
                        field="AbsenceType"
                        headerText="Leave Type"
                        width="120"
                    ></ColumnDirective>
                    <ColumnDirective
                        field="ShiftName"
                        headerText="Shift Name"
                        width="120"
                    ></ColumnDirective>
                    <ColumnDirective
                        field="From"
                        type="date"
                        format={{ type: 'date', skeleton: 'medium' }}
                        textAlign="Right"
                        width="120"
                    ></ColumnDirective>
                    <ColumnDirective
                        field="To"
                        type="date"
                        format={{ type: 'date', skeleton: 'medium' }}
                        textAlign="Right"
                        width="120"
                    ></ColumnDirective>
                    <ColumnDirective
                        field="Days"
                        headerText="Day(s)"
                        textAlign="Right"
                        width="120"
                    ></ColumnDirective>
                    <ColumnDirective
                        field="Status"
                        template={statusTemplate}
                        width="150"
                    ></ColumnDirective>
                    {props.employeeData &&
                        props.userInfo &&
                        props.employeeData.TeamLead === props.userInfo.Name && (
                            <ColumnDirective
                                field="Approve"
                                headerText="Approve"
                                template={approveTemplate}
                                width="120"
                            ></ColumnDirective>
                        )}
                    <ColumnDirective
                        field="CreatedBy"
                        headerText="Created By"
                        width="150"
                    ></ColumnDirective>
                </ColumnsDirective>
                <Inject
                    services={[
                        Page,
                        Filter,
                        Sort,
                        Toolbar,
                        ExcelExport,
                        ColumnChooser,
                        Edit,
                    ]}
                />
            </GridComponent>
        </div>
    );
};

export default EmployeeLeave;
