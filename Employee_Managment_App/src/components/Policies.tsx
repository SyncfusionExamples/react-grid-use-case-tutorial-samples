// src/components/Policies.tsx
import * as React from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Page,
  Sort,
  Toolbar,
  Resize,
  CommandColumn,
  CommandModel,
  CommandClickEventArgs
} from '@syncfusion/ej2-react-grids';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import './Policies.css';

type Policy = {
  id: number;
  policyName: string;
  policyDesciption: string;
  category: string;
  lastUpdated: string;
  enrolledOn: string;
  statusText: string;
  statusClass: string;
};

const Policies: React.FC = () => {
  const policyData: Policy[] = [
    { id: 1, policyName: 'Assets Policy', policyDesciption: 'Our company provides employees with necessary work devices to enhance productivity. Employees may take these devices home but are responsible for their safekeeping and proper usage. Devices must remain in good condition and be returned in working order when no longer needed or upon employment termination. Employees are not permitted to install unauthorized software, modify device settings, or use company assets for personal gain.', category: 'IT & Devices', lastUpdated: 'May 15, 2023', enrolledOn: 'May 15, 2023', statusText: 'Active', statusClass: 'status status--active' },
    { id: 2, policyName: 'Attendance Policy', policyDesciption: 'Punctuality and consistent attendance are crucial for maintaining workflow efficiency and team collaboration. Employees should adhere to their assigned work schedules and inform supervisors promptly about any absences. Repeated lateness or unexcused absences may lead to corrective measures. Remote employees are also expected to maintain a professional work routine and be available during business hours.', category: 'Employment', lastUpdated: 'May 12, 2023', enrolledOn: 'May 12, 2023', statusText: 'Active', statusClass: 'status status--active' },
    { id: 3, policyName: 'Protecting Information Policy', policyDesciption: 'Protecting our company information is the responsibility of every associate, and we all share a common interest in making sure information is not improperly or accidentally disclosed.Employees must follow strict security protocols, including password protection, data encryption, and secure file sharing. Confidential business data should not be shared with unauthorized personnel or stored on personal devices.', category: 'Security', lastUpdated: 'May 11, 2023', enrolledOn: 'May 11, 2023', statusText: 'Active', statusClass: 'status status--active' },
    { id: 4, policyName: 'Leave Policy', policyDesciption: 'Our company values employee well-being and offers 36 annual leave days to support work-life balance. Employees are required to submit leave requests in advance for approval. Leave categories include annual leave, medical leave, family leave, and emergency leave. Unused leave may be carried over based on company policy. Employees must ensure that their responsibilities are covered during their absence to maintain workflow efficiency.', category: 'HR & Leave', lastUpdated: 'May 10, 2023', enrolledOn: 'May 10, 2023', statusText: 'Active', statusClass: 'status status--active' },
    { id: 5, policyName: 'Remote Work Policy', policyDesciption: 'We support flexible work arrangements, allowing employees to work remotely when feasible. Remote employees must ensure they have a reliable internet connection, use approved work devices, and maintain clear communication with their teams. Productivity is measured by performance rather than work hours, but availability during core business hours is expected.', category: 'Employment', lastUpdated: 'May 15, 2023', enrolledOn: 'May 15, 2023', statusText: 'Active', statusClass: 'status status--active' },
    { id: 6, policyName: 'Security Policy', policyDesciption: 'Ensuring the security of company assets and information is a collective responsibility. Employees must follow security protocols such as using strong passwords, securing physical devices, and reporting any suspicious activity. Unauthorized system access, data breaches, or sharing of confidential information with unauthorized parties is strictly prohibited.', category: 'Security', lastUpdated: 'May 9, 2023', enrolledOn: 'May 9, 2023', statusText: 'Active', statusClass: 'status status--active' },
    { id: 7, policyName: 'Internet Usage Policy', policyDesciption: 'Employees must use company-provided internet access responsibly. Engaging in illegal activities, excessive personal browsing, or accessing restricted content is prohibited. Downloading unapproved software or violating copyright laws is strictly forbidden. Internet activity may be monitored to ensure compliance with security and productivity guidelines.', category: 'IT & Devices', lastUpdated: 'May 7, 2023', enrolledOn: 'May 7, 2023', statusText: 'Under Review', statusClass: 'status status--review' },
    { id: 8, policyName: 'Expense Reimbursement Policy', policyDesciption: 'Employees may request reimbursement for approved work-related expenses, including travel, meals, and lodging, provided they submit receipts and supporting documents within the required timeframe. All expense claims must align with company budgetary policies. Unauthorized or personal expenses will not be reimbursed unless specifically approved.', category: 'Compliance', lastUpdated: 'May 6, 2023', enrolledOn: 'May 6, 2023', statusText: 'Active', statusClass: 'status status--active' }
  ];

  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Policy | null>(null);
  const [activeCategory, setActiveCategory] = React.useState<string>('All');

  // Add Employment to filter chips
  const categoryChips = React.useMemo(() => {
    const countBy = policyData.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
    const items = [
      { key: 'All', name: 'All', count: policyData.length },
      { key: 'Security', name: 'Security', count: countBy['Security'] || 0 },
      { key: 'HR & Leave', name: 'HR & Leave', count: countBy['HR & Leave'] || 0 },
      { key: 'Compliance', name: 'Compliance', count: countBy['Compliance'] || 0 },
      { key: 'IT & Devices', name: 'IT & Devices', count: countBy['IT & Devices'] || 0 },
      // New: Employment category chip
      { key: 'Employment', name: 'Employment', count: countBy['Employment'] || 0 }
    ];
    return items;
  }, [policyData]);

  const filteredData = React.useMemo(() => {
    if (activeCategory === 'All') return policyData;
    return policyData.filter(p => p.category === activeCategory);
  }, [activeCategory, policyData]);

  const viewCommands: CommandModel[] = [{ buttonOption: { iconCss: 'e-icons e-view-details' }, title: 'View' }];

  const policyNameTemplate = (props: any) => (
    <div className="policy-name-cell">
      <span className="policy-icon" aria-hidden="true">📄</span>
      <span className="policy-name-text">{props.policyName}</span>
    </div>
  );
  const categoryTemplate = (props: any) => <span>{props.category}</span>;
  const statusTemplate = (props: any) => <span className={props.statusClass}>{props.statusText}</span>;

  const onCommandClick = (args: CommandClickEventArgs) => {
    const row = args.rowData as Policy;
    setSelected(row);
    setOpen(true);
  };
  const onDialogClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleChipClick = (key: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveCategory(key);
  };

  const clearCategoryFilter = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveCategory('All');
  };

  return (
    <div className="policiespage policiespage--green">
      <div className="policies-content policies-grid-wrapper">
        <header className="policies-header">
          <h2 className="policies-title">Employee Policy Hub</h2>
        </header>

        <section className="policies-intro" aria-label="Policies information">
          <div className="policies-intro__icon" aria-hidden="true">📘</div>
          <div className="policies-intro__body">
            <p className="policies-intro__text">
              This page contains the documents related to the company policies. Please contact the HR team through email
              <a className="policies-intro__link" href="mailto:hr@xyz.com" aria-label="Email HR at hr@xyz.com">
                hr@xyz.com
              </a>
              for any queries related to the policies.
            </p>
          </div>
        </section>

        <section className="policy-filters" aria-labelledby="policy-filters-title">
          <div className="section-header">
            <h3 id="policy-filters-title" className="section-title">Policy Categories</h3>
            <a className="view-all-link" href="#" onClick={clearCategoryFilter} aria-label="Clear category filter">Reset</a>
          </div>

          <div className="filter-chip-row" role="tablist" aria-label="Filter by category">
            {categoryChips.map(chip => (
              <button
                key={chip.key}
                onClick={handleChipClick(chip.key)}
                className={`filter-chip ${activeCategory === chip.key ? 'is-active' : ''}`}
                aria-pressed={activeCategory === chip.key}
                type="button"
              >
                <span className="filter-chip__label">{chip.name}</span>
                <span className="filter-chip__count">{chip.count}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="recent-policies" aria-labelledby="recently-updated-policies-title">
          <div className="section-header">
            <h3 id="recently-updated-policies-title" className="section-title">
              {activeCategory === 'All' ? 'Recently Updated Policies' : `${activeCategory} Policies`}
            </h3>
          </div>
          <GridComponent
            dataSource={filteredData}
            allowPaging
            allowSorting
            allowResizing
            toolbar={['Search']}
            pageSettings={{ pageSize: 5 }}
            gridLines="Horizontal"
            width="100%"
            commandClick={onCommandClick}
          >
            <ColumnsDirective>
              <ColumnDirective field="policyName" headerText="Policy Name" width="220" template={policyNameTemplate} />
              <ColumnDirective field="category" headerText="Category" width="170" template={categoryTemplate} />
              <ColumnDirective field="lastUpdated" headerText="Last Updated" width="150" textAlign="Left" />
              <ColumnDirective field="enrolledOn" headerText="Enrolled On" width="150" textAlign="Left" />
              <ColumnDirective field="statusText" headerText="Status" width="130" template={statusTemplate} />
              <ColumnDirective headerText="Actions" width="110" commands={viewCommands} textAlign="Center" />
            </ColumnsDirective>
            <Inject services={[Page, Sort, Toolbar, Resize, CommandColumn]} />
          </GridComponent>
        </section>
      </div>

      <DialogComponent
        visible={open}
        isModal
        showCloseIcon
        header={selected ? selected.policyName : 'Policy Details'}
        width="600px"
        target=".policies-grid-wrapper"
        cssClass="policy-dialog"
        close={onDialogClose}
        animationSettings={{ duration: 0 }} 
      >
        {selected && (
          <div className="policy-dialog__content">
            <div className="policy-dialog__meta">
              <div>
                <div className="meta-label">Category</div>
                <div className="meta-value">{selected.category}</div>
              </div>
              <div>
                <div className="meta-label">Status</div>
                <div className={`meta-badge ${selected.statusClass}`}>{selected.statusText}</div>
              </div>
              <div>
                <div className="meta-label">Last Updated</div>
                <div className="meta-value">{selected.lastUpdated}</div>
              </div>
              <div>
                <div className="meta-label">Enrolled On</div>
                <div className="meta-value">{selected.enrolledOn}</div>
              </div>
            </div>

            <div className="policy-dialog__section">
              <div className="section-title">Description</div>
              <p className="policy-description">{selected.policyDesciption}</p>
            </div>

            <div className="policy-dialog__footer">
              <ButtonComponent cssClass="e-primary" onClick={onDialogClose} type="button">Close</ButtonComponent>
            </div>
          </div>
        )}
      </DialogComponent>
    </div>
  );
};

export default Policies;