import React from 'react'

function leftBar() {
  return (
    <>
    <aside className="main-sidebar">
		<div className="p-3 pt-2">
			<a href="" className="pb-0"><img src="./asserts/images/innovent-logo.png" alt="Logo" className="logo" /></a>
			<p className="text-right mb-0">Retail</p>
		</div>
		<div className="pl-3"><a href=""><i className="fa fa-bars"></i></a></div>
		<ul className="navbar-nav mr-auto sidenav">
			<li className="nav-item active main_home">
				<a className="nav-link nav-link-collapse" href="https://inno-retail-web-qa.azurewebsites.net/dashboard_home2" id="hasSubItems">
					<img src="./asserts/images/Icon feather-home.png" alt="" /> Home</a>
				<ul className="nav-second-level collapse home" id="collapseSubItems2" data-parent="#navAccordion">
					<li className="nav-item">
						<a className="nav-link" href="dashboard_home2" data-pjax="main-content">
							<img src="./asserts/images/icon-dashboard.png" /> <span className="ml-2"> Dashboard </span>
						</a>
					</li>
				</ul>
			</li>
			<li className="nav-item left_menu_all active main_admin">
				<a className="nav-link nav-link-collapse admin_menu active222" href="dashboard" data-pjax="main-content"><img src="./asserts/images/icons/icon-admin.png" alt="" /> Admin</a>
				<ul className="nav-second-level collapse admin" id="collapseSubItems2" data-parent="#navAccordion">
					<li className="nav-item mm_admin dashboard_menu active222">
						<a href="dashboard" data-pjax="main-content" className="nav-link"><img src="./asserts/images/icons/icon-dashboard.png" /> <span className="ml-2">Dashboard</span></a>
					</li>
					<li className="nav-item mm_usersinfo userinfo_menu active222">
						<a href="usersinfo" data-pjax="main-content" className="nav-link"><img src="./asserts/images/icons/icon-users.png"/> <span className="ml-2">Users</span></a>
					</li>
					<li className="nav-item mm_handheldDevices device_menu active222">
						<a href="handheldDevices" data-pjax="main-content" className="nav-link"><img src="./asserts/images/icons/icon-devices.png"/> <span className="ml-2">Devices</span></a>
					</li>
					<li className="nav-item mm_new_asndata new_asndata_menu active222">
						<a className="nav-link" href="new_asndata" data-pjax="main-content"><img src="./asserts/images/icons/icon-transfers.png"/> <span className="ml-2">Transfer Cancelation</span></a>
					</li>
					<li className="nav-item mm_manual_receiving_asn manual_receiving_asn_menu active222">
						<a className="nav-link" href="manual_receiving_asn" data-pjax="main-content"><img src="./asserts/images/icons/role.png" alt=""/> <span className="ml-2">Manual Receiving IBT</span></a>
					</li>
					<li className="nav-item mm_storeinfo storeinfo_menu active222">
						<a className="nav-link" href="storeinfo" data-pjax="main-content"><img src="./asserts/images/icons/icon-stores.png"/><span className="ml-2">Stores</span></a>
					</li>
					<li className="nav-item mm_printer printer_menu active222">
						<a className="nav-link" href="printer" data-pjax="main-content"><img src="./asserts/images/icons/icon-printers.png"/> <span className="ml-2">Printers</span></a>
					</li>
					<li className="nav-item mm_zpl zpl_menu active222">
						<a className="nav-link" href="zpl" data-pjax="main-content"><img src="./asserts/images/icons/icon-zpl.png"/> <span className="ml-2">Zpl</span></a>
					</li>
					<li className="nav-item mm_AuditInfo auditinfo_menu active222">
						<a className="nav-link" href="AuditInfo" data-pjax="main-content"><img src="./asserts/images/icons/audit.png"/> <span className="ml-2">Audit</span></a>
					</li>
					<li className="nav-item mm_ibt_difference auditinfo_menu active222">
						<a className="nav-link" href="ibt_difference" data-pjax="main-content"><img src="./asserts/images/icons/audit.png"/> <span className="ml-2">IBT Difference</span></a>
					</li>
					<li className="nav-item mm_admin_menu auditinfo_menu active222">
						<a className="nav-link" href="admin_menu" data-pjax="main-content"><img src="./asserts/images/icons/icon-transfers.png"/> <span className="ml-2">Admin Menu</span></a>
					</li>
					<li className="nav-item mm_UserRoles userroles_menu active222">
						<a className="nav-link" href="UserRoles" data-pjax="main-content"><img src="./asserts/images/icons/role.png"/> <span className="ml-2">Roles</span></a>
					</li>
				</ul>
			</li>
			<li className="nav-item left_menu_all main_count">
				<a className="nav-link nav-link-collapse count_menu active222" href="executiveSummary" data-pjax="main-content"><img src="./asserts/images/icon-count.png" alt=""/> Count</a>
				<ul className="nav-second-level collapse count show" id="collapseSubItems5" data-parent="#navAccordion">
					<li className="nav-item mm_executiveSummary executiveSummary_menu active active222">
						<a className="nav-link" href="executiveSummary" data-pjax="main-content"><img src="./asserts/images/icon-dashboard.png"/> <span className="ml-2">Dashboard</span></a>
					</li>
					<li className="nav-item mm_stockSummary operations_menu active222">
						<a className="nav-link" href="stockSummary" data-pjax="main-content"><img src="./asserts/images/ionic-ios-flower.png"/> <span className="ml-2">Operation</span></a>
					</li>
					<li className="nav-item mm_stockSummary_initial operations0_menu active222">
						<a className="nav-link" href="stockSummary_initial" data-pjax="main-content"><img src="./asserts/images/ionic-ios-flower.png"/> <span className="ml-2">Operation 0</span></a>
					</li>
					<li className="nav-item mm_inventorybyitem inventroy_menu active222">
						<a className="nav-link" href="inventorybyitem" data-pjax="main-content"><img src="./asserts/images/icon-inventory.png"/><span className="ml-2">Inventory (EPC)</span></a>
					</li>
				</ul>
			</li>
			<li className="nav-item left_menu_all main_supplychain">
				<a className="nav-link nav-link-collapse supplychain_menu active222" href="supplychaindashboard" data-pjax="main-content">
				<img src="./asserts/images/Group21.png" alt="" /> Supply Chain</a>
				<ul className="nav-second-level collapse supplychain" id="collapseSubItems6" data-parent="#navAccordion">
					<li className="nav-item mm_asndata asndata_menu active222">
						<a className="nav-link" href="asndata" data-pjax="main-content">
						<img src="./asserts/images/icons/icon-transfers.png" /> <span className="ml-2">Transfers</span>
						</a>
					</li>
					<li className="nav-item mm_GoodsStockStore GoodsSummary_menu">
						<a className="nav-link" href="GoodsSummary" data-pjax="main-content">
							<img src="./asserts/images/icons/icon-stores.png"/> <span className="ml-2">GI Summary</span>
						</a>
					</li>
					<li className="nav-item mm_GoodsStockStore GoodsStockStore_menu active222">
						<a className="nav-link" href="GoodsStockStore" data-pjax="main-content">
							<img src="./asserts/images/icons/icon-stores.png" /> <span className="ml-2">IN-Store GI</span>
						</a>
					</li>
					<li className="nav-item mm_GoodsStockWareHouse GoodsStockWareHouse_menu active222">
						<a className="nav-link" href="GoodsStockWareHouse" data-pjax="main-content">
							<img src="./asserts/images/icons/icon-enterprise.png" /> <span className="ml-2">WareHouse GI</span>
						</a>
					</li>
				</ul>
			</li>
			<li className="nav-item left_menu_all main_zplprinter">
				<a className="nav-link nav-link-collapse tagit_menu active222" id="hasSubItems" href="zplprinter" data-pjax="main-content">
					<img src="./asserts/images/icons/icon-tags.png" alt="" /> TagIt</a>
				<ul className="nav-second-level collapse zplprinter" id="collapseSubItems2" data-parent="#navAccordion">
					<li className="nav-item mm_zplprinter zplprinter_menu active222">
						<a className="nav-link" href="zplprinter_new" data-pjax="main-content">
						<img src="./asserts/images/icons/icon-zpl.png" /> <span className="ml-2">Zpl Printer</span>
						</a>
					</li>
					<li className="nav-item mm_zplreport zplreport_menu">
						<a className="nav-link" href="zplReport" data-pjax="main-content">
						<img src="./asserts/images/icons/icon-zpl.png" /> <span className="ml-2">Zpl Report</span></a>
					</li>
					<li className="nav-item mm_zplReport_sku zplReport_sku">
						<a className="nav-link" href="zplReport_sku" data-pjax="main-content">
						<img src="./asserts/images/icons/icon-zpl.png" /> <span className="ml-2">Zpl Report (Sku)</span></a>
					</li>
				</ul>
			</li>
		</ul>
	</aside>
    </>
  )
}

export default leftBar;
