// src/components/Employees.tsx
import * as React from 'react';
import {
  GridComponent, ColumnsDirective, ColumnDirective, Sort, Toolbar, Filter, Group, ColumnChooser,
  Page, Inject, ContextMenu, CommandColumn, Freeze, LazyLoadGroup, RecordClickEventArgs, RowInfo,
  ExcelExport, Column, Search // <-- add Search
} from '@syncfusion/ej2-react-grids';
import { DataManager, UrlAdaptor, DataUtil, Query } from '@syncfusion/ej2-data';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { EmployeeDetails } from '../interface.ts';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import type { SelectedFilter } from './Organization';
import './Employees.css';

DataUtil.serverTimezoneOffset = 0;


const MAX_COUNT = 3000;

class CappedUrlAdaptor extends UrlAdaptor {
  public processResponse(data: any, ds: any, query: Query, xhr: any, request: any, changes?: any) {
    const res: any = super.processResponse(data, ds, query, xhr, request, changes);
    // res can be array or { result, count } depending on server
    if (res && typeof res === 'object' && 'result' in res && 'count' in res) {
      // Clamp the reported total
      res.count = Math.min(res.count ?? 0, MAX_COUNT);
    }
    return res;
  }
}

const data = new DataManager({
  url: 'https://ej2services.syncfusion.com/aspnet/development/api/EmployeesData',
  adaptor: new CappedUrlAdaptor(),
});

type EmployeesProps = {
  employeeData?: EmployeeDetails;
  userInfo?: EmployeeDetails;
  selected?: SelectedFilter; // 'active' | 'myTeam' | 'directReporters' | null
};

const Employees = (props?: EmployeesProps) => {
  const navigate = useNavigate();

  const employeeGridIns = useRef<GridComponent>(null);
  const tooltipObj = useRef<TooltipComponent>(null);
  const gridRef = React.useRef<GridComponent | null>(null);
   // Use Syncfusion Grid API to auto-fit column widths and keep height auto-sized
  const onGridDataBound = React.useCallback(() => {
    const grid: any = employeeGridIns.current;
    if (!grid) return;
    // Ensure grid height is set to auto so it adapts to content (Syncfusion supports 'auto')
    if (grid.element) {
      grid.height = 'auto';
    }
  }, []);

  // Apply/clear remote filters on pill changes or routed context
  useEffect(() => {
    const grid = employeeGridIns.current;
    if (!grid) return;
    const gridEl = gridRef.current?.element;
  if (!gridEl) return;

    // Clear existing filters and search when the pill changes
    grid.clearFiltering();
    // Optionally reset any prior search so pills don't combine with search
    grid.search(''); // clears search

    // If opened from a context that passes employeeData, filter by that TeamLead
    if (props?.employeeData?.Name) {
      grid.filterByColumn('TeamLead', 'equal', props.employeeData.Name);
      return;
    }

    // Apply filters based on the selected pill on Organization page
    const sel = props?.selected;

    if (sel === 'myTeam' && props?.userInfo?.Team) {
      grid.filterByColumn('Team', 'equal', props.userInfo.Team);
    } else if (sel === 'directReporters' && props?.userInfo?.TeamLead) {
      // Show my direct reporting person (supervisor)
      grid.filterByColumn('Name', 'equal', props.userInfo.TeamLead);

      // If instead you meant "people who report to me", use:
      // grid.filterByColumn('TeamLead', 'equal', props.userInfo.Name);
    } else {
      // 'active' or no selection => no filter (loads all)
      // clearFiltering already done above
    }
  }, [props?.selected, props?.userInfo?.Team, props?.userInfo?.TeamLead, props?.employeeData?.Name]);

  const toolbar: string[] =
    props?.employeeData?.Name === props?.userInfo?.Name
      ? ['ExcelExport', 'ColumnChooser', 'Search']
      : ['Search', 'ColumnChooser'];

  const searchSettings: { fields: string[] } = {
    fields: ['EmployeeCode', 'Name', 'Mail', 'Designation', 'Branch', 'Team', 'TeamLead', 'ManagerName'],
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
      <a className="empid employee-popover" href="#" onClick={(e) => e.preventDefault()}>
        {args[args.column.field]}
      </a>
    );
  };

  const nameTemplate = (args: any) => {
    return (
      <span className="empName employee-popover">
        {args[args.column.field]}
      </span>
    );
  };

  const beforeRender = (args: TooltipEventArgs) => {
   
    if(args.target.classList.contains('e-headercell')) {
      (tooltipObj.current as any).content =args.target.innerText;
    }
    else {
    const rowInfo: RowInfo = gridRef.current?.getRowInfo(args.target.closest('td') as HTMLElement) as RowInfo;
    const rowData = rowInfo?.rowData as EmployeeDetails;
    (tooltipObj.current as any).content = `
    <div id="democontent" className="democontent">
        <div style="display: inline-block; padding: 4px 4px 0 4px">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 15" color="#000000">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
          </svg>
          <div style="display: inline-block; padding: 0 0 8px 8px">
            <div style="color: #707070; font-weight: bold; font-size: 12px;">${rowData?.Name ?? ''}</div>
            <div style="color: #707070; font-size: 11px;">${rowData?.Designation ?? ''}</div>
          </div>
        </div>
      </div>`;
    }
  };

  return (
    <div className="employees-content" >
      <TooltipComponent
        id="content"
        cssClass="e-tooltip-template-css"
        target="#employees_grid .e-headercell, #employees_grid td.infotooltip, .employee-popover"
        beforeRender={beforeRender}
        ref={tooltipObj}
        position='TopRight'
      >
        <GridComponent
          id="employees_grid"
          ref={gridRef}
          dataSource={data}
          allowPaging={true}
          pageSettings={{ pageCount: 8, pageSize: 12 }}
          allowExcelExport={true}
          //width={'100%'}
          height={'100%'}
          
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
          dataBound={onGridDataBound}
        >
          <ColumnsDirective>
            <ColumnDirective
              field="Image"
              headerText="Image"
              template={imageTemplate}
              clipMode='Clip'
              allowFiltering={false}
              allowSorting={false}
              allowGrouping={false}
              textAlign="Center"
              width="80"
            />
            <ColumnDirective
              field="EmployeeCode"
              headerText="Employee ID"
              template={codeTemplate}
              customAttributes={{ class: 'infotooltip' }}
              width="120"
            />
            <ColumnDirective field="Name" template={nameTemplate} customAttributes={{ class: 'infotooltip' }} width="150" />
            <ColumnDirective field="Mail" headerText="Email ID" clipMode="EllipsisWithTooltip" width="230" />
            <ColumnDirective field="Designation" clipMode="EllipsisWithTooltip" width="220" />
            <ColumnDirective
              field="DateOfJoining"
              headerText="Date Joined"
              type="date"
              format={{ type: 'date', format: "MMM d yyyy"}}
              clipMode="EllipsisWithTooltip"
              width="100"
            />
            <ColumnDirective field="Branch" clipMode="EllipsisWithTooltip" width="100" />
            <ColumnDirective field="Team" headerText="Team(s)" clipMode="EllipsisWithTooltip" width="170" />
            <ColumnDirective field="TeamLead" headerText="Reporter" clipMode="EllipsisWithTooltip" width="130" />
            <ColumnDirective field="ManagerName" headerText="Manager" clipMode="EllipsisWithTooltip" width="140" />
          </ColumnsDirective>
          <Inject
            // IMPORTANT: include Search here so the toolbar Search works with remote data
            services={[Page, ContextMenu, CommandColumn, Sort, Toolbar, Filter, Group, ColumnChooser, Freeze, LazyLoadGroup, ExcelExport, Search]}
          />
        </GridComponent>
      </TooltipComponent>
    </div>
  );
};

export default Employees;