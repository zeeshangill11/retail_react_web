import React from 'react'
import { Link } from 'react-router-dom';

function Header() {


	const handleClick = (e) => {
		var new_target = e.target


		/*-----------------------Remove active class --------------------------------------*/
		var nav_link = document.getElementsByClassName('nav-link');
		for (var i = 0, len = nav_link.length; i < len; i++) {
			nav_link[i].classList.remove("active");
		}
		new_target.classList.add('active');

		
		var all_classes = (e.target.className);
		var temp = all_classes.split("mm_");
		var temp2 = temp[1];
		var temp3 = temp2.split(" ");
		var class_name = temp3[0];

		class_name = "mm_" + class_name + "Submenudropdown";
		setTimeout(function () {


			var coll = document.getElementsByClassName('dropdown-menu');
			for (let i = 0, len = coll.length; i < len; i++) {
				coll[i].style.display = 'none';
			}
			document.getElementsByClassName(class_name)[0].style.display = 'block';

			var dropdown_items = document.getElementsByClassName('dropdown-item');
			for (let i = 0, len = dropdown_items.length; i < len; i++) {
				dropdown_items[i].classList.remove("subMenuActive");
			}
			document.querySelector("."+class_name+" .CustomsubMenu > a").classList.add("subMenuActive");



		}, 300);




		//dropdown_items[0].classList.add('subMenuActive');


	}

	const handleClickItem = (e)=>{
		var dropdown_items = document.getElementsByClassName('dropdown-item');
			for (var i = 0, len = dropdown_items.length; i < len; i++) {
				dropdown_items[i].classList.remove("subMenuActive");
			}
			e.target.classList.add('subMenuActive');
	}

	return (
		<>
			<link rel="stylesheet" href="./css/bootstrap.min.css" />

			<link rel="stylesheet" href="./css/dashboard.min.css" />
			<link rel="stylesheet" href="./css/styles.min.css" />
			<link rel="stylesheet" href="./css/responsive.min.css" />
			<link rel="stylesheet" href="./css/all.css" />


			<header className="main-header" style={{ display: "block" }}>
				<nav className="navbar navbar-expand-lg navbar customNav" style={{ visibility: "visible" }}>
					<div className="collapse navbar-collapse" id="navbarNavDropdown">
						<ul className="navbar-nav">
							<li className="nav-item dropdown has-mega-menu" style={{ position: "static" }}>
								<Link className="nav-link dropdown-toggle mm_users nav-link admin_menu active222" to="/dashboard" data-pjax="main-content" role="button" aria-haspopup="true" aria-expanded="false" onClick={handleClick}>
									<img src="./asserts/images/icon-admin.png" alt="" /> Admin</Link>
								<div className="dropdown-menu mm_usersSubmenudropdown" style={{ width: "100%" }} >
									<div className="px-0">
										<div className="CustomsubMenu">
											<Link className="dropdown-item mm_usersSubmenu dashboard_menu active222" data-pjax="main-content" to="/dashboard" onClick={handleClickItem}><img src="./asserts/images/icon-dashboard.png" alt="" /> Dashboard</Link>
											<Link className="dropdown-item mm_usersSubmenuuserinfo userinfo_menu active222" to="/users" data-pjax="main-content" onClick={handleClickItem}><img src="./asserts/images/icon-user.png" alt="" /> Users</Link>
											<Link className="dropdown-item mm_usersSubmenuhandheldDevices device_menu active222" to="/handheldDevices" data-pjax="main-content" onClick={handleClickItem}><img src="./asserts/images/icon-device.png" alt="" /> Devices</Link>
											<Link className="dropdown-item mm_usersSubmenunew_asndata new_asndata_menu active222" to="/transferCancellation" data-pjax="main-content" onClick={handleClickItem}><img src="./asserts/images/icons/icon-transfers.png" alt="" />Transfer Cancelation </Link>
											<Link className="dropdown-item mm_usersSubmenugi_cancellation gi_cancellation_menu" to="/gi_cancellation" data-pjax="main-content" onClick={handleClickItem}><img src="./asserts/images/icons/icon-transfers.png" alt="" />GI Cancelation </Link>
											<Link className="dropdown-item mm_manual_receiving_asnSubmenu manual_receiving_asn_menu active222" to="/manual_receiving_asn" data-pjax="main-content" onClick={handleClickItem}><img src="./asserts/images/icons/role.png" alt="" /> Manual Receiving IBT </Link>
											<Link className="dropdown-item mm_usersSubmenustoreinfo storeinfo_menu active222" to="/storeinfo" data-pjax="main-content" onClick={handleClickItem}><img src="./asserts/images/icon-store.png" alt="" /> Stores</Link>
											<Link className="dropdown-item mm_usersSubmenuprinter printer_menu active222" to="/printerInfo" data-pjax="main-content" onClick={handleClickItem}><img src="./asserts/images/icon-printer.png" alt="" /> Printers</Link>
											<Link className="dropdown-item mm_usersSubmenuzpl zpl_menu active222" to="/zplInfo" data-pjax="main-content" onClick={handleClickItem}><img src="./asserts/images/icon-zpl.png" alt="" /> ZPL</Link>
											<Link className="dropdown-item mm_usersSubmenuAuditInfo auditinfo_menu active222" to="/audit" data-pjax="main-content" onClick={handleClickItem}><img src="./asserts/images/icons/audit.png" alt="" /> Audit</Link>
											<Link className="dropdown-item mm_usersSubmenuibt_difference ibt_difference_menu active222" to="/ibtDifferences" data-pjax="main-content" onClick={handleClickItem}><img src="./asserts/images/icons/role.png" alt="" /> IBT Differences </Link>
											<Link className="dropdown-item mm_usersSubmenuadmin_menu admin_menu_menu active222" to="/admin_menu" data-pjax="main-content" onClick={handleClickItem}><img src="./asserts/images/icons/icon-transfers.png" alt="" /> Admin menu </Link>
											<Link className="dropdown-item mm_usersRolesSubmenu userroles_menu active222" to="/rolesInfo" data-pjax="main-content" onClick={handleClickItem} ><img src="./asserts/images/icons/role.png" alt="" /> Roles</Link>
										</div>
									</div>
								</div>
							</li>
							<li className="nav-item dropdown has-mega-menu" style={{ position: "static" }}>
								<Link className="nav-link dropdown-toggle mm_count count_menu active active222" to="/executiveSummary" data-pjax="main-content" role="button" aria-haspopup="true" aria-expanded="false" onClick={handleClick}><img src="./asserts/images/icon-count.png" alt="" /> Count</Link>
								<div className="dropdown-menu mm_countSubmenudropdown show" style={{ width: "100%" }}>
									<div className="px-0">
										<div className="CustomsubMenu">
											<Link className="dropdown-item mm_countSubmenu executiveSummary_menu subMenuActive active222 active" to="/executiveSummary" data-pjax="main-content"><img src="./asserts/images/icon-dashboard.png" alt="" /> Dashboard</Link>
											<Link className="dropdown-item stockSummarySubmenu operations_menu active222" to="/stockSummary" data-pjax="main-content"><img src="./asserts/images/count/Icon ionic-ios-flower.png" alt="" /> Operation</Link>
											<Link className="dropdown-item inventorybyitemSubmenu inventroy_menu active222" to="/inventorybyitem" data-pjax="main-content"><img src="./asserts/images/icon-inventory.png" alt="" /> Inventory (EPC)</Link>
											<Link className="dropdown-item inventorybyitemSubmenu enterpriseReportDateWise_menu" to="/dailyStockCountReport" data-pjax="main-content"><img src="./asserts/images/Icon ionic-ios-flower.png" alt="" /> Daily StockCount Report </Link>
											<Link className="dropdown-item overall_underover_Submenu inventroy_menu active222" to="/all_under_over" data-pjax="main-content"><img src="./asserts/images/Icon ionic-ios-flower.png" alt="" />Overall underover</Link>
										</div>
									</div>
								</div>
							</li>
							<li className="nav-item dropdown has-mega-menu" style={{ position: "static" }}>
								<Link className="nav-link dropdown-toggle mm_supplychaindashboard supplychain_menu active222" to="/asndata" data-pjax="main-content" role="button" aria-haspopup="true" aria-expanded="false" onClick={handleClick}><img src="./asserts/images/Group 21.png" alt="" /> Supply Chain</Link>
								<div className="dropdown-menu supplychaindashboardSubmenudropdown" style={{ width: "100%" }}>
									<div className="px-0">
										<div className="CustomsubMenu">
											<Link className="dropdown-item asndataSubmenu asndata_menu active222" to="/asndata" data-pjax="main-content"><img src="./asserts/images/icons/icon-transfers.png" alt="" /> Transfers </Link>
											<Link className="dropdown-item goodssummarySubmenu goodssummary_menu active222" to="/GoodsSummary" data-pjax="main-content"><img src="./asserts/images/icons/icon-stores.png" alt="" /> GI Summary </Link>
											<Link className="dropdown-item GoodsStockStoreSubmenu GoodsStockStore_menu active222" to="/GoodsStockStore" data-pjax="main-content"><img src="./asserts/images/icons/icon-stores.png" alt="" /> IN-Store GI </Link>
											<Link className="dropdown-item GoodsStockWareHouseSubmenu GoodsStockWareHouse_menu active222" to="/GoodsStockWareHouse" data-pjax="main-content"><img src="./asserts/images/icons/icon-enterprise.png" alt="" /> Warrehouse GI</Link>
										</div>
									</div>
								</div>
							</li>
							<li className="nav-item dropdown has-mega-menu" style={{ position: "static" }} >
								<Link className="nav-link dropdown-toggle mm_tagit Tagit tagit_menu active222" to="/zplprinter_new" data-pjax="main-content" role="button" aria-haspopup="true" aria-expanded="false" onClick={handleClick}><img src="./asserts/images/icon-tag.png" alt="" /> TagIT</Link>
								<div className="dropdown-menu mm_tagitSubmenudropdown" style={{ width: "100%" }}>
									<div className="px-0">
										<div className="CustomsubMenu">
											<Link className="dropdown-item mm_tagitSubmenu zplprinter_menu active222 subMenuActive" data-pjax="main-content" to="/zplprinter_new"><img src="./asserts/images/icon-dashboard.png" alt="" /> Zpl Printer</Link>
											<Link className="dropdown-item" data-pjax="main-content" to="/zplReport"><img src="./asserts/images/icon-dashboard.png" alt="" /> Zpl Report</Link>
											<Link className="dropdown-item zplreport_sku_menu active222" data-pjax="main-content" to="/zplReport_sku"><img src="./asserts/images/icon-dashboard.png" alt="" /> Zpl Report (Sku)</Link>
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