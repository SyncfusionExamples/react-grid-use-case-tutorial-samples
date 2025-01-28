import * as React from 'react';
import { CarouselComponent, CarouselItemsDirective, CarouselItemDirective } from '@syncfusion/ej2-react-navigations';
import * as img1 from '../images/1.png';
import * as img2 from '../images/2.png';
import * as img3 from '../images/3.png';
import * as img4 from '../images/4.png';

export default function KnowMore() {
  const productDetails = [
    {
      ID: 1,
      Content: 'The Syncfusion DataGrid component enables the real-time display of data updates, highlighting changes in values—whether they have increased, decreased, or remained stable compared to previous data. This allows you to easily compare live data changes without any performance impact. The Syncfusion DataGrid is a robust tool for managing data display and processing from your data source. It comes with numerous built-in features and offers extensive customization options to suit your needs.',
      DocLink: 'https://ej2.syncfusion.com/react/documentation/grid/getting-started',
      DemoLink: 'https://ej2.syncfusion.com/react/demos/#/fluent2/grid/overview',
      ImgPath: img1,
    },
    {
      ID: 2,
      Content: 'The Syncfusion DataGrid component efficiently displays real-time data updates and processes data without any performance loss. Additionally, the Syncfusion Chart component is perfect for applying technical analysis using trading formulas such as RSI, EMA, ATR, SMA, TMA, MACD, Bollinger Bands, Stochastic, Accumulation Distribution, and more. The Syncfusion Chart component offers a wide range of features that allow you to visually compare your data, helping you identify both growth opportunities and challenges in your business.',
      DocLink: 'https://ej2.syncfusion.com/react/documentation/chart/getting-started',
      DemoLink: 'https://ej2.syncfusion.com/react/demos/#/fluent2/chart/overview',
      ImgPath: img2,
    },
    {
      ID: 3,
      Content: 'Syncfusion offers a wide range of tools to simplify app development. These include data visualization (charts, maps), data management (grids, spreadsheets), and file handling (PDFs, Excel). You can also find input controls, reporting tools, and various UI components like menus, calendars, and notifications. The tools are customizable, work across multiple platforms, and help you build feature-rich, high-performance applications efficiently.',
      DocLink: 'https://ej2.syncfusion.com/react/documentation/introduction',
      DemoLink: 'https://ej2.syncfusion.com/',
      ImgPath: img3,
    },
    {
      ID: 4,
      Content: 'Syncfusion offers a wide range of tools to simplify app development. These include data visualization (charts, maps), data management (grids, spreadsheets), and file handling (PDFs, Excel). You can also find input controls, reporting tools, and various UI components like menus, calendars, and notifications. The tools are customizable, work across multiple platforms, and help you build feature-rich, high-performance applications efficiently.',
      DocLink: 'https://ej2.syncfusion.com/react/documentation/introduction',
      DemoLink: 'https://ej2.syncfusion.com/',
      ImgPath: img4,
    }
  ];
  const productTemplate = (props: any) => {
    return (
      <div className="product-container">
        <div className="col-sm-5 component-container">
          <div className="heading">{props.ContentTitle || 'Product Information'}</div>
          <div className="description">{props.Content}</div>
          <p className="card-text">For more information, please refer to the {' '}
          <a href={props.DocLink} target="_blank" rel="noopener noreferrer">
            documentation
          </a> and {' '}
          <a href={props.DemoLink} target="_blank" rel="noopener noreferrer">
            demo
          </a>.
          </p>
        </div>
        <div className="col-sm-5 image-container">
          <picture>
            <img width="100%" height="100%" src={props.ImgPath} alt="Product" />
          </picture>
        </div>
      </div>
    );
  }

  return (
    <div className='control-pane'>
      <div className='control-section kb-carousel-section'>
        <div className='control carousel-sample'>
          <CarouselComponent id='carousel' buttonsVisibility='Hidden' autoPlay={true} cssClass="kb-carousel">
            <CarouselItemsDirective>
              {productDetails.map(item => (
                <CarouselItemDirective key={item.ID} template={() => productTemplate(item)} />
              ))}
            </CarouselItemsDirective>
          </CarouselComponent>
        </div>
      </div>
    </div>
  );
}