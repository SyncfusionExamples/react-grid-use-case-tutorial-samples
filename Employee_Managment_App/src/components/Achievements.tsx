// src/components/Achievements.tsx
import React from 'react';
import './Achievements.css';

const Achievements: React.FC = () => {
  return (
    <div className="achievements-container">
      {/* Top bar (purely visual) */}
      <div className="achievements-toolbar">
        <div className="toolbar-left">
          <div className="toolbar-title">Leaderboard</div>
          <div className="toolbar-sub">You can view only your team employees in leaderboard.</div>
        </div>

        <div className="toolbar-right">
          <label className="toolbar-field">
            <span className="field-label">Role</span>
            <select className="field-input" defaultValue="Developer">
              <option>Developer</option>
              <option>QA</option>
              <option>Designer</option>
              <option>Manager</option>
            </select>
          </label>

          <label className="toolbar-field">
            <span className="field-label">Month</span>
            <select className="field-input" defaultValue="All">
              <option>All</option>
              <option>Jan</option>
              <option>Feb</option>
              <option>Mar</option>
              <option>Apr</option>
              <option>May</option>
              <option>Jun</option>
              <option>Jul</option>
              <option>Aug</option>
              <option>Sep</option>
              <option>Oct</option>
              <option>Nov</option>
              <option>Dec</option>
            </select>
          </label>

          <label className="toolbar-field">
            <span className="field-label">Year</span>
            <select className="field-input" defaultValue="2025">
              <option>2023</option>
              <option>2024</option>
              <option>2025</option>
              <option>2026</option>
            </select>
          </label>
        </div>
      </div>

      <div className="celebrate-banner">Congratulations to everyone!</div>

      {/* Cards row */}
      <div className="cards-grid">
        {/* Overall */}
        <div className="lb-card">
          <div className="lb-card-header bg-red">
            <div className="lb-card-icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm10 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM12 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm-7 8v-1a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1H5zm10 0v-1a5 5 0 0 1 5-5h.5a1.5 1.5 0 0 1 1.5 1.5V17H15z" />
              </svg>
            </div>
            <div className="lb-card-titles">
              <div className="lb-card-title">Overall</div>
              <div className="lb-card-sub">LEADERBOARD</div>
            </div>
          </div>
          <ul className="lb-list">
            <li className="lb-item">
              <span className="avatar">IR</span>
              <span className="name">Indumathi Ravi</span>
              <span className="score">421</span>
            </li>
            <li className="lb-item you">
              <span className="avatar">YOU</span>
              <span className="name">You</span>
              <span className="score">319</span>
            </li>
            <li className="lb-item">
              <span className="avatar">HK</span>
              <span className="name">Hariharan Sampath Kumar</span>
              <span className="score">309</span>
            </li>
            <li className="lb-item">
              <span className="avatar">ST</span>
              <span className="name">Sasikumar Thangavel</span>
              <span className="score">252</span>
            </li>
            <li className="lb-item">
              <span className="avatar">AT</span>
              <span className="name">Abirami Thirunangam</span>
              <span className="score">201</span>
            </li>
          </ul>
        </div>

        {/* Performance */}
        <div className="lb-card">
          <div className="lb-card-header bg-brown">
            <div className="lb-card-icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
            <div className="lb-card-titles">
              <div className="lb-card-title">Performance</div>
              <div className="lb-card-sub">LEADERBOARD</div>
            </div>
          </div>
          <ul className="lb-list">
            <li className="lb-item">
              <span className="avatar">AT</span>
              <span className="name">Abirami Thirunangam</span>
              <span className="score">250</span>
            </li>
            <li className="lb-item you">
              <span className="avatar">YOU</span>
              <span className="name">You</span>
              <span className="score">150</span>
            </li>
            <li className="lb-item">
              <span className="avatar">HK</span>
              <span className="name">Hariharan Sampath Kumar</span>
              <span className="score">125</span>
            </li>
            <li className="lb-item">
              <span className="avatar">SR</span>
              <span className="name">Samyuktha Sambantham</span>
              <span className="score">100</span>
            </li>
            <li className="lb-item">
              <span className="avatar">ST</span>
              <span className="name">Sasikumar Thangavel</span>
              <span className="score">75</span>
            </li>
          </ul>
        </div>

        {/* Task */}
        <div className="lb-card">
          <div className="lb-card-header bg-orange">
            <div className="lb-card-icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <div className="lb-card-titles">
              <div className="lb-card-title">Task</div>
              <div className="lb-card-sub">LEADERBOARD</div>
            </div>
          </div>
          <ul className="lb-list">
            <li className="lb-item">
              <span className="avatar">IR</span>
              <span className="name">Indumathi Ravi</span>
              <span className="score">22</span>
            </li>
            <li className="lb-item">
              <span className="avatar">HK</span>
              <span className="name">Hariharan Sampath Kumar</span>
              <span className="score">20</span>
            </li>
            <li className="lb-item">
              <span className="avatar">AT</span>
              <span className="name">Abirami Thirunangam</span>
              <span className="score">18</span>
            </li>
            <li className="lb-item">
              <span className="avatar">SR</span>
              <span className="name">Samyuktha Sambantham</span>
              <span className="score">16</span>
            </li>
            <li className="lb-item you">
              <span className="avatar">YOU</span>
              <span className="name">You</span>
              <span className="score">12</span>
            </li>
          </ul>
        </div>

        {/* Attendance */}
        <div className="lb-card">
          <div className="lb-card-header bg-green">
            <div className="lb-card-icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V8h14v11z" />
              </svg>
            </div>
            <div className="lb-card-titles">
              <div className="lb-card-title">Attendance</div>
              <div className="lb-card-sub">LEADERBOARD</div>
            </div>
          </div>
          <ul className="lb-list">
            <li className="lb-item">
              <span className="avatar">AT</span>
              <span className="name">Abirami Thirunangam</span>
              <span className="score">20</span>
            </li>
            <li className="lb-item">
              <span className="avatar">HK</span>
              <span className="name">Hariharan Sampath Kumar</span>
              <span className="score">10</span>
            </li>
            <li className="lb-item">
              <span className="avatar">IR</span>
              <span className="name">Indumathi Ravi</span>
              <span className="score">10</span>
            </li>
            <li className="lb-item">
              <span className="avatar">SR</span>
              <span className="name">Samyuktha Sambantham</span>
              <span className="score">10</span>
            </li>
            <li className="lb-item you">
              <span className="avatar">YOU</span>
              <span className="name">You</span>
              <span className="score">9</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Achievements;