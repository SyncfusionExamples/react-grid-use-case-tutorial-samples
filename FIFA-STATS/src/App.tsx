import React from 'react';
import { useRef } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Sort, Inject, RowInfo, Column, QueryCellInfoEventArgs } from '@syncfusion/ej2-react-grids';
import { fifaData, webpfiles, countryInfo, teamInfo, coachInfo, topScrorerInfo, bestPlayerInfo, FifaDetails } from './dataSource';
import { TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import './App.css';

function ImageTemplate(props: any) {
  let value: string = '';
  const field: string = props.rowDetails.column.field;
  switch (field) {
    case 'Host':
      value = props.rowDetails['Host'];
      break;
    case 'Champions':
    case 'Coach':
      value = props.rowDetails['Champions'];
      break;
    case 'TopScorer':
      value = props.rowDetails['TopScorerCountry'];
      break;
    case 'BestPlayerAward':
      value = props.rowDetails['BestPlayerCountry'];
      break;
  }

  let className: string = (field === 'Coach' || field === 'TopScorer' || field === 'BestPlayerAward') ? 'infotooltip' : ''
  const src: string = "/images/country/" + (webpfiles.indexOf(value) > -1 ? value + '.webp' : value + '.png');

  return (
    <img
      alt=""
      src={src}
      decoding="async"
      title={value}
      width="23"
      height="15"
      className={className}
      data-file-width="945"
      data-file-height="630"
    />
  )
}


function App() {
  let fifaGridIns = useRef<GridComponent>(null);
  let tooltipObj = useRef<TooltipComponent>(null);
  let isverticalPopup: boolean;

  const ColTemplate = (args: any) => {
    let host: string[] = args[args.column.field].split(',');
    const newRowData: Object[] = [];
    host.forEach((item) => {
      const obj: any = Object.assign({}, args);
      obj[args.column.field] = item;
      newRowData.push(obj);
    });

    return (
      <div>
        {host.map((item, index) => (
          <div key={index}>
            {args.column.field !== 'Host' && <span>
              <ImageTemplate rowDetails={newRowData[index]} />
            </span>
            }
            {' '}
            <a className='infotooltip' title={item} href="https://ej2.syncfusion.com/" onClick={(e) => e.preventDefault()}>
              {item}
            </a>
          </div>
        ))
        }
      </div>);
  };

  const topScoreTemplate = (args: any) => {
    let players: string[] = args[args.column.field].split(',');
    let country: string[] = args['TopScorerCountry'].split(',');
    const newRowData: Object[] = [];
    players.forEach((item, index) => {
      const obj: { TopScorer: string; TopScorerCountry: string } = Object.assign({}, args);
      obj['TopScorer'] = item;
      obj['TopScorerCountry'] = country[index];
      newRowData.push(obj);
    });
    const renderScoreIcons = () => {
      const listItems = [];
      for (let i = 0; i < args['TotalGoal']; i++) {
        listItems.push(<img
          key={i}
          className='football'
          alt=""
          src="/images/Football.png"
        />);
      }
      return listItems;
    };

    return (
      <div>
        {players.map((item, index) => (
          <div key={index}>
            <span>
              {!(
                args.column.field === 'TopScorer' &&
                item.indexOf('Players') > -1
              ) && (
                  <ImageTemplate rowDetails={newRowData[index]} />
                )}{' '}
            </span>
            {args.column.field === 'TopScorer' &&
              (item.indexOf('Players') > -1 ) ? (
              <span>{item}</span>
            ) : (
              <a className='infotooltip top-scorer' title={item} href="https://ej2.syncfusion.com/" onClick={(e) => e.preventDefault()}>
                {item}
              </a>
            )}
            {args.column.field === 'TopScorer' && (
              <span> ({args['TotalGoal']}) </span>
            )}
          </div>
        ))}
        {renderScoreIcons()}
      </div>
    );
  };

  const awardTemplate = (args: any) => {
    return (
      <span>
        <span>
          {!(
            args.column.field === 'BestPlayerAward' &&
            args[args.column.field] === 'Not awarded'
          ) && (
              <span>
                <span>
                  <ImageTemplate rowDetails={args} />
                </span>
              </span>
            )}{' '}
        </span>
        {args.column.field === 'BestPlayerAward' &&
          (args[args.column.field] === 'Not awarded' || args[args.column.field] === 'Mario Kempes' ||
            args[args.column.field] === 'Paolo Rossi' || args[args.column.field] === 'Salvatore Schillaci') ? (
          <span> {args[args.column.field]}</span>
        ) : (
          <a className='infotooltip' href="https://ej2.syncfusion.com/" onClick={(e) => e.preventDefault()}>
            {args[args.column.field]}
          </a>
        )}
      </span>
    );
  };

  const beforeRender = (args: any) => {
    let rowInfo: RowInfo = fifaGridIns.current?.getRowInfo(args.target.closest('td') as HTMLElement) as RowInfo;
    const field: string = (rowInfo.column as Column).field;
    let value: string = (rowInfo.rowData as any)[field];
    let imageSource: string = '';
    let cellInfo: string = '';
    let hideImage: boolean = false;
    if (value) {
      switch (field) {
        case 'Host':
          value = args.target.title;
          imageSource = "/images/country/" + (webpfiles.indexOf(value) > -1 ? value + '.webp' : value + '.png');
          cellInfo = (countryInfo as any)[0][value.replace(/ /g, "_")];
          break;
        case 'Champions':
          imageSource = "/images/team/" + value + '.png';
          cellInfo = (teamInfo as any)[0][value.replace(/ /g, "_")];
          break;
        case 'Coach':
          if (args.target.tagName === 'IMG') {
            value = (rowInfo.rowData as any)['Champions'];
            imageSource = "/images/country/" + (webpfiles.indexOf(value) > -1 ? value + '.webp' : value + '.png');
            cellInfo = (countryInfo as any)[0][value.replace(/ /g, "_")];
          } else {
            if (value === "Juan López") {
              hideImage = true;
            }
            imageSource = "/images/coach/" + value + (value === 'Aymoré Moreira' ? '.png' : '.jpg');
            cellInfo = (coachInfo as any)[0][value.replace(/ /g, "_")];
          }
          break;
        case 'TopScorer':
          value = args.target.title;
          if (args.target.tagName === 'IMG') {
            if (value === "Croatia") {
              hideImage = true;
            }
            imageSource = "/images/team/" + value + '.png';
            cellInfo = (teamInfo as any)[0][value.replace(/ /g, "_")];
          } else {
            imageSource = "/images/top_scorer/" + value + '.jpg';
            cellInfo = (topScrorerInfo as any)[0][value.replace(/ /g, "_")];
          }
          break;
        case 'BestPlayerAward':
          if (args.target.tagName === 'IMG') {
            value = (rowInfo.rowData as any)['BestPlayerCountry'];
            if (value === "Croatia") {
              hideImage = true;
            }
            imageSource = "/images/team/" + value + '.png';
            cellInfo = (teamInfo as any)[0][value.replace(/ /g, "_")];
          } else {
            imageSource = "/images/best_player/" + value + '.jpg';
            cellInfo = (bestPlayerInfo as any)[0][value.replace(/ /g, "_")];
          }
          break;
      }

      if ((args.target.tagName === 'IMG' && field === 'Coach') || field === 'Host') {
        isverticalPopup = true;
        (tooltipObj.current as any).content = `
          <div id="democontent" className="democontent">
            <div style="border-bottom: 1px solid #e0e0e0; ">
              <img
                alt=""
                src="${imageSource}"
                decoding="async"
                width="275"
                height="175"
                class="mw-file-element"
                data-file-width="945"
                data-file-height="630"
              />
            </div>
              <div style="padding: 12px">
                ${cellInfo}
              </div>
          </div>`;
      }
      else {
        isverticalPopup = false;
        const display = hideImage ? 'none' : 'inline';
        (tooltipObj.current as any).content = `
          <div id="democontent" className="democontent" style="display: inline;">
            <div style="display: ${display}; float: right; border-left: 1px solid #e0e0e0; margin: 0 0 0 12px;">
              <img
                alt=""
                src="${imageSource}"
                decoding="async"
                width="190"
                height="230"
               class="mw-file-element"
               data-file-width="945"
               data-file-height="630"
             />
            </div>
            <div style="padding: 12px 0 12px 12px">
              ${cellInfo}
            </div>
         </div>`;
      }
    }
  };

  function beforeOpen(args: TooltipEventArgs) {
    args.element.style.maxWidth = isverticalPopup ? '275px' : '425px';
    args.element.style.width = isverticalPopup ? '275px' : '425px';
  }

  function queryCellInfo(args: QueryCellInfoEventArgs) {
    if (args.column?.field === 'BestPlayerAward') {
      let rowIndex: number = parseInt(args.cell?.getAttribute('index') as string);
      let rowspan: number = 1;
      if (rowIndex > 0) {
        if ((fifaGridIns.current?.currentViewData[rowIndex - 1] as FifaDetails)[args.column.field] === (args.data as FifaDetails)[args.column.field]) {
          (args.cell as HTMLElement).style.display = 'none';
        } else {
          rowspan = calculateRowspan(args, rowIndex);
          (args.cell as HTMLTableCellElement).rowSpan = rowspan;
        }
      } else {
        rowspan = calculateRowspan(args, rowIndex);
        (args.cell as HTMLTableCellElement).rowSpan = rowspan;
      }
    }
  }

  function calculateRowspan(args: QueryCellInfoEventArgs, rowIndex: number) {
    let rowspan = 1;
    for (let i: number = rowIndex + 1, j = 0; i < (fifaGridIns.current?.currentViewData.length as number); i++, j++) {
      if (!((args.data as any)[args.column?.field as string] === (fifaGridIns.current?.currentViewData[i] as any)[args.column?.field as string])) {
        rowspan = j + 1;
        break;
      }
      if (i === (fifaGridIns.current?.currentViewData.length as number) - 1) {
        rowspan = j + 2;
        break;
      }
    }
    return rowspan; // return the row span count
  }

  return (
    <div>
      <TooltipComponent
        id="content"
        cssClass="e-tooltip-template-css"
        target=".infotooltip"
        beforeRender={beforeRender}
        beforeOpen={beforeOpen}
        ref={tooltipObj}
        width={275}
      >
        <GridComponent ref={fifaGridIns}
          id="fifa_grid"
          dataSource={fifaData}
          gridLines="Both"
          enableStickyHeader={true}
          allowSorting={true}
          allowTextWrap={true}
          enableAltRow={true}
          enableHover={false}
          allowSelection={false}
          queryCellInfo={queryCellInfo}>
          <ColumnsDirective>
            <ColumnDirective
              field="Year"
              headerText="Year"
              width="100"
              headerTextAlign="Center"
              textAlign='Right'
            ></ColumnDirective>
            <ColumnDirective
              field="Host"
              headerText="Organizer"
              template={ColTemplate}
              headerTextAlign="Center"
              width="140"
            ></ColumnDirective>
            <ColumnDirective
              field="Champions"
              headerText="Champions"
              template={ColTemplate}
              headerTextAlign="Center"
              width="140"
            />
            <ColumnDirective
              field="Coach"
              headerText="Winning Coach"
              template={ColTemplate}
              headerTextAlign="Center"
              width="185"
            />
            <ColumnDirective
              field="TopScorer"
              headerText="Most Scorer(s)"
              template={topScoreTemplate}
              headerTextAlign="Center"
              width="200"
            ></ColumnDirective>
            <ColumnDirective
              field="BestPlayerAward"
              headerText="Player of season Award"
              template={awardTemplate}
              headerTextAlign="Center"
              width="180"
            ></ColumnDirective>
          </ColumnsDirective>
          <Inject services={[Sort]} />
        </GridComponent>
      </TooltipComponent>
    </div>
  );
}

export default App;
