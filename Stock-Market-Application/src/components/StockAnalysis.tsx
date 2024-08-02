import * as React from 'react';
import { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { DataManager, UrlAdaptor, Query } from '@syncfusion/ej2-data';
import {
  DropDownListComponent,
  ChangeEventArgs,
} from '@syncfusion/ej2-react-dropdowns';
import { StockChartComponent, StockChartSeriesCollectionDirective, StockChartSeriesDirective, Inject, DateTime, Tooltip, RangeTooltip, Crosshair, LineSeries, SplineSeries, CandleSeries, HiloOpenCloseSeries, HiloSeries, RangeAreaSeries, Trendlines, DateTimeCategory, PeriodsModel } from '@syncfusion/ej2-react-charts';
import { EmaIndicator, RsiIndicator, BollingerBands, TmaIndicator, MomentumIndicator, SmaIndicator, AtrIndicator, AccumulationDistributionIndicator, MacdIndicator, StochasticIndicator, Export } from '@syncfusion/ej2-react-charts';


export default function StockAnalysis() {
  const location = useLocation();
  let chartObj = useRef<StockChartComponent>(null);
  const company = location.state?.code
    ? location.state?.code
    : 'Techz Innovators Inc';
  const [chartData, setChartData] = useState({ isDataReady: false, data: [], CompanyName: '' });
  const [dm, setDm] = useState(
    new DataManager({
      // url: 'https://ej2services.syncfusion.com/aspnet/development/api/StockData',
      url: 'http://localhost:62869/api/StockData',
      adaptor: new UrlAdaptor(),
    })
  );
  if (!chartData.isDataReady) {
    dm.executeQuery(
      new Query().where('CompanyName', 'equal', company)
    ).then((e: any) => {
      setChartData({ isDataReady: true, data: e.result[0].StockReports, CompanyName: company });
    });
  }

  const onChange = (args: ChangeEventArgs) => {
    if (args.value) {
      dm.executeQuery(
        new Query().where('CompanyName', 'equal', args.value as string)
      ).then((e: any) => {
        setChartData({ isDataReady: true, data: e.result[0].StockReports, CompanyName: args.value as string });
      });
    }
  };
  return (
    <div className="">
      <div>
      <div className='companydd-container'>
      <DropDownListComponent
        id="company"
        // ref={ddObj}
        dataSource={dm}
        value={company}
        fields={{ text: 'CompanyName', value: 'CompanyName' }}
        change={onChange}
        placeholder="Select a company"
        width={250}
        popupHeight="220px"
      />
      </div>
      </div>
      {chartData.isDataReady && (
        <div className="chart-container">
          <div className='chartHeader'>{chartData.CompanyName}</div>
          <StockChartComponent ref={chartObj} id='stockchartdefault' primaryXAxis={{ valueType: 'DateTimeCategory', majorGridLines: { width: 0 }, majorTickLines: { color: 'transparent' }, crosshairTooltip: { enable: true } }} primaryYAxis={{ labelFormat: 'n0', lineStyle: { width: 0 }, rangePadding: 'None', majorTickLines: { height: 0 } }} chartArea={{ border: { width: 0 } }} tooltip={{ enable: true, shared: true }} crosshair={{ enable: true }}>
                    <Inject services={[DateTime, DateTimeCategory, Tooltip, RangeTooltip, Crosshair, LineSeries, SplineSeries, CandleSeries, HiloOpenCloseSeries, HiloSeries, RangeAreaSeries, Trendlines, EmaIndicator, RsiIndicator, BollingerBands, TmaIndicator, MomentumIndicator, SmaIndicator, AtrIndicator, Export, AccumulationDistributionIndicator, MacdIndicator, StochasticIndicator]}/>
                    <StockChartSeriesCollectionDirective>
                        <StockChartSeriesDirective dataSource={chartData.data} xName='period' type='Candle' animation={{ enable: true }}/>
                    </StockChartSeriesCollectionDirective>
                </StockChartComponent>
        </div>
      )}
    </div>
  );
}
