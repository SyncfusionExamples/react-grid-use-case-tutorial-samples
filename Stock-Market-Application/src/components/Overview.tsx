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
  CommandColumn,
  CommandClickEventArgs
} from '@syncfusion/ej2-react-grids';
import {
  MultiSelectComponent,
  MultiSelectChangeEventArgs,
  DropDownListComponent,
  ChangeEventArgs,
} from '@syncfusion/ej2-react-dropdowns';
import {
  SidebarComponent
} from '@syncfusion/ej2-react-navigations';
import { ListViewComponent, SelectEventArgs } from '@syncfusion/ej2-react-lists';
import { StockDetails, ListData } from '../data';
import { useNavigate } from 'react-router-dom';
export default function Overview(props: { changeMarquee: Function, myStockDm: DataManager }) {
  const navigate = useNavigate();
  const gridIns = useRef<GridComponent>(null);
  let sidebarobj = useRef<SidebarComponent>(null);
  let listviewObj = useRef<ListViewComponent>(null);
  let ddObj = useRef<MultiSelectComponent>(null);
  let sectorObj = useRef<DropDownListComponent>(null);
  const timeIntervalRef = useRef(null);
  const [allStocks, setAllStocks] = useState({ isDataReady: false, data: [] });
  const [ddQuery, setDdQuery] = useState(new Query());
  const [gridQuery, setGridQuery] = useState(new Query());
  let listFields = { id: 'id', text: 'text' };

  const timer = () => {
    if (gridIns.current) {
      dm.executeQuery(new Query().addParams("isRefresh", "true")).then((e: any) => {
        props.changeMarquee(e.result.slice(0, 10));
        setAllStocks({ isDataReady: true, data: e.result });
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

  const [dm, setDm] = useState(
    new DataManager({
      // url: 'https://ej2services.syncfusion.com/aspnet/development/api/StockData',
      url: 'http://localhost:62869/api/StockData',
      adaptor: new UrlAdaptor(),
    })
  );

  if (!allStocks.isDataReady) {
    dm.executeQuery(new Query()).then((e: any) => {
      props.changeMarquee(e.result.slice(0, 10));
      setAllStocks({ isDataReady: true, data: e.result });
    });
  }

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

  const OnSelect = (args: SelectEventArgs) => {
    if (listviewObj.current && listviewObj.current.element && listviewObj.current.element.offsetWidth) {
    let query;
    if (args.text === 'All Sectors') {
      query = new Query();
    } else {
      query = new Query().where('Sector', 'equal', args.text);
    }
    (sectorObj.current as any).value = args.text;
    (ddObj.current as any).value = '';
    setDdQuery(query);
    setGridQuery(query);
  }
  };
  const onSectorChange = (args: ChangeEventArgs) => {
    debugger;
    if (sectorObj.current && sectorObj.current.element && sectorObj.current.element.offsetWidth > 0) {
    let query;
    if (args.value === 'All Sectors') {
      query = new Query();
    } else {
      query = new Query().where('Sector', 'equal', args.value as string);
    }
    (ddObj.current as any).value = '';
    (document.getElementById('listSidebarList') as any).ej2_instances[0].selectItem(args.itemData);
    setDdQuery(query);
    setGridQuery(query);
  }
  };

  const onChange = (args: MultiSelectChangeEventArgs) => {
    if (args.value.length) {
      let predicates: Predicate[] = [];
      for (let i = 0; i < args.value.length; i++) {
        predicates.push(new Predicate('CompanyName', 'equal', args.value[i] as string));
      }
      let query: Query = new Query().where(Predicate.or(predicates));
      setGridQuery(query);
    } else {
      setGridQuery(new Query());
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

  const destroyed = () => {
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
    }
  }
  const actionComplete = (args: any) => {
    (document.getElementById('listSidebarList') as any).ej2_instances[0].selectItem({id: '1', text: 'All Sectors'});
    // listviewObj.current!.selectItem({id: '1', text: 'All Sectors'});
  }
  return (
    <div>
      <div className="listmaincontent">
        <div className="stock-content-area">
          <div className="dd-container">
            <span className='sector-container'>
          <DropDownListComponent
              id="sectors"
              ref={sectorObj}
              dataSource={ListData}
              value='All Sectors'
              fields={{ text: 'text', value: 'text' }}
              change={onSectorChange}
              placeholder="Select a Sector"
              width={170}
              popupHeight="220px"
            />
            </span>
          <MultiSelectComponent
          id="company"
          dataSource={dm}
          ref={ddObj}
          fields={{ text: 'CompanyName', value: 'CompanyName' }}
          query={ddQuery}
          change={onChange}
          placeholder="Select a company"
          width={250}
          popupHeight="220px"/>
          </div>
          {allStocks.isDataReady &&
            <GridComponent
              ref={gridIns}
              dataSource={allStocks.data}
              query={gridQuery}
              queryCellInfo={queryCellInfo}
              allowSorting={true}
              allowPaging={true}
              pageSettings={{ pageCount: 4, pageSize: 10 }}
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
                  width="90"
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
                  headerText="CHNG (%)"
                  format="P2"
                  textAlign="Center"
                  width="100"
                ></ColumnDirective>
                <ColumnDirective
                  field="Rating"
                  template="<span class='e-icons'></span><span class='rating'> ${Rating} </span >"
                  width="140"
                ></ColumnDirective>
                <ColumnDirective
                  field="High"
                  format="N2"
                  textAlign="Center"
                  width="90"
                ></ColumnDirective>
                <ColumnDirective
                  field="Low"
                  format="N2"
                  textAlign="Center"
                  width="90"
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
                  width="110"
                ></ColumnDirective>
              </ColumnsDirective>
              <Inject services={[Page, Sort, CommandColumn]} />
            </GridComponent>
          }
        </div>
      </div>
      <SidebarComponent
        id="listSidebar"
        ref={sidebarobj}
        className="sidebar-list"
        width="250px"
        target=".listmaincontent"
        type="Auto"
        isOpen={true}
      >
        <ListViewComponent
          id="listSidebarList"
          ref={listviewObj}
          dataSource={ListData}
          cssClass="e-template-list"
          fields={listFields}
          select={OnSelect}
          actionComplete={actionComplete}
        ></ListViewComponent>
      </SidebarComponent>
    </div>
  );
}
