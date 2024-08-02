import * as React from 'react';
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from 'react-router-dom';
import { DropDownButtonComponent, ItemModel } from '@syncfusion/ej2-react-splitbuttons';
import {
  DataManager,
  UrlAdaptor, Query, Predicate
} from '@syncfusion/ej2-data';
import Overview from './components/Overview';
import MyPortfolio from './components/MyPortfolio';
import StockAnalysis from './components/StockAnalysis';
import ClimbersFallers from './components/ClimbersFallers';
import SmartStockPicks from './components/SmartStockPicks';
import News from './components/News';
import KnowMore from './components/KnowMore';
import { StockDetails, marqueeData } from './data';
import './style.css';

const dm = new DataManager({
  // url: 'https://ej2services.syncfusion.com/aspnet/development/api/StockData',
  url: 'http://localhost:62869/api/StockData',
  adaptor: new UrlAdaptor(),
  enablePersistence: true,
  id: 'myStocks',
});

  export default function App() {
  const [marquee, setMarquee] = useState(marqueeData);
  const changeMarquee = (data: StockDetails[]) => {
    setMarquee(data);
  };

  let items: ItemModel[] = [
              { text: 'Overview' },
              { text: 'My Portfolio' },
              { text: 'Smart Stock Picks' },
              { text: 'Stock Analysis' },
              { text: 'Climbers/Fallers' },
              { text: 'Trending News' },
              { text: 'Know More' }
  ];
  const handleSelect = (args: any) => {
    const item: any = items.find(i => i.text === args.item.text);
    if (item) {
      window.location.href = item.url;
    }
  };
  
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <div className="marquee-container">
        <div className="marquee">
          {marquee.map((item, index) => (
            <span
              className={
                item.ChangeInValue > 0 ? 'company posvalue' : 'company negvalue'
              }
              key={index}
            >
              {item.CompanyName}
              <span className="value">{item.ChangeInValue.toFixed(2)}</span>
              <span
                className={
                  item.ChangeInValue > 0 ? 'e-icons pos' : 'e-icons neg'
                }
              ></span>
            </span>
          ))}
        </div>
      </div>

      <Router>
        <div className="">
          <div className="">
            <div className="">
              <nav className="nav">
                <NavLink to="/" className="nav-link">
                  Overview
                </NavLink>
                <NavLink to="/my_portfolio" className="nav-link">
                  My Portfolio
                </NavLink>
                <NavLink to="/smart_stock_picks" className="nav-link">
                  Smart Stock Picks
                </NavLink>
                <NavLink to="/stock_analysis" className="nav-link">
                  Stock Analysis
                </NavLink>
                <NavLink to="/climbers_fallers" className="nav-link">
                  Climbers/Fallers
                </NavLink>
                <NavLink to="/trending_news" className="nav-link">
                  Trending News
                </NavLink>
                <NavLink to="/know_more" className="nav-link">
                Know More
                </NavLink>
                <div className="menu-container">
        <button className="menu-button" onClick={toggleMenu}>
        <div className="e-icons e-menu"></div>
        </button>
        <div className={`menu-popup ${isOpen ? 'open' : 'closed'}`}>
                <NavLink to="/" className="nav-link menu-item"
            onClick={() => setIsOpen(false)}>
                  Overview
                </NavLink>
                <NavLink to="/my_portfolio" className="nav-link menu-item"
            onClick={() => setIsOpen(false)}>
                  My Portfolio
                </NavLink>
                <NavLink to="/smart_stock_picks" className="nav-link menu-item"
            onClick={() => setIsOpen(false)}>
                  Smart Stock Picks
                </NavLink>
                <NavLink to="/stock_analysis" className="nav-link menu-item"
            onClick={() => setIsOpen(false)}>
                  Stock Analysis
                </NavLink>
                <NavLink to="/climbers_fallers" className="nav-link menu-item"
            onClick={() => setIsOpen(false)}>
                  Climbers/Fallers
                </NavLink>
                <NavLink to="/trending_news" className="nav-link menu-item"
            onClick={() => setIsOpen(false)}>
                  Trending News
                </NavLink>
                <NavLink to="/know_more" className="nav-link menu-item"
            onClick={() => setIsOpen(false)}>
                Know More
                </NavLink>
        </div>
      </div>
              </nav>
            </div>
            <div className="main-content">
              <Routes>
                <Route
                  path="/"
                  element={<Overview changeMarquee={changeMarquee} myStockDm={dm} />}
                />
                <Route path="/my_portfolio" element={<MyPortfolio changeMarquee={changeMarquee} myStockDm={dm} />} />
                <Route path="/stock_analysis" element={<StockAnalysis />} />
                <Route path="/climbers_fallers" element={<ClimbersFallers />} />
                <Route path="/smart_stock_picks" element={<SmartStockPicks myStockDm={dm} />} />
                <Route path="/trending_news" element={<News />} />
                <Route path="/know_more" element={<KnowMore />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
}
