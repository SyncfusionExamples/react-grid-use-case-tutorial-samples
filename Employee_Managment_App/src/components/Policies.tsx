import * as React from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Page,
  Sort,
  Toolbar,
  Resize
} from '@syncfusion/ej2-react-grids';
import './Policies.css';

const Policies: React.FC = () => {
  // Static data only (no logic). Classes are precomputed to avoid conditional styling.
  const policyData = [
    {
      id: 1,
      policyName: 'Remote Work Policy',
      category: 'Employment',
      categoryClass: 'policy-badge badge--blue',
      lastUpdated: 'May 15, 2023',
      enrolledOn: 'May 15, 2023',
      statusText: 'Active',
      statusClass: 'status status--active'
    },
    {
      id: 2,
      policyName: 'Workplace Safety Guidelines',
      category: 'Health & Safety',
      categoryClass: 'policy-badge badge--red',
      lastUpdated: 'May 10, 2023',
      enrolledOn: 'May 10, 2023',
      statusText: 'Active',
      statusClass: 'status status--active'
    },
    {
      id: 3,
      policyName: 'Anti-Harassment Policy',
      category: 'Code of Conduct',
      categoryClass: 'policy-badge badge--purple',
      lastUpdated: 'May 5, 2023',
      enrolledOn: 'May 5, 2023',
      statusText: 'Under Review',
      statusClass: 'status status--review'
    },
    {
      id: 4,
      policyName: 'Inclusion Commitment',
      category: 'Diversity & Inclusion',
      categoryClass: 'policy-badge badge--green',
      lastUpdated: 'Apr 28, 2023',
      enrolledOn: 'Apr 28, 2023',
      statusText: 'Active',
      statusClass: 'status status--active'
    }
  ];

  // Small presentational templates (no business logic)
  const policyNameTemplate = (props: any) => (
    <div className="policy-name-cell">
      <span className="policy-icon" aria-hidden="true">📄</span>
      <span className="policy-name-text">{props.policyName}</span>
    </div>
  );

  const categoryTemplate = (props: any) => (
    <span className={props.categoryClass}>{props.category}</span>
  );

  const statusTemplate = (props: any) => (
    <span className={props.statusClass}>{props.statusText}</span>
  );

  const actionsTemplate = () => (
    <button className="action action--view" aria-label="View policy">👁️</button>
  );

  return (
    <div className="policiespage">
      <div className="policies-content policies-grid-wrapper">
        <header className="policies-header">
          <h2 className="policies-title">Company Policies</h2>
          <div className="policies-searchbar" role="search" aria-label="Search policies">
            <input
              type="text"
              placeholder="Search policies..."
              className="policies-search-input"
              aria-label="Search policies"
              readOnly
            />
            <button className="policies-search-button" aria-label="Search" disabled>
              🔍
            </button>
          </div>
        </header>

        {/* Categories */}
        <section className="policy-categories" aria-labelledby="policy-categories-title">
          <div className="section-header">
            <h3 id="policy-categories-title" className="section-title">Policy Categories</h3>
          </div>

          <div className="category-grid">
            <a className="category-card" href="#" aria-label="Employment, 12 policies">
              <div className="category-icon">🗂️</div>
              <div className="category-content">
                <div className="category-name">Employment</div>
                <div className="category-meta">12 policies</div>
              </div>
            </a>
            <a className="category-card" href="#" aria-label="Health & Safety, 8 policies">
              <div className="category-icon">🛡️</div>
              <div className="category-content">
                <div className="category-name">Health & Safety</div>
                <div className="category-meta">8 policies</div>
              </div>
            </a>
            <a className="category-card" href="#" aria-label="Code of Conduct, 6 policies">
              <div className="category-icon">🧭</div>
              <div className="category-content">
                <div className="category-name">Code of Conduct</div>
                <div className="category-meta">6 policies</div>
              </div>
            </a>
            <a className="category-card" href="#" aria-label="Diversity & Inclusion, 5 policies">
              <div className="category-icon">👥</div>
              <div className="category-content">
                <div className="category-name">Diversity & Inclusion</div>
                <div className="category-meta">5 policies</div>
              </div>
            </a>
          </div>
        </section>

        {/* Grid */}
        <section className="recent-policies" aria-labelledby="recently-updated-policies-title">
          <div className="section-header">
            <h3 id="recently-updated-policies-title" className="section-title">Recently Updated Policies</h3>
            <a className="view-all-link" href="#" aria-label="View all policies">View All →</a>
          </div>

          <div className="sf-grid-card">
            <GridComponent
              dataSource={policyData}
              allowPaging={true}
              allowSorting={true}
              allowResizing={true}
              toolbar={['Search']}
              pageSettings={{ pageSize: 5 }}
              gridLines="Horizontal"
              width="100%"
            >
              <ColumnsDirective>
                <ColumnDirective
                  field="policyName"
                  headerText="Policy Name"
                  width="220"
                  template={policyNameTemplate}
                />
                <ColumnDirective
                  field="category"
                  headerText="Category"
                  width="170"
                  template={categoryTemplate}
                />
                <ColumnDirective
                  field="lastUpdated"
                  headerText="Last Updated"
                  width="150"
                  textAlign="Left"
                />
                <ColumnDirective
                  field="enrolledOn"
                  headerText="Enrolled On"
                  width="150"
                  textAlign="Left"
                />
                <ColumnDirective
                  field="statusText"
                  headerText="Status"
                  width="130"
                  template={statusTemplate}
                />
                <ColumnDirective
                  headerText="Actions"
                  width="110"
                  template={actionsTemplate}
                  textAlign="Center"
                />
              </ColumnsDirective>
              <Inject services={[Page, Sort, Toolbar, Resize]} />
            </GridComponent>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Policies;