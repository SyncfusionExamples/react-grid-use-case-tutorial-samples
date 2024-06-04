import * as React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Sort, Toolbar, Filter, Group, ColumnChooser, Page, Inject, ContextMenu, CommandColumn, Freeze, LazyLoadGroup, RecordClickEventArgs, RowInfo, ExcelExport, Column } from '@syncfusion/ej2-react-grids';
import { DataManager, Query, UrlAdaptor, DataUtil, Predicate } from '@syncfusion/ej2-data';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { EmployeeDetails } from '../interface.ts';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';

DataUtil.serverTimezoneOffset = 0;

const data: DataManager = new DataManager({
  url: 'https://ej2services.syncfusion.com/aspnet/development/api/EmployeesData',
  adaptor: new UrlAdaptor(),
});

const Employees = (props?: { employeeData?: EmployeeDetails; userInfo?: EmployeeDetails }) => {
  const navigate = useNavigate();
  let predicate: Predicate;
  if (props?.employeeData) {
    predicate = new Predicate('TeamLead', 'equal', props.employeeData.Name);
  }
  const [query, setQuery] = useState(() => new Query().where(predicate));
  let employeeGridIns = useRef<GridComponent>(null);
  let tooltipObj = useRef<TooltipComponent>(null);
  const toolbar: string[] = props?.employeeData?.Name === props?.userInfo?.Name ? ['ExcelExport', 'ColumnChooser', 'Search'] : ['ColumnChooser', 'Search'];
  const searchSettings: { fields: string[] } = {
    fields: [ 'EmployeeCode', 'Name', 'Mail', 'Designation', 'Branch', 'Team', 'TeamLead', 'ManagerName'],
  };
  const recordClick = (args: RecordClickEventArgs): void => {
    if (args.column?.field === 'EmployeeCode' && args.target && args.target.classList.contains('employee-popover') && args.rowData) {
      navigate('/employeeinfo', {
        state: { employeeID: args.rowData, userInfo: props?.userInfo },
      });
    }
  };

  const toolbarClick = (args: ClickEventArgs): void => {
    if (args.item.id === 'employees_grid_excelexport') {
      (employeeGridIns.current?.getColumnByField('Image') as Column).visible = false;
      employeeGridIns.current?.excelExport();
    }
  };

  const excelExportComplete = (): void => {
    (employeeGridIns.current?.getColumnByField('Image') as Column).visible = true;
  };

  const imageTemplate = () => {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-person-circle"
          viewBox="0 0 16 15"
          color="rgba(0, 0, 0, .54)"
        >
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path
            fillRule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
          />
        </svg>
      </>
    );
  };

  const codeTemplate = (args: any) => {
    return (
      <a
        className="empid employee-popover"
        href="#"
        onClick={(e) => e.preventDefault()}
      >
        {args[args.column.field]}
      </a>
    );
  };

  const beforeRender = (args: TooltipEventArgs) => {
    var rowInfo: RowInfo = employeeGridIns.current?.getRowInfo((args.target.closest('td') as HTMLElement)) as RowInfo;
    var rowData = rowInfo?.rowData as EmployeeDetails;
    (tooltipObj.current as any).content = `
    <div id="democontent" className="democontent">
        <div style="display: inline-block; padding: 4px 4px 0 4px">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-person-circle"
            viewBox="0 0 16 15"
            color="rgba(0, 0, 0, .54)"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path
              fillRule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
            />
          </svg>
          <div style="display: inline-block; padding: 0 0 8px 8px">
          <div>${rowData?.Name}</div>
          <div>${rowData?.Designation}</div>
          </div>
        </div>
      </div>`;
  };

  return (
    <div className="employees-content">
      <TooltipComponent
        id="content"
        cssClass="e-tooltip-template-css"
        target="td.infotooltip"
        beforeRender={beforeRender}
        ref={tooltipObj}
      >
        <GridComponent
          id="employees_grid"
          ref={employeeGridIns}
          dataSource={data}
          query={props?.employeeData ? query : undefined}
          allowPaging={true}
          allowExcelExport={true}
          height={270}
          width={'100%'}
          allowGrouping={true}
          groupSettings={{ enableLazyLoading: true }}
          toolbar={toolbar}
          searchSettings={searchSettings}
          toolbarClick={toolbarClick}
          excelExportComplete={excelExportComplete}
          showColumnChooser={true}
          allowSorting={true}
          allowFiltering={true}
          filterSettings={{ type: 'Excel', enableInfiniteScrolling: true }}
          recordClick={recordClick}
        >
          <ColumnsDirective>
            <ColumnDirective
              field="Image"
              headerText="Image"
              template={imageTemplate}
              allowFiltering={false}
              allowSorting={false}
              allowGrouping={false}
              textAlign="Center"
              width="80"
            ></ColumnDirective>
            <ColumnDirective
              field="EmployeeCode"
              headerText="Code"
              template={codeTemplate}
              customAttributes={{ class: 'infotooltip' }}
              width="120"
            ></ColumnDirective>
            <ColumnDirective
              field="Name"
              customAttributes={{ class: 'infotooltip' }}
              width="150"
            ></ColumnDirective>
            <ColumnDirective
              field="Mail"
              clipMode="EllipsisWithTooltip"
              width="260"
            ></ColumnDirective>
            <ColumnDirective
              field="Designation"
              clipMode="EllipsisWithTooltip"
              width="260"
            ></ColumnDirective>
            <ColumnDirective
              field="DateOfJoining"
              headerText="Date Joined"
              textAlign="Right"
              type="date"
              format={{ type: 'date', skeleton: 'medium' }}
              clipMode="EllipsisWithTooltip"
              width="150"
            ></ColumnDirective>
            <ColumnDirective
              field="Branch"
              clipMode="EllipsisWithTooltip"
              width="120"
            ></ColumnDirective>
            <ColumnDirective
              field="Team"
              headerText="Team(s)"
              clipMode="EllipsisWithTooltip"
              width="220"
            ></ColumnDirective>
            <ColumnDirective
              field="TeamLead"
              headerText="Reporter"
              clipMode="EllipsisWithTooltip"
              width="150"
            />
            <ColumnDirective
              field="ManagerName"
              headerText="Manager"
              clipMode="EllipsisWithTooltip"
              width="150"
            />
          </ColumnsDirective>
          <Inject
            services={[Page, ContextMenu, CommandColumn, Sort, Toolbar, Filter, Group, ColumnChooser, Freeze, LazyLoadGroup, ExcelExport]}
          />
        </GridComponent>
      </TooltipComponent>
    </div>
  );
};

export default Employees;
