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
      ContentTitle: 'Understanding the Stock Market',
      Content: 'The stock market is a platform where investors buy and sell shares of publicly traded companies. It plays a crucial role in the economy, allowing businesses to raise capital and investors to grow their wealth. Learning the fundamentals of stock trading can help you make informed financial decisions. Market movements are influenced by various factors, making it essential to stay updated. A strong foundation in market principles helps in minimizing risks and maximizing returns.',
      ImgPath: img1,
    },
    {
      ID: 2,
      ContentTitle: 'The Mechanics of Buying and Selling Stocks',
      Content: 'Stock trading involves placing buy and sell orders through brokers or trading platforms. Prices fluctuate based on supply and demand, economic factors, and company performance. Investors can engage in different strategies such as day trading, swing trading, or long-term investing to maximize their returns. Understanding technical analysis and market trends can improve decision-making. Proper risk management is crucial to avoid significant losses.',
      ImgPath: img2,
    },
    {
      ID: 3,
      ContentTitle: 'What Influences Stock Prices?',
      Content: 'Several factors impact stock prices, including economic indicators, company earnings, global events, and investor sentiment. Market trends, interest rates, and inflation also play significant roles. Keeping an eye on these factors helps investors make strategic investment choices. Unexpected news events or geopolitical tensions can cause sudden market shifts. Being adaptable and informed helps investors respond effectively to changes.',
      ImgPath: img3,
    },
    {
      ID: 4,
      ContentTitle: 'Smart Strategies for Stock Market Success',
      Content: 'To succeed in the stock market, its essential to diversify your portfolio, conduct thorough research, and have a long-term investment perspective. Avoid emotional decision-making and always assess risk before investing. Continuous learning and staying updated with market trends will help you navigate the complexities of stock trading effectively. Setting realistic financial goals and maintaining discipline are key to long-term success. Investing with patience and consistency often leads to better results over time.',
      ImgPath: img4,
    }
  ];
  const productTemplate = (props: any) => {
    return (
      <div className="product-container">
        <div className="col-sm-5 component-container">
          <div className="heading">{props.ContentTitle || 'Product Information'}</div>
          <div className="description">{props.Content}</div>
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