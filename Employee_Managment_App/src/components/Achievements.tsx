// src/components/Achievements.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DataManager, UrlAdaptor, Query } from '@syncfusion/ej2-data';
import './Achievements.css';

type EmployeeDetails = {
  EmployeeCode: string;
  Name: string;
  Mail?: string;
  Designation?: string;
  Branch?: string;
  Team?: string;
  TeamLead?: string;
  ManagerName?: string;
  DateOfJoining?: string | Date;
};

type AchievementsProps = {
  userInfo?: EmployeeDetails | null;
  onlyTeamIfUser?: boolean;
};

const data = new DataManager({
  url: 'https://ej2services.syncfusion.com/aspnet/development/api/EmployeesData',
  adaptor: new UrlAdaptor(),
});

const roles = [
  { text: 'All', value: 'All' },
  { text: 'Developer', value: 'Developer' },
  { text: 'QA', value: 'QA' },
  { text: 'Designer', value: 'Designer' },
  { text: 'Manager', value: 'Manager' },
];

const months = [
  { text: 'All', value: 'All' },
  { text: 'Jan', value: 'Jan' },
  { text: 'Feb', value: 'Feb' },
  { text: 'Mar', value: 'Mar' },
  { text: 'Apr', value: 'Apr' },
  { text: 'May', value: 'May' },
  { text: 'Jun', value: 'Jun' },
  { text: 'Jul', value: 'Jul' },
  { text: 'Aug', value: 'Aug' },
  { text: 'Sep', value: 'Sep' },
  { text: 'Oct', value: 'Oct' },
  { text: 'Nov', value: 'Nov' },
  { text: 'Dec', value: 'Dec' },
];

const years = [
  { text: '2022', value: 2022 },
  { text: '2023', value: 2023 },
  { text: '2024', value: 2024 },
  { text: '2025', value: 2025 }
];

function mapDesignationToRole(designation?: string): 'Developer' | 'QA' | 'Designer' | 'Manager' {
  const d = (designation ?? '').toLowerCase();
  if (d.includes('qa') || d.includes('quality')) return 'QA';
  if (d.includes('design')) return 'Designer';
  if (d.includes('manager') || d.includes('lead') || d.includes('head')) return 'Manager';
  return 'Developer';
}

function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seededPRNG(seedStr: string) {
  const seedFn = xmur3(seedStr);
  return mulberry32(seedFn());
}

type ScoreTriple = { overall: number; task: number; attendance: number; };

function monthIndex(m: string) {
  return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(m);
}

function buildScores(emp: EmployeeDetails, month: string, year: number): ScoreTriple {
  const seedKey = `${emp.EmployeeCode || emp.Name}-${year}-${month}`;
  const rand = seededPRNG(seedKey);

  const role = mapDesignationToRole(emp.Designation);
  const roleTaskWeight = role === 'Manager' ? 0.9 : role === 'QA' ? 1.1 : role === 'Designer' ? 1.0 : 1.05;
  const roleAttendWeight = role === 'Manager' ? 0.95 : 1.0;

  let tenureYears = 1;
  try {
    const doj = new Date(emp.DateOfJoining || '');
    if (!isNaN(+doj)) {
      const now = new Date(year, month === 'All' ? 0 : monthIndex(month), 1);
      const diff = (now.getTime() - doj.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      tenureYears = Math.max(1, Math.min(10, Math.floor(diff)));
    }
  } catch {
    tenureYears = 1;
  }
  const tenureBonus = 1 + tenureYears * 0.02;

  const task = Math.round((12 + rand() * 18) * roleTaskWeight * tenureBonus);
  const attendance = Math.round((8 + rand() * 14) * roleAttendWeight);
  const overall = Math.round(task * 12 + attendance * 8 + rand() * 20);

  return { task, attendance, overall };
}

function initials(name?: string) {
  if (!name) return 'NA';
  const parts = name.trim().split(/\s+/);
  const s = (parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '');
  return s.toUpperCase();
}

const Achievements: React.FC<AchievementsProps> = ({ userInfo, onlyTeamIfUser = true }) => {
  const [role, setRole] = useState<string>('All');
  const [month, setMonth] = useState<string>('All');
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const [employees, setEmployees] = useState<EmployeeDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const q = new Query().take(200);
        const result: any = await (data as any).executeQuery(q);
        const rows: EmployeeDetails[] = Array.isArray(result?.result) ? result.result : (result as any) ?? [];
        if (isMounted) {
          setEmployees(rows);
          setError(null);
        }
      } catch {
        if (isMounted) setError('Failed to load employees');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const { overallTop, taskTop, attendanceTop, youRowIds } = useMemo(() => {
    const monthKey = month;
    const base = employees
      .filter((e) => {
        if (onlyTeamIfUser && userInfo?.Team) return (e.Team || '').toLowerCase() === userInfo.Team.toLowerCase();
        return true;
      })
      .filter((e) => (role === 'All' ? true : mapDesignationToRole(e.Designation) === role));

    const rows = base.map((e) => {
      const s = buildScores(e, monthKey, year);
      return { ...e, scoreOverall: s.overall, scoreTask: s.task, scoreAttendance: s.attendance };
    });

    const topN = 5;
    const overallTop = [...rows].sort((a, b) => b.scoreOverall - a.scoreOverall).slice(0, topN);
    const taskTop = [...rows].sort((a, b) => b.scoreTask - a.scoreTask).slice(0, topN);
    const attendanceTop = [...rows].sort((a, b) => b.scoreAttendance - a.scoreAttendance).slice(0, topN);

    const youId = (userInfo?.EmployeeCode || userInfo?.Name || '').toLowerCase();
    const youRowIds = new Set<string>();
    if (youId) {
      [overallTop, taskTop, attendanceTop].forEach((arr) =>
        arr.forEach((r) => {
          const id = (r.EmployeeCode || r.Name).toLowerCase();
          if (id === youId) youRowIds.add(id);
        })
      );
    }
    return { overallTop, taskTop, attendanceTop, youRowIds };
  }, [employees, role, month, year, userInfo?.Team, userInfo?.EmployeeCode, userInfo?.Name, onlyTeamIfUser]);

  return (
    <div className="achievements-container light-theme">
      <div className="achievements-toolbar flat">
        <div className="toolbar-left">
          <div className="toolbar-title">Leaderboard</div>
          <div className="toolbar-sub">
            {onlyTeamIfUser && userInfo?.Team
              ? `You can view only your team employees in leaderboard. (Team: ${userInfo.Team})`
              : 'Leaderboard generated from employee records.'}
          </div>
        </div>

        <div className="toolbar-right">
          <label className="toolbar-field">
            <span className="field-label" >Role</span>
            <DropDownListComponent
              id="role-ddl"
              cssClass="sf-field-input"
              dataSource={roles}
              fields={{ text: 'text', value: 'value' }}
              value={role}
              width="135px"
              placeholder="Select role"
              change={(e: any) => setRole(e.value)}
              aria-label="Filter by role"
              floatLabelType="Never"
              popupHeight="220px"
            />
          </label>

          <label className="toolbar-field">
            <span className="field-label">Month</span>
            <DropDownListComponent
              id="month-ddl"
              cssClass="sf-field-input"
              dataSource={months}
              width="100px"
              fields={{ text: 'text', value: 'value' }}
              value={month}
              placeholder="Select month"
              change={(e: any) => setMonth(e.value)}
              aria-label="Filter by month"
              floatLabelType="Never"
              popupHeight="260px"
            />
          </label>

          <label className="toolbar-field">
            <span className="field-label">Year</span>
            <DropDownListComponent
              id="year-ddl"
              cssClass="sf-field-input"
              dataSource={years}
              width="100px"
              fields={{ text: 'text', value: 'value' }}
              value={year}
              placeholder="Select year"
              change={(e: any) => setYear(e.value)}
              aria-label="Filter by year"
              floatLabelType="Never"
              popupHeight="220px"
            />
          </label>
        </div>
      </div>

      {loading && <div style={{ margin: '16px 2px' }}>Loading employees…</div>}
      {error && <div style={{ margin: '16px 2px', color: '#dc2626' }}>{error}</div>}

      {!loading && !error && (
        <>
          <div className="celebrate-banner flat">Congratulations to everyone!</div>

          {/* Flat HR-portal style: three simple sections with neutral headers */}
          <div className="lb-sections">
            <section className="lb-section">
              <header className="lb-header bg-r-overall">
                <div className="lb-header-icon icon-overall e-icons e-people" aria-hidden>
                </div>
                <div className="lb-header-text">
                  <div className="lb-title">Overall</div>
                  <div className="lb-sub">LEADERBOARD</div>
                </div>
              </header>
              <ul className="lb-list flat">
                {overallTop.map((e) => {
                  const id = (e.EmployeeCode || e.Name).toLowerCase();
                  const you = youRowIds.has(id);
                  return (
                    <li key={`o-${id}`} className={`lb-row ${you ? 'you' : ''}`}>
                      <span className="avatar flat">{initials(e.Name)}</span>
                      <span className="name">{e.Name}</span>
                      <span className="score flat">{(e as any).scoreOverall}</span>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="lb-section">
              <header className="lb-header bg-r-task">
                <div className="lb-header-icon icon-task e-icons e-check-tick" aria-hidden>
                </div>
                <div className="lb-header-text">
                  <div className="lb-title">Task</div>
                  <div className="lb-sub">LEADERBOARD</div>
                </div>
              </header>
              <ul className="lb-list flat">
                {taskTop.map((e) => {
                  const id = (e.EmployeeCode || e.Name).toLowerCase();
                  const you = youRowIds.has(id);
                  return (
                    <li key={`t-${id}`} className={`lb-row ${you ? 'you' : ''}`}>
                      <span className="avatar flat">{initials(e.Name)}</span>
                      <span className="name">{e.Name}</span>
                      <span className="score flat">{(e as any).scoreTask}</span>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="lb-section">
              <header className="lb-header bg-r-attendance">
                <div className="lb-header-icon icon-att e-icons e-day" aria-hidden>
                </div>
                <div className="lb-header-text">
                  <div className="lb-title">Attendance</div>
                  <div className="lb-sub">LEADERBOARD</div>
                </div>
              </header>
              <ul className="lb-list flat">
                {attendanceTop.map((e) => {
                  const id = (e.EmployeeCode || e.Name).toLowerCase();
                  const you = youRowIds.has(id);
                  return (
                    <li key={`a-${id}`} className={`lb-row ${you ? 'you' : ''}`}>
                      <span className="avatar flat">{initials(e.Name)}</span>
                      <span className="name">{e.Name}</span>
                      <span className="score flat">{(e as any).scoreAttendance}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default Achievements;