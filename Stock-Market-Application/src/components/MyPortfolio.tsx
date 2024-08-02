import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  DataManager,
  UrlAdaptor,
  Query,
  Predicate,
} from '@syncfusion/ej2-data';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Page,
  Sort,
  QueryCellInfoEventArgs,
  ContextMenu,
  CommandColumn, CommandClickEventArgs
} from '@syncfusion/ej2-react-grids';
import { StockDetails } from '../data';
import { useNavigate } from 'react-router-dom';

export default function MyPortfolio(props: { changeMarquee: Function, myStockDm: DataManager }) {
  const navigate = useNavigate();
  const myWishListGridIns = useRef<GridComponent>(null);
  const [stockData, setStockData] = useState({ isDataReady: false, data: [] });
  if (!stockData.isDataReady) {
    let query = new Query();
    if (props.myStockDm && (props.myStockDm as any).persistQuery && (props.myStockDm as any).persistQuery.queries && (props.myStockDm as any).persistQuery.queries.length) {
      query.where((props.myStockDm as any).persistQuery.queries[0].e);

    }
    query.params = [];
    props.myStockDm.executeQuery(query.addParams("isRefresh", "true")).then((e: any) => {
      setStockData({ isDataReady: true, data: e.result });
    });
  }
  const timeIntervalRef = useRef(null);

  const timer = () => {
    if (myWishListGridIns) {
      let query = new Query();
      if (props.myStockDm && (props.myStockDm as any).persistQuery && (props.myStockDm as any).persistQuery.queries && (props.myStockDm as any).persistQuery.queries.length) {
        query.where((props.myStockDm as any).persistQuery.queries[0].e);
  
      }
      query.params = [];
      props.myStockDm.executeQuery(query.addParams("isRefresh", "true")).then((e: any) => {
        props.changeMarquee(e.result.slice(0, 10));
        setStockData({ isDataReady: true, data: e.result });
      });
    }
  }

  useEffect(() => {
    timeIntervalRef.current = setInterval(timer, 1500) as any;
    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, []);

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
    if (args.target!.querySelector('.removemywishlist')) {
      let myWishList = [];
      let predicates: Predicate[] = [];
      if (window.localStorage.myStock) {
        let persistQuery = JSON.parse(window.localStorage.myStocks);
        if (persistQuery.queries) {
          for (let i = 0; i < persistQuery.queries.length; i++) {
            if (persistQuery.queries[i].fn === 'onWhere') {
              for (
                let j = 0;
                j < persistQuery.queries[i].e.predicates.length;
                j++
              ) {
                if (
                  persistQuery.queries[i].e.predicates[j].value !==
                  (args.rowData as StockDetails).CompanyName
                ) {
                  myWishList.push(
                    persistQuery.queries[i].e.predicates[j].value
                  );
                }
              }
            }
          }
        }
      }
      if (myWishList.length) {
      for (let i = 0; i < myWishList.length; i++) {
        predicates.push(new Predicate('CompanyName', 'equal', myWishList[i]));
      }
      let query: Query = new Query().where(Predicate.or(predicates));
      props.myStockDm.executeQuery(query).then((e: any) => {
        (props.myStockDm as any).persistQuery = query;
        props.myStockDm.setPersistData({} as any, 'myStocks', query);
        setStockData({ isDataReady: true, data: e.result });
      });
    }
    }
    if (args.target!.querySelector('.analysis')) {
      navigate('/stock_analysis', {
        state: { code: (args.rowData as StockDetails).CompanyName },
      });
    }
  }

  const destroyed = () => {
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
    }
  }

  return (
    <div>
      <div className="listmaincontent">
        <div className="stock-content-area">
          {stockData.isDataReady && (
            <GridComponent
              ref={myWishListGridIns}
              dataSource={stockData.data}
              queryCellInfo={queryCellInfo}
              allowSorting={true}
              allowPaging={true}
              pageSettings={{ pageCount: 4, pageSize: 9 }}
              enableHover={false}
              commandClick={commandClick}
              destroyed={destroyed}
            >
              <ColumnsDirective>
                <ColumnDirective
                  field="ID"
                  visible={false}
                  textAlign="Center"
                  isPrimaryKey={true}
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
                  width="140"
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
                  textAlign="Center"
                  width="90"
                ></ColumnDirective>
                <ColumnDirective
                  headerText=""
                  commands={[
                    {
                      title: 'Remove from Wishlist',
                      buttonOption: {
                        iconCss: 'removemywishlist e-icons',
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
              <Inject services={[Page, Sort, ContextMenu, CommandColumn]} />
            </GridComponent>
          )}
        </div>
      </div>
    </div>
  );
}
