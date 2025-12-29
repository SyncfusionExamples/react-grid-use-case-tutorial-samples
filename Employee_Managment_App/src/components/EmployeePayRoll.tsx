// src/components/EmployeePayRoll.tsx
import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Filter,
  Page,
  Inject,
  Freeze,
  Aggregate,
  QueryCellInfoEventArgs
} from '@syncfusion/ej2-react-grids';
import {
  AggregateColumnDirective,
  AggregateColumnsDirective,
  AggregateDirective,
  AggregatesDirective,
  AggregateColumnModel
} from '@syncfusion/ej2-react-grids';
import { DataManager, Query, UrlAdaptor } from '@syncfusion/ej2-data';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { EmployeeDetails, MonthPayStub } from '../interface.ts';

const gridData: DataManager = new DataManager({
  url: 'https://ej2services.syncfusion.com/aspnet/development/api/EmployeesPayStubData',
  adaptor: new UrlAdaptor(),
});

const MOBILE_BREAKPOINT = 768; // adjust breakpoint as needed

const EmployeePayRoll = (props: { employeeData: EmployeeDetails }) => {
  const payRollGridIns = useRef<GridComponent>(null);
  const isPreviousYearRef = useRef<boolean>(false);

  const [frozenCount, setFrozenCount] = useState<number>(3);

  const query: Query = new Query().where('EmployeeCode', 'equal', props.employeeData.EmployeeCode);
  const currentDate: Date = new Date();
  const currentYear: number = currentDate.getFullYear() - 1;

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

  useEffect(() => {
    const computeFrozen = () => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT;
      // We have one hidden left column (EmployeeCode).
      // Desktop: 2 visible frozen (Item, Total) => 1 hidden + 2 visible = 3
      // Mobile: 1 visible frozen (Item) => 1 hidden + 1 visible = 2
      const hiddenLeft = 1;
      const desiredVisibleFrozen = isMobile ? 1 : 2;
      setFrozenCount(hiddenLeft + desiredVisibleFrozen);
    };

    computeFrozen();
    const onResize = () => computeFrozen();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const itemTemplate = () => {
  return (
    <div>
      <table className="CardTable">
        <colgroup>
          <col />
        </colgroup>
        <tbody>
          <tr>
            <td className="cardcell" style={{ fontWeight: 400 }}> Regular Hours Worked </td>
          </tr>
          <tr>
            <td className="cardcell" style={{ fontWeight: 400 }}>OverTime Hours Worked </td>
          </tr>
          <tr>
            <td className="cardcell" style={{ fontWeight: 400 }}> Bonus </td>
          </tr>
          <tr>
            <td className="cardcell separateline" style={{ fontWeight: 400 }}> Commission </td>
          </tr>
          <tr>
            <td className="cardcell" style={{ fontWeight: 400 }}> Federal Income Tax </td>
          </tr>
          <tr>
            <td className="cardcell" style={{ fontWeight: 400 }}> State Income Tax </td>
          </tr>
          <tr>
            <td className="cardcell" style={{ fontWeight: 400 }}> Social Security Tax </td>
          </tr>
          <tr>
            <td className="cardcell" style={{ fontWeight: 400 }}> MedicareTax </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

  const totalTemplate = () => {
    return (
      <div>
        <table className="CardTable">
          <colgroup>
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td className="cardcell RegularHoursWorked"></td>
            </tr>
            <tr>
              <td className="cardcell OverTimeHoursWorked"></td>
            </tr>
            <tr>
              <td className="cardcell Bonus"></td>
            </tr>
            <tr>
              <td className="cardcell Commission separateline"></td>
            </tr>
            <tr>
              <td className="cardcell FederalIncomeTax"></td>
            </tr>
            <tr>
              <td className="cardcell StateIncomeTax"></td>
            </tr>
            <tr>
              <td className="cardcell SocialSecurityTax"></td>
            </tr>
            <tr>
              <td className="cardcell MedicareTax"></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const paystubTemplate = (props: any) => {
    const factor = isPreviousYearRef.current ? 0.9 : 1;
    const RegularHoursWorked: string = (props[props.column.field].RegularHoursWorked * factor).toFixed(2);
    const OverTimeHoursWorked: string = (props[props.column.field].OverTimeHoursWorked * factor).toFixed(2);
    const Bonus: string = (props[props.column.field].Bonus * factor).toFixed(2);
    const Commission: string = (props[props.column.field].Commission * factor).toFixed(2);
    const FederalIncomeTax: string = (props[props.column.field].FederalIncomeTax * factor).toFixed(2);
    const StateIncomeTax: string = (props[props.column.field].StateIncomeTax * factor).toFixed(2);
    const SocialSecurityTax: string = (props[props.column.field].SocialSecurityTax * factor).toFixed(2);
    const MedicareTax: string = (props[props.column.field].MedicareTax * factor).toFixed(2);

    return (
      <div>
        <table className="CardTable">
          <colgroup>
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td className="cardcell">$ {RegularHoursWorked} </td>
            </tr>
            <tr>
              <td className="cardcell">$ {OverTimeHoursWorked} </td>
            </tr>
            <tr>
              <td className="cardcell">$ {Bonus} </td>
            </tr>
            <tr>
              <td className="cardcell separateline">$ {Commission} </td>
            </tr>
            <tr>
              <td className="cardcell">$ {FederalIncomeTax} </td>
            </tr>
            <tr>
              <td className="cardcell">$ {StateIncomeTax} </td>
            </tr>
            <tr>
              <td className="cardcell">$ {SocialSecurityTax} </td>
            </tr>
            <tr>
              <td className="cardcell">$ {MedicareTax} </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const elemClass: string[] = [
    'RegularHoursWorked',
    'OverTimeHoursWorked',
    'Bonus',
    'Commission',
    'FederalIncomeTax',
    'StateIncomeTax',
    'SocialSecurityTax',
    'MedicareTax',
  ];

  const queryCellInfo = (args: QueryCellInfoEventArgs): void => {
  if (args.column?.field === 'Total') {
    // Compute totals into the Total column
    for (let i = 0; i < elemClass.length; i++) {
      const elem = args.cell?.querySelector('.' + elemClass[i]) as HTMLElement;
      let value = 0;
      for (let j = 0; j < months.length; j++) {
        if ((args.data as any)[months[j].field]) {
          value += (args.data as any)[months[j].field][elemClass[i]] * (isPreviousYearRef.current ? 0.9 : 1);
        }
      }
      if (elem) {
        elem.innerText = '$ ' + value.toFixed(2);
      }
    }

    // Make all Total column values medium (500)
    const totalCells = args.cell?.querySelectorAll('.cardcell') ?? [];
    totalCells.forEach((c) => ((c as HTMLElement).style.fontWeight = '500'));
  }
};

  const calculteGrossAggregate = (data: any, aggColumn: AggregateColumnModel): string => {
    const payStubData: MonthPayStub =
      data && data.result && data.result[0] ? data.result[0][aggColumn.field as string] : null;
    if (payStubData) {
      const grossSum: number =
        payStubData.RegularHoursWorked +
        payStubData.OverTimeHoursWorked +
        payStubData.Bonus +
        payStubData.Commission;
      return (grossSum * (isPreviousYearRef.current ? 0.9 : 1)).toFixed(2);
    } else {
      return '';
    }
  };

  const calculteDeductionAggregate = (data: any, aggColumn: AggregateColumnModel): string => {
    const payStubData: MonthPayStub =
      data && data.result && data.result[0] ? data.result[0][aggColumn.field as string] : null;
    if (payStubData) {
      const deductionSum: number =
        payStubData.FederalIncomeTax +
        payStubData.StateIncomeTax +
        payStubData.SocialSecurityTax +
        payStubData.MedicareTax;
      return (deductionSum * (isPreviousYearRef.current ? 0.9 : 1)).toFixed(2);
    } else {
      return '';
    }
  };

  const calculteNetPayAggregate = (data: any, aggColumn: AggregateColumnModel): string => {
    const payStubData: MonthPayStub =
      data && data.result && data.result[0] ? data.result[0][aggColumn.field as string] : null;
    if (payStubData) {
      const grossSum: number =
        payStubData.RegularHoursWorked +
        payStubData.OverTimeHoursWorked +
        payStubData.Bonus +
        payStubData.Commission;
      const deductionSum: number =
        payStubData.FederalIncomeTax +
        payStubData.StateIncomeTax +
        payStubData.SocialSecurityTax +
        payStubData.MedicareTax;
      return ((grossSum - deductionSum) * (isPreviousYearRef.current ? 0.9 : 1)).toFixed(2);
    } else {
      return '';
    }
  };

  const calculteGrossInYear = (data: any): string => {
    const payStubData = data && data.result && data.result[0] ? data.result[0] : null;
    if (payStubData) {
      let grossSum: number = 0;
      months.forEach((x) => {
        grossSum +=
          (payStubData[x.field] as MonthPayStub).RegularHoursWorked +
          (payStubData[x.field] as MonthPayStub).OverTimeHoursWorked +
          (payStubData[x.field] as MonthPayStub).Bonus +
          (payStubData[x.field] as MonthPayStub).Commission;
      });
      return (grossSum * (isPreviousYearRef.current ? 0.9 : 1)).toFixed(2);
    } else {
      return '';
    }
  };

  const calculteDeductionInYear = (data: any): string => {
    const payStubData = data && data.result && data.result[0] ? data.result[0] : null;
    if (payStubData) {
      let deductionSum: number = 0;
      months.forEach((x) => {
        deductionSum +=
          (payStubData[x.field] as MonthPayStub).FederalIncomeTax +
          (payStubData[x.field] as MonthPayStub).StateIncomeTax +
          (payStubData[x.field] as MonthPayStub).SocialSecurityTax +
          (payStubData[x.field] as MonthPayStub).MedicareTax;
      });
      return (deductionSum * (isPreviousYearRef.current ? 0.9 : 1)).toFixed(2);
    } else {
      return '';
    }
  };

  const calculteNetPayInYear = (data: any): string => {
    const payStubData = data && data.result && data.result[0] ? data.result[0] : null;
    if (payStubData) {
      let grossSum: number = 0;
      let deductionSum: number = 0;
      months.forEach((x) => {
        grossSum +=
          (payStubData[x.field] as MonthPayStub).RegularHoursWorked +
          (payStubData[x.field] as MonthPayStub).OverTimeHoursWorked +
          (payStubData[x.field] as MonthPayStub).Bonus +
          (payStubData[x.field] as MonthPayStub).Commission;
        deductionSum +=
          (payStubData[x.field] as MonthPayStub).FederalIncomeTax +
          (payStubData[x.field] as MonthPayStub).StateIncomeTax +
          (payStubData[x.field] as MonthPayStub).SocialSecurityTax +
          (payStubData[x.field] as MonthPayStub).MedicareTax;
      });
      return ((grossSum - deductionSum) * (isPreviousYearRef.current ? 0.9 : 1)).toFixed(2);
    } else {
      return '';
    }
  };

  const payrollChange = (args: { value: number }) => {
    isPreviousYearRef.current = args.value !== currentYear;
    payRollGridIns.current?.refresh();
  };

  return (
    <div className="payrollpage">
      <div className="payroll-header">
        <div className="payrollinfo">Payroll for the selected year </div>
        <div className="payrolldd-container">
          <DropDownListComponent
            id="payrolldd"
            value={currentYear}
            dataSource={[currentYear, currentYear - 1]}
            change={payrollChange}
            width={250}
          />
        </div>
      </div>
      <GridComponent
        id="payroll_grid"
        ref={payRollGridIns}
        dataSource={gridData}
        allowPaging={false}
        query={query}
        width={'100%'}
        height={'auto'}
        queryCellInfo={queryCellInfo}
        frozenColumns={frozenCount} // responsive frozen columns
        enableHover={false}
        allowSelection={false}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="EmployeeCode"
            headerText="Code"
            visible={false}
            width="120"
          />
          <ColumnDirective
            field="Item"
            headerText="Item"
            template={itemTemplate}
            width="190"
          />
          <ColumnDirective
            field="Total"
            headerText="Total"
            template={totalTemplate}
            textAlign="Right"
            width="120"
          />
          {months.map((x, index) => {
            return (
              <ColumnDirective
                key={index + 4}
                field={x.field}
                textAlign="Right"
                headerText={x.headerText}
                template={paystubTemplate}
                width="120"
              />
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
              <AggregateColumnDirective
                field="Total"
                type="Custom"
                customAggregate={calculteGrossInYear}
                footerTemplate={(props: any) => {
                  return <span style={{ fontWeight: 500 }}>$ {props.Custom}</span>;
                }}
              />
              {months.map((x, index) => {
                return (
                  <AggregateColumnDirective
                    key={index + 3}
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
                footerTemplate={() => {
                  return <span>Deductions</span>;
                }}
              />
              <AggregateColumnDirective
                field="Total"
                type="Custom"
                customAggregate={calculteDeductionInYear}
                footerTemplate={(props: any) => {
                  return <span style={{ fontWeight: 500 }}>$ {props.Custom}</span>;
                }}
              />
              {months.map((x, index) => {
                return (
                  <AggregateColumnDirective
                    key={index + 3}
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
                  return <span style={{ fontWeight: 600 }}>Net Pay</span>;
                }}
              />
              <AggregateColumnDirective
                field="Total"
                type="Custom"
                customAggregate={calculteNetPayInYear}
                footerTemplate={(props: any) => {
                  return <span style={{ fontWeight: 600 }}>$ {props.Custom}</span>;
                }}
              />
              {months.map((x, index) => {
              return (
                <AggregateColumnDirective
                  key={index + 3}
                  field={x.field}
                  type="Custom"
                  customAggregate={calculteNetPayAggregate}
                  footerTemplate={(props: any) => {
                    return <span style={{ fontWeight: 600 }}>$ {props.Custom}</span>;
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

export default EmployeePayRoll;