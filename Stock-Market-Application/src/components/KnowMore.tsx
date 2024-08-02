import * as React from 'react';
import { useEffect } from 'react';
import { CarouselComponent, CarouselItemsDirective, CarouselItemDirective } from '@syncfusion/ej2-react-navigations';


export default function KnowMore() {
  let productDetails = [
      {
          ID: 1,
          Title: 'Trend Line',
          Content: 'A trendline in the stock market is a graphical representation showing the general direction of a stock price movement over time. By connecting significant price points, such as highs or lows, trendlines help identify patterns and trends. They are used by traders and analysts to forecast future price movements and make informed investment decisions. Trendlines can indicate whether a stock is in an upward, downward, or sideways trend.',
          ImgPath: 'images/1.jpg',
        //   URL: 'https://en.wikipedia.org/wiki/San_Francisco'
      }, {
          ID: 2,
          Title: 'Trend Line',
          Content: 'A trendline in the stock market is a graphical representation showing the general direction of a stock price movement over time. By connecting significant price points, such as highs or lows, trendlines help identify patterns and trends. They are used by traders and analysts to forecast future price movements and make informed investment decisions. Trendlines can indicate whether a stock is in an upward, downward, or sideways trend.',
          ImgPath: 'images/2.jpg',
        //   URL: 'https://en.wikipedia.org/wiki/London'
      }, {
          ID: 3,
          Title: 'Trend Line',
          Content: 'A trendline in the stock market is a graphical representation showing the general direction of a stock price movement over time. By connecting significant price points, such as highs or lows, trendlines help identify patterns and trends. They are used by traders and analysts to forecast future price movements and make informed investment decisions. Trendlines can indicate whether a stock is in an upward, downward, or sideways trend.',
          ImgPath: 'images/3.jpg',
        //   URL: 'https://en.wikipedia.org/wiki/Tokyo'
      }, {
          ID: 4,
          Title: 'Trend Line',
          Content: 'A trendline in the stock market is a graphical representation showing the general direction of a stock price movement over time. By connecting significant price points, such as highs or lows, trendlines help identify patterns and trends. They are used by traders and analysts to forecast future price movements and make informed investment decisions. Trendlines can indicate whether a stock is in an upward, downward, or sideways trend.',
          ImgPath: 'images/4.jpg',
        //   URL: 'https://en.wikipedia.org/wiki/Moscow'
      }
  ];
  let showButtons: any = "Hidden";
  const productTemplate = (props: any) => {
      return (<div className="card">
              <img src={props.ImgPath} alt={props.Title} className="card-img-top" style={{ height: "370px", width: "100%" }}/>
              <div className="card-body" style={{ padding: "1rem" }}>
                  <h1 className="card-title">{props.Title}</h1>
                  <p className="card-text">{props.Content}</p>
              </div>
          </div>);
  };
  return (<div className='control-pane'>
          <div className='control-section db-carousel-section'>
              <div className='control carousel-sample'>
                  {/* Render the Carousel Component */}
                  <CarouselComponent cssClass="db-carousel" animationEffect="Fade" dataSource={productDetails} buttonsVisibility={showButtons} itemTemplate={productTemplate}></CarouselComponent>
              </div>
          </div>
      </div>);
};