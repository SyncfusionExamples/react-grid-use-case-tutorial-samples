import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QueryBuilderComponent, RuleChangeEventArgs } from '@syncfusion/ej2-react-querybuilder';
import { Query, DataManager, UrlAdaptor, Predicate } from '@syncfusion/ej2-data';
import { StockDetails } from '../data';
import {
  GridComponent,
  Page,
  Inject,
  CommandColumn,
  ColumnsDirective,
  ColumnDirective,
  QueryCellInfoEventArgs,
  CommandClickEventArgs
} from '@syncfusion/ej2-react-grids';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
export default function SmartStockPicks(props: { myStockDm: DataManager }) {
  const navigate = useNavigate();
  let qbObj = useRef(null);
  let gridObj = useRef(null);
  const [gridData, setGridData] = useState(
    new DataManager({
      // url: 'https://ej2services.syncfusion.com/aspnet/development/api/StockData',
      url: 'http://localhost:62869/api/StockData',
      adaptor: new UrlAdaptor(),
      // offline: true,
    })
  );
  const [gridQuery, setGridQuery] = useState(
    new Query().where('Last', 'greaterthan', 250)
  );
  const updateRule = (args: RuleChangeEventArgs) => {
    let predicate = (qbObj.current as any).getPredicate(args.rule);
    if (isNullOrUndefined(predicate)) {
      setGridQuery(new Query());
    } else {
      setGridQuery(new Query().where(predicate));
    }
  };
  const onGridCreated = () => {
    // updateRule({ rule: qbObj.current.getValidRules(qbObj.current.rule) });
  };
  let columnData = [
    {
      field: 'CompanyName',
      label: 'Company',
      type: 'string',
      operators: [
        { key: 'equal', value: 'equal' },
        { key: 'startswith', value: 'startswith' },
        { key: 'contains', value: 'contains' },
      ],
    },
    {
      field: 'Last',
      label: 'Last',
      type: 'number',
      operators: [
        { key: 'equal', value: 'equal' },
        { key: 'greaterthan', value: 'greaterthan' },
        { key: 'lessthan', value: 'lessthan' },
      ],
    },
    {
      field: 'High',
      label: 'High',
      type: 'number',
      operators: [
        { key: 'equal', value: 'equal' },
        { key: 'greaterthan', value: 'greaterthan' },
        { key: 'lessthan', value: 'lessthan' },
      ],
    },
    {
      field: 'ChangeInValue',
      label: 'Change In Value',
      type: 'number',
      operators: [
        { key: 'equal', value: 'equal' },
        { key: 'greaterthan', value: 'greaterthan' },
        { key: 'lessthan', value: 'lessthan' },
      ],
    },
    {
      field: 'Rating', label: 'Rating', type: 'string',
      operators: [
        { key: 'equal', value: 'equal' },
        { key: 'startswith', value: 'startswith' },
        { key: 'contains', value: 'contains' },
      ]
    },
  ];
  let importRules = {
    condition: 'or',
    rules: [
      {
        label: 'Last',
        field: 'Last',
        type: 'number',
        operator: 'greaterthan',
        value: 120,
      },
    ],
  };
  const queryCellInfo = (args: QueryCellInfoEventArgs) => {
    if (args.column!.field === 'Rating') {
      let iconEle = args.cell!.querySelector('.e-icons');
      if ((args.data as StockDetails).ChangeInValue > 5) {
        iconEle!.classList.add('e-chevron-up-double');
      } else if ((args.data as StockDetails).ChangeInValue > 0) {
        iconEle!.classList.add('e-chevron-up');
      } else if ((args.data as StockDetails).ChangeInValue > -5) {
        iconEle!.classList.add('e-chevron-down');
      } else {
        iconEle!.classList.add('e-chevron-down-double');
      }
    }
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

  function commandClick(args: CommandClickEventArgs) {
    if (args.target!.querySelector('.addmywishlist')) {
      let myWishList = [];
      let predicates: Predicate[] = [];
      if (window.localStorage.myStocks) {
        let persistQuery = JSON.parse(window.localStorage.myStocks);
        if (persistQuery.queries) {
          for (let i = 0; i < persistQuery.queries.length; i++) {
            if (persistQuery.queries[i].fn === 'onWhere') {
              for (
                let j = 0;
                j < persistQuery.queries[i].e.predicates.length;
                j++
              ) {
                myWishList.push(persistQuery.queries[i].e.predicates[j].value);
              }
            }
          }
        }
      }
      if (myWishList.indexOf((args.rowData as StockDetails).CompanyName) === -1) {
        myWishList.push((args.rowData as StockDetails).CompanyName);
      }
      for (let i = 0; i < myWishList.length; i++) {
        predicates.push(new Predicate('CompanyName', 'equal', myWishList[i]));
      }
      let query: Query = new Query().where(Predicate.or(predicates));
      (props.myStockDm as any).persistQuery = query;
      props.myStockDm.setPersistData({} as any, 'myStocks', query);
    }
    if (args.target!.querySelector('.analysis')) {
      navigate('/stock_analysis', {
        state: { code: (args.rowData as StockDetails).CompanyName },
      });
    }
  }

  return (
    <div className="control-pane">
      <div className="control-section qb-section">
        <div className="row">
          <div className="col-lg-12 control-section qb-section" id="qb-section">
            <QueryBuilderComponent
              width="100%"
              dataSource={[]}
              columns={columnData}
              rule={importRules}
              ruleChange={updateRule}
              ref={qbObj}
            ></QueryBuilderComponent>
          </div>
          <div className="col-lg-12 control-section qb-section">
            <div className="content-wrapper">
              <GridComponent
                allowPaging={true}
                dataSource={gridData}
                query={gridQuery}
                created={onGridCreated}
                queryCellInfo={queryCellInfo}
                commandClick={commandClick}
                pageSettings={{pageSize: 10}}
              >
                <ColumnsDirective>
                  <ColumnDirective
                    field="ID"
                    visible={false}
                    textAlign="Right"
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
                    textAlign="Right"
                    width="100"
                  ></ColumnDirective>
                  <ColumnDirective
                    field="Last"
                    format="N2"
                    textAlign="Right"
                    width="70"
                  ></ColumnDirective>
                  <ColumnDirective
                    field="ChangeInValue"
                    headerText="CHNG 1D"
                    format="N2"
                    textAlign="Right"
                    width="100"
                  ></ColumnDirective>
                  <ColumnDirective
                    field="ChangeInPercent"
                    headerText="CHNG(%) 1D"
                    format="P2"
                    textAlign="Center"
                    width="100"
                  ></ColumnDirective>
                  <ColumnDirective
                    field="Rating"
                    template={"<span class='e-icons'></span><span class='rating'> ${Rating} </span >"}
                    width="120"
                  ></ColumnDirective>
                  <ColumnDirective
                    field="High"
                    format="N2"
                    textAlign="Right"
                    width="70"
                  ></ColumnDirective>
                  <ColumnDirective
                    field="Low"
                    format="N2"
                    textAlign="Right"
                    width="70"
                  ></ColumnDirective>
                  <ColumnDirective
                    field="Volume"
                    textAlign="Right"
                    width="90"
                  ></ColumnDirective>
                  <ColumnDirective
                    headerText=""
                    commands={[
                      {
                        title: 'Add to Wishlist',
                        buttonOption: {
                          iconCss: 'addmywishlist e-icons',
                          cssClass: 'e-flat',
                        },
                      },
                      {
                        title: 'Analysis',
                        buttonOption: {
                          iconCss: 'analysis e-icons',
                          cssClass: 'e-flat',
                        },
                      },
                    ]}
                    width="120"
                  ></ColumnDirective>
                </ColumnsDirective>
                <Inject services={[Page, CommandColumn]} />
              </GridComponent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
