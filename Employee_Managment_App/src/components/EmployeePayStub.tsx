import * as React from 'react';
import { useRef } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Filter, Page, Inject, Freeze, Aggregate } from '@syncfusion/ej2-react-grids';
import { AggregateColumnDirective, AggregateColumnsDirective, AggregateDirective, AggregatesDirective, AggregateColumnModel } from '@syncfusion/ej2-react-grids';
import { DataManager, Query, UrlAdaptor } from '@syncfusion/ej2-data';
import { ChangeEventArgs, DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { EmployeeDetails, MonthPayStub } from '../interface.ts';

const gridData: DataManager = new DataManager({
  url: 'https://ej2services.syncfusion.com/aspnet/development/api/EmployeesPayStubData',
  adaptor: new UrlAdaptor(),
});

const EmployeePayStub = (props: { employeeData: EmployeeDetails }) => {
  let payStubGridIns = useRef<GridComponent>(null);;;
  const query: Query = new Query().where('EmployeeCode', 'equal', props.employeeData.EmployeeCode);
  const currentDate: Date = new Date();
  const currentMonth: number = currentDate.getMonth();
  const currentYear: number = currentDate.getFullYear();
  const months: { field: string; headerText: string }[] = [
    { field: 'JanPayStub', headerText: 'Jan' },
    { field: 'FebPayStub', headerText: 'Feb' },
    { field: 'MarPayStub', headerText: 'Mar' },
    { field: 'AprPayStub', headerText: 'Apr' },
    { field: 'MayPayStub', headerText: 'May' },
    { field: 'JunPayStub', headerText: 'Jun' },
    { field: 'JulPayStub', headerText: 'Jul' },
    { field: 'AugPayStub', headerText: 'Aug' },
    { field: 'SepPayStub', headerText: 'Sep' },
    { field: 'OctPayStub', headerText: 'Oct' },
    { field: 'NovPayStub', headerText: 'Nov' },
    { field: 'DecPayStub', headerText: 'Dec' },
  ];

  const itemTemplate = () => {
    return (
      <div>
        <table className="CardTable">
          <colgroup>
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td className="cardcell"> Regular Hours Worked </td>
            </tr>
            <tr>
              <td className="cardcell">OverTime Hours Worked </td>
            </tr>
            <tr>
              <td className="cardcell"> Bonus </td>
            </tr>
            <tr>
              <td className="cardcell separateline"> Commission </td>
            </tr>
            <tr>
              <td className="cardcell"> Federal Income Tax </td>
            </tr>
            <tr>
              <td className="cardcell"> State Income Tax </td>
            </tr>
            <tr>
              <td className="cardcell"> Social Security Tax </td>
            </tr>
            <tr>
              <td className="cardcell"> MedicareTax </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const paystubTemplate = (props: any) => {
    return (
      <div>
        <table className="CardTable">
          <colgroup>
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td className="cardcell">
                $ {props[props.column.field].RegularHoursWorked.toFixed(2)}{' '}
              </td>
            </tr>
            <tr>
              <td className="cardcell">
                $ {props[props.column.field].OverTimeHoursWorked.toFixed(2)}{' '}
              </td>
            </tr>
            <tr>
              <td className="cardcell">
                $ {props[props.column.field].Bonus.toFixed(2)}{' '}
              </td>
            </tr>
            <tr>
              <td className="cardcell separateline">
                $ {props[props.column.field].Commission.toFixed(2)}{' '}
              </td>
            </tr>
            <tr>
              <td className="cardcell">
                $ {props[props.column.field].FederalIncomeTax.toFixed(2)}{' '}
              </td>
            </tr>
            <tr>
              <td className="cardcell">
                $ {props[props.column.field].StateIncomeTax.toFixed(2)}{' '}
              </td>
            </tr>
            <tr>
              <td className="cardcell">
                $ {props[props.column.field].SocialSecurityTax.toFixed(2)}{' '}
              </td>
            </tr>
            <tr>
              <td className="cardcell">
                $ {props[props.column.field].MedicareTax.toFixed(2)}{' '}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const calculteGrossAggregate = (data: any, aggColumn: AggregateColumnModel): string => {
    let payStubData: MonthPayStub = data && data.result && data.result[0] ? data.result[0][aggColumn.field as string] : null;
    if (payStubData) {
      let grossSum: number = payStubData.RegularHoursWorked + payStubData.OverTimeHoursWorked + payStubData.Bonus + payStubData.Commission;
      return grossSum.toFixed(2);
    } else {
      return '';
    }
  };

  const calculteDeductionAggregate = (data: any, aggColumn: AggregateColumnModel): string => {
    let payStubData: MonthPayStub = data && data.result && data.result[0] ? data.result[0][aggColumn.field as string] : null;
    if (payStubData) {
      let deductionSum: number = payStubData.FederalIncomeTax + payStubData.StateIncomeTax + payStubData.SocialSecurityTax + payStubData.MedicareTax;
      return deductionSum.toFixed(2);
    } else {
      return '';
    }
  };

  const calculteNetPayAggregate = (data: any, aggColumn: AggregateColumnModel): string => {
    let payStubData: MonthPayStub = data && data.result && data.result[0] ? data.result[0][aggColumn.field as string] : null;
    if (payStubData) {
      let grossSum: number = payStubData.RegularHoursWorked + payStubData.OverTimeHoursWorked + payStubData.Bonus + payStubData.Commission;
      let deductionSum: number = payStubData.FederalIncomeTax + payStubData.StateIncomeTax + payStubData.SocialSecurityTax + payStubData.MedicareTax;
      return (grossSum - deductionSum).toFixed(2);
    } else {
      return '';
    }
  };

  const paystubChange = (args: ChangeEventArgs): void => {
    let showCols: string[] = [(args.itemData as { field: string; headerText: string }).headerText];
    let hideCols: string[] = [];
    months.forEach((x) => {
      if (x.headerText !== (args.itemData as { field: string; headerText: string }).headerText) {
        hideCols.push(x.headerText);
      }
    });
    payStubGridIns.current?.showColumns(showCols, 'headerText');
    payStubGridIns.current?.hideColumns(hideCols, 'headerText');
  };

  return (
    <div className="paystubpage">
      <div className="paystub-header">
        <div className="paystubinfo">
          Paystub for the selected month in {currentYear}
        </div>
        <div className="paystubdd-container">
          <DropDownListComponent
            id="paystubdd"
            dataSource={months}
            value={months[currentMonth].headerText}
            fields={{ text: 'headerText', value: 'headerText' }}
            change={paystubChange}
            width={250}
          />
        </div>
      </div>
      <GridComponent
        id="paystub_grid"
        ref={payStubGridIns}
        dataSource={gridData}
        allowPaging={false}
        query={query}
        height={'auto'}
        enableHover={false}
        allowSelection={false}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="EmployeeCode"
            headerText="Code"
            visible={false}
            width="120"
          ></ColumnDirective>
          <ColumnDirective
            field="Item"
            headerText="Item"
            template={itemTemplate}
            width="170"
          ></ColumnDirective>
          {months.map((x, index) => {
            return (
              <ColumnDirective
                key={index + 4}
                field={x.field}
                headerText={x.headerText}
                template={paystubTemplate}
                visible={months[currentMonth].field === x.field}
                width="120"
              ></ColumnDirective>
            );
          })}
        </ColumnsDirective>
        <AggregatesDirective>
          <AggregateDirective>
            <AggregateColumnsDirective>
              <AggregateColumnDirective
                field="Item"
                type="Custom"
                footerTemplate={() => {
                  return <span>Gross Pay</span>;
                }}
              />
              {months.map((x, index) => {
                return (
                  <AggregateColumnDirective
                  key={index + 2}
                    field={x.field}
                    type="Custom"
                    customAggregate={calculteGrossAggregate}
                    footerTemplate={(props: any) => {
                      return <span>$ {props.Custom}</span>;
                    }}
                  />
                );
              })}
            </AggregateColumnsDirective>
          </AggregateDirective>
          <AggregateDirective>
            <AggregateColumnsDirective>
              <AggregateColumnDirective
                field="Item"
                type="Custom"
                footerTemplate={(props: any) => {
                  return <span>Deductions</span>;
                }}
              />
              {months.map((x, index) => {
                return (
                  <AggregateColumnDirective
                  key={index + 2}
                    field={x.field}
                    type="Custom"
                    customAggregate={calculteDeductionAggregate}
                    footerTemplate={(props: any) => {
                      return <span>$ {props.Custom}</span>;
                    }}
                  />
                );
              })}
            </AggregateColumnsDirective>
          </AggregateDirective>
          <AggregateDirective>
            <AggregateColumnsDirective>
              <AggregateColumnDirective
                field="Item"
                type="Custom"
                footerTemplate={() => {
                  return <span>Net Pay</span>;
                }}
              />
              {months.map((x, index) => {
                return (
                  <AggregateColumnDirective
                  key={index + 2}
                    field={x.field}
                    type="Custom"
                    customAggregate={calculteNetPayAggregate}
                    footerTemplate={(props: any) => {
                      return <span>$ {props.Custom}</span>;
                    }}
                  />
                );
              })}
            </AggregateColumnsDirective>
          </AggregateDirective>
        </AggregatesDirective>
        <Inject services={[Page, Filter, Freeze, Aggregate]} />
      </GridComponent>
    </div>
  );
};

export default EmployeePayStub;
