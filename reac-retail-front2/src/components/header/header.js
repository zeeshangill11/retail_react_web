import React from 'react'

function Header() {
  return (
    <>
    	<link rel="stylesheet" href="./css/bootstrap.min.css" />

    	<link rel="stylesheet" href="./css/dashboard.min.css" />
		<link rel="stylesheet" href="./css/styles.min.css" />
		<link rel="stylesheet" href="./css/responsive.min.css" />
		<link rel="stylesheet" href="./css/all.css" />


		<header className="main-header" style={{display: "block"}}>
			<nav className="navbar navbar-expand-lg navbar customNav" style={{visibility: "visible"}}>
				<div className="collapse navbar-collapse" id="navbarNavDropdown">
					<ul className="navbar-nav">
						<li className="nav-item dropdown has-mega-menu" style={{position: "static"}}>
							<a className="nav-link dropdown-toggle mm_users nav-link admin_menu active222" href="dashboard" data-pjax="main-content" role="button" aria-haspopup="true" aria-expanded="false">
							<img src="./asserts/images/icon-admin.png" alt=""/> Admin</a>
							<div className="dropdown-menu mm_usersSubmenudropdown" style={{width: "100%"}} >
								<div className="px-0">
									<div className="CustomsubMenu">
										<a className="dropdown-item mm_usersSubmenu dashboard_menu active222" data-pjax="main-content" href="dashboard"><img src="./asserts/images/icon-dashboard.png" alt=""/> Dashboard</a>
										<a className="dropdown-item mm_usersSubmenuuserinfo userinfo_menu active222" href="usersinfo" data-pjax="main-content"><img src="./asserts/images/icon-user.png" alt=""/> Users</a>
										<a className="dropdown-item mm_usersSubmenuhandheldDevices device_menu active222" href="handheldDevices" data-pjax="main-content"><img src="./asserts/images/icon-device.png" alt=""/> Devices</a>
										<a className="dropdown-item mm_usersSubmenunew_asndata new_asndata_menu active222" href="new_asndata" data-pjax="main-content"><img src="./asserts/images/icons/icon-transfers.png" alt=""/>Transfer Cancelation </a>
										<a className="dropdown-item mm_usersSubmenugi_cancellation gi_cancellation_menu" href="gi_cancellation" data-pjax="main-content"><img src="./asserts/images/icons/icon-transfers.png" alt=""/>GI Cancelation </a>
										<a className="dropdown-item mm_manual_receiving_asnSubmenu manual_receiving_asn_menu active222" href="manual_receiving_asn" data-pjax="main-content"><img src="./asserts/images/icons/role.png" alt=""/> Manual Receiving IBT </a>
										<a className="dropdown-item mm_usersSubmenustoreinfo storeinfo_menu active222" href="storeinfo" data-pjax="main-content"><img src="./asserts/images/icon-store.png" alt=""/> Stores</a>
										<a className="dropdown-item mm_usersSubmenuprinter printer_menu active222" href="printer" data-pjax="main-content"><img src="./asserts/images/icon-printer.png" alt=""/> Printers</a>
										<a className="dropdown-item mm_usersSubmenuzpl zpl_menu active222" href="zpl" data-pjax="main-content"><img src="./asserts/images/icon-zpl.png" alt=""/> ZPL</a>
										<a className="dropdown-item mm_usersSubmenuAuditInfo auditinfo_menu active222" href="AuditInfo" data-pjax="main-content"><img src="./asserts/images/icons/audit.png" alt=""/> Audit</a>
										<a className="dropdown-item mm_usersSubmenuibt_difference ibt_difference_menu active222" href="ibt_difference" data-pjax="main-content"><img src="./asserts/images/icons/role.png" alt=""/> IBT Differences </a>
										<a className="dropdown-item mm_usersSubmenuadmin_menu admin_menu_menu active222" href="admin_menu" data-pjax="main-content"><img src="./asserts/images/icons/icon-transfers.png" alt=""/> Admin menu </a>
										<a className="dropdown-item mm_usersRolesSubmenu userroles_menu active222" href="UserRoles" data-pjax="main-content" ><img src="./asserts/images/icons/role.png" alt=""/> Roles</a>
									</div>
								</div>
							</div>
						</li>
						<li className="nav-item dropdown has-mega-menu" style={{position: "static"}}>
							<a className="nav-link dropdown-toggle mm_count count_menu active active222" href="executiveSummary" data-pjax="main-content" role="button" aria-haspopup="true" aria-expanded="false"><img src="./asserts/images/icon-count.png" alt=""/> Count</a>
							<div className="dropdown-menu mm_countSubmenudropdown show" style={{width: "100%"}}>
								<div className="px-0">
									<div className="CustomsubMenu">
										<a className="dropdown-item mm_countSubmenu executiveSummary_menu subMenuActive active222 active" href="executiveSummary" data-pjax="main-content"><img src="./asserts/images/icon-dashboard.png" alt=""/> Dashboard</a>
										<a className="dropdown-item stockSummarySubmenu operations_menu active222" href="stockSummary" data-pjax="main-content"><img src="./asserts/images/count/Icon ionic-ios-flower.png" alt=""/> Operation</a>
										<a className="dropdown-item operations0_Submenu operations0_menu active222" href="stockSummary_initial" data-pjax="main-content"><img src="./asserts/images/count/Icon ionic-ios-flower.png" alt=""/> Operation 0 </a>
										<a className="dropdown-item inventorybyitemSubmenu inventroy_menu active222" href="inventorybyitem" data-pjax="main-content"><img src="./asserts/images/icon-inventory.png" alt=""/> Inventory (EPC)</a>
										<a className="dropdown-item inventorybyitemSubmenu enterpriseReportDateWise_menu" href="enterpriseReportDateWise" data-pjax="main-content"><img src="./asserts/images/Icon ionic-ios-flower.png" alt=""/> Daily StockCount Report </a>
										<a className="dropdown-item overall_underover_Submenu inventroy_menu active222" href="all_under_over" data-pjax="main-content"><img src="./asserts/images/Icon ionic-ios-flower.png" alt=""/>Overall underover</a>
									</div>
								</div>
							</div>
						</li>
						<li className="nav-item dropdown has-mega-menu" style={{position: "static"}}>
							<a className="nav-link dropdown-toggle mm_supplychaindashboard supplychain_menu active222" href="asndata" data-pjax="main-content" role="button" aria-haspopup="true" aria-expanded="false"><img src="./asserts/images/Group 21.png" alt=""/> Supply Chain</a>
							<div className="dropdown-menu supplychaindashboardSubmenudropdown"  style={{width: "100%"}}>
								<div className="px-0">
									<div className="CustomsubMenu">
										<a className="dropdown-item asndataSubmenu asndata_menu active222" href="asndata" data-pjax="main-content"><img src="./asserts/images/icons/icon-transfers.png" alt=""/> Transfers </a>
										<a className="dropdown-item goodssummarySubmenu goodssummary_menu active222" href="GoodsSummary" data-pjax="main-content"><img src="./asserts/images/icons/icon-stores.png" alt=""/> GI Summary </a>
										<a className="dropdown-item GoodsStockStoreSubmenu GoodsStockStore_menu active222" href="GoodsStockStore" data-pjax="main-content"><img src="./asserts/images/icons/icon-stores.png" alt=""/> IN-Store GI </a>
										<a className="dropdown-item GoodsStockWareHouseSubmenu GoodsStockWareHouse_menu active222" href="GoodsStockWareHouse" data-pjax="main-content"><img src="./asserts/images/icons/icon-enterprise.png" alt=""/> Warrehouse GI</a>
									</div>
								</div>
							</div>
						</li>
						<li className="nav-item dropdown has-mega-menu"  style={{position: "static"}} >
							<a className="nav-link dropdown-toggle mm_tagit Tagit tagit_menu active222" href="zplprinter_new" data-pjax="main-content" role="button" aria-haspopup="true" aria-expanded="false"><img src="./asserts/images/icon-tag.png" alt=""/> TagIT</a>
							<div className="dropdown-menu mm_tagitSubmenudropdown" style={{width: "100%"}}>
								<div className="px-0">
									<div className="CustomsubMenu">
										<a className="dropdown-item mm_tagitSubmenu zplprinter_menu active222" data-pjax="main-content" href="zplprinter_new"><img src="./asserts/images/icon-dashboard.png" alt=""/> Zpl Printer</a>
										<a className="dropdown-item" data-pjax="main-content" href="zplReport"><img src="./asserts/images/icon-dashboard.png" alt=""/> Zpl Report</a>
										<a className="dropdown-item zplreport_sku_menu active222" data-pjax="main-content" href="zplReport_sku"><img src="./asserts/images/icon-dashboard.png" alt=""/> Zpl Report (Sku)</a>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</nav>

		</header>
    </>
  )
}

export default Header;