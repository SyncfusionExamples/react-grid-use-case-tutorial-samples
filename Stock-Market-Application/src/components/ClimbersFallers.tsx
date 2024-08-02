import * as React from 'react';
import { useState, useRef } from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Page,
  Sort,
  QueryCellInfoEventArgs,
} from '@syncfusion/ej2-react-grids';
import { DataManager, UrlAdaptor, Query } from '@syncfusion/ej2-data';
import { StockDetails } from '../data';

export default function ClimbersFallers() {
  const [gridData, setGridData] = useState(
    new DataManager({
      // url: 'https://ej2services.syncfusion.com/aspnet/development/api/StockData',
      url: 'http://localhost:62869/api/StockData',
      adaptor: new UrlAdaptor(),
      offline: true,
    })
  );
  const [gainersQuery, setGainersQuery] = useState(
    new Query().where('ChangeInValue', 'greaterthan', 0)
  );
  const [losersQuery, setLosersQuery] = useState(
    new Query().where('ChangeInValue', 'lessthan', 0)
  );
  const queryCellInfo = (args: QueryCellInfoEventArgs) => {
    if (
      args.column!.field === 'Last' ||
      args.column!.field === 'ChangeInValue' ||
      args.column!.field === 'ChangeInPercent' ||
      args.column!.field === 'Rating'
    ) {
      if ((args.data as StockDetails).ChangeInValue > 0) {
        args.cell!.classList.add('e-pos');
      } else {
        args.cell!.classList.add('e-neg');
      }
    }
  };
  return (
    <div className="gainers-losers-content-area">
      <div className="sections">
        <div className="section1">
          <div className='header'>Climbers:</div>
          <GridComponent
            id="climbers"
            dataSource={gridData}
            query={gainersQuery}
            queryCellInfo={queryCellInfo}
            allowSorting={true}
            allowPaging={true}
            pageSettings={{ pageCount: 4, pageSize: 7 }}
            enableHover={false}
          >
            <ColumnsDirective>
              <ColumnDirective
                field="ID"
                visible={false}
                textAlign="Center"
                width="100"
              ></ColumnDirective>
              <ColumnDirective
                field="CompanyName"
                headerText="Company"
                width="170"
              ></ColumnDirective>
              <ColumnDirective
                field="Sector"
                visible={false}
                width="100"
              ></ColumnDirective>
              <ColumnDirective
                field="Net"
                visible={false}
                format="N2"
                textAlign="Center"
                width="100"
              ></ColumnDirective>
              <ColumnDirective
                field="Last"
                format="N2"
                textAlign="Center"
                width="80"
              ></ColumnDirective>
              <ColumnDirective
                field="ChangeInValue"
                headerText="CHNG 1D"
                format="N2"
                textAlign="Center"
                visible={false}
                width="100"
              ></ColumnDirective>
              <ColumnDirective
                field="ChangeInPercent"
                headerText="CHNG(%)"
                format="P2"
                textAlign="Center"
                width="100"
              ></ColumnDirective>
              <ColumnDirective
                field="High"
                format="N2"
                textAlign="Center"
                width="80"
              ></ColumnDirective>
              <ColumnDirective
                field="Low"
                format="N2"
                textAlign="Center"
                width="80"
              ></ColumnDirective>
              <ColumnDirective
                field="Volume"
                visible={false}
                textAlign="Center"
                width="90"
              ></ColumnDirective>
            </ColumnsDirective>
            <Inject services={[Page, Sort]} />
          </GridComponent>
        </div>
        <div className="section2">
          <div className='header'>Fallers:</div>
          <GridComponent
            id="fallers"
            dataSource={gridData}
            query={losersQuery}
            queryCellInfo={queryCellInfo}
            allowSorting={true}
            allowPaging={true}
            pageSettings={{ pageCount: 4, pageSize: 7 }}
            enableHover={false}
          >
            <ColumnsDirective>
              <ColumnDirective
                field="ID"
                visible={false}
                textAlign="Center"
                width="100"
              ></ColumnDirective>
              <ColumnDirective
                field="CompanyName"
                headerText="Company"
                width="170"
              ></ColumnDirective>
              <ColumnDirective
                field="Sector"
                visible={false}
                width="100"
              ></ColumnDirective>
              <ColumnDirective
                field="Net"
                visible={false}
                format="N2"
                textAlign="Center"
                width="100"
              ></ColumnDirective>
              <ColumnDirective
                field="Last"
                format="N2"
                textAlign="Center"
                width="80"
              ></ColumnDirective>
              <ColumnDirective
                field="ChangeInValue"
                headerText="CHNG 1D"
                format="N2"
                visible={false}
                textAlign="Center"
                width="100"
              ></ColumnDirective>
              <ColumnDirective
                field="ChangeInPercent"
                headerText="CHNG(%)"
                format="P2"
                textAlign="Center"
                width="100"
              ></ColumnDirective>
              <ColumnDirective
                field="High"
                format="N2"
                textAlign="Center"
                width="80"
              ></ColumnDirective>
              <ColumnDirective
                field="Low"
                format="N2"
                textAlign="Center"
                width="80"
              ></ColumnDirective>
              <ColumnDirective
                field="Volume"
                visible={false}
                textAlign="Center"
                width="90"
              ></ColumnDirective>
            </ColumnsDirective>
            <Inject services={[Page, Sort]} />
          </GridComponent>
        </div>
      </div>
    </div>
  );
}
