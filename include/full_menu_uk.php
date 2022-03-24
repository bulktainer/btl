<?php
if($_SESSION['MM_Username'] == 'Jose') : ?>
<div id="nav" class="container_12 rounded">
  <ul class="sf-menu">
    <li class="first-item">
      <a href="<?php echo HOME; ?>Welcome.php">Home</a>
    </li>
    <li>
      <a href="#">Core Data</a>
      <ul>
        <li class="current">
          <a href="<?php echo HOME; ?>brTank.php">Tanks</a>
        </li>
        <!-- 
        <li class="current">
          <a href="<?php // echo HOME; ?>brProd.php">Products</a>
        </li>
         -->
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/products/index">Products</a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#">Job Template</a>
      <ul>
      	 <li>
      		<a href="#">Short Sea Job Template &nbsp;&nbsp;&nbsp;</a>
      		<ul>
      			<li class="current">
		          <a href="<?php echo HOME; ?>erp.php/jobtemplate-quotes/index">Live</a>
		        </li>
		        <li class="current">
		        	<a href="<?php echo HOME; ?>erp.php/jobtemplate-quotes/pending/index">Pending</a>         
		        </li>
		        <li class="current">
		           <a href="<?php echo HOME; ?>erp.php/jobtemplate-quotes/archive/index">Archive</a>
		        </li>
		        <li class="current">
		          <a href="<?php echo HOME; ?>erp.php/jobtemplate-quotes/trash/index">Trash</a>
		        </li>
      		</ul>
      	 </li>
      	 <li>
      		<a href="#">Deep Sea Job Template</a>
      		<ul>
      			<li class="current">
		          <a href="<?php echo HOME; ?>erp.php/jobtemplate-quotes-deepsea/index">Live</a>
		        </li>
		        <li class="current">
		        	<a href="<?php echo HOME; ?>erp.php/jobtemplate-quotes-deepsea/pending/index">Pending</a>         
		        </li>
		        <li class="current">
		           <a href="<?php echo HOME; ?>erp.php/jobtemplate-quotes-deepsea/archive/index">Archive</a>
		        </li>
		        <li class="current">
		          <a href="<?php echo HOME; ?>erp.php/jobtemplate-quotes-deepsea/trash/index">Trash</a>
		        </li>
      		</ul>
      	 </li>
         <li class="current">
          <a href="<?php echo HOME; ?>erp.php/customerancillary/">Customer Surcharges</a>
         </li>
      </ul>
    </li>
    <!-- 
    <li>
      <a href="#">Quotations</a>
      <ul>
        <li class="current">
          <a href="<?php echo HOME; ?>brQuote.php">View</a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#">Jobs</a>
      <ul>
        <li class="current">
          <a href="<?php // echo HOME; ?>brJobs.php">View</a>
        </li>
        <li class="current">
          <a href="<?php // echo HOME; ?>jbmas1.php">Create</a>
        </li>
      </ul>
    </li> 
    -->
    <li>
      <a href="#">Jobs</a>
      <ul>
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/job/live/view">View</a>
        </li>
#        <li class="current">
#          <a href="<?php echo HOME; ?>erp.php/job/create-job">Create</a>
#        </li>
      </ul>
    </li>
    <li>
      <a href="<?php echo HOME; ?>erp.php/tank/">Tank Plan</a>
    </li>
  </ul>
</div>

<?php else : ?>
<div id="nav" class="container_12 rounded">
  <ul class="sf-menu">
    <li class="first-item">
      <a href="<?php echo HOME; ?>Welcome.php">Home</a>
    </li>
    <li>
      <a href="#">Core Data</a>
      <ul>
        <?php 
		//permitted users
        //change app/helper/get_managers() also
      	 $permitted_users_curd = array("leannep","admin", "PaulA", "gary", "david", "graeme","alison","Guido","gerwin","piverson","andread","edoardo","olivia","rebeccar","marco","mhanafin");
     	 if (in_array($_SESSION["MM_Username"], $permitted_users_curd)) :
    	?>
      	<li class="current">
          <a href="<?php echo HOME; ?>erp.php/user/index">Users</a>
        </li>
        <?php endif; ?>
        <!-- 
        <li class="current">
          <a href="<?php // echo HOME; ?>brCustomer.php?f__ff_customer_is_archived=0&f__ff_onSUBMIT_FILTER=Search">Customers</a>
        </li>
         -->
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/customer/index">Customers</a>
        </li>
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/customer/customergroupindex">Customer Groups</a>
        </li>
        <!-- 
        <li class="current">
          <a href="<?php echo HOME; ?>brSupplier.php?f__ff_supplier_is_archived=0&f__ff_onSUBMIT_FILTER=Search">Suppliers</a>
        </li>
     	-->
        <li class="current">
          <a href="<?php  echo HOME; ?>erp.php/supplier-core/index">Suppliers</a>
        </li>
        <!-- 
        <li class="current">
          <a href="<?php // echo HOME; ?>brActivity.php">Activities</a>
        </li>
         -->
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/activity/index">Activities</a>
        </li>
        <!-- 
        <li class="current">
          <a href="<?php // echo HOME; ?>brCurrency.php">Currency</a>
        </li>
         -->
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/currencies/index">Currency</a>
        </li>
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/bank-accounts/">Bank Accounts</a>
        </li>
        <!-- <li class="current">
          <a href="<?php // echo HOME; ?>brAddr.php">Addresses</a>
        </li> -->
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/address/index">Addresses</a>
        </li>
        <!-- 
        <li class="current">
          <a href="<?php echo HOME; ?>brCountry.php">Country</a>
        </li>
         -->
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/country/index">Country</a>
        </li>
        <li class="current">
          <a href="<?php echo HOME; ?>brTank.php?f__ff_tank_is_archived=0&f__ff_onSUBMIT_FILTER=Search">Tanks</a>
        </li>
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/tank-core-new/index">Tank new</a>
        </li>
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/tank_master/tank-data-list">Tank Data</a>
        </li>
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/tank-core/index">Tank Master</a>
        </li>
        <!-- 
        <li class="current">
          <a href="<?php // echo HOME; ?>brProd.php">Products</a>
        </li>
         -->
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/products/index">Products</a>
        </li>
        <!-- 
        <li class="current">
          <a href="<?php // echo HOME; ?>core-contacts.php">Contacts</a>
        </li>
         -->
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/contact/index">Contacts</a>
        </li>
        <!-- 
        <li class="current">
          <a href="<?php // echo HOME; ?>exchange-rates.php">Exchange Rates</a>
        </li>
         -->
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/exchange-rate/index">Exchange Rates</a>
        </li>
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/suppliers/">Supplier Ancillary Rates</a>
        </li>
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/supplier-costs/">Supplier Rates</a>
        </li>
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/supplier-costs/import/rates">Supplier Rates Import</a>
        </li>
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/supplier-invoices/">Supplier Invoices</a>
        </li>
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/vgm-route/">VGM Route</a>
        </li>
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/supplier-route/">Supplier Route Emails</a>
        </li>
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/invoicing-responsibility-code/index">Invoicing Responsibility Code</a>
        </li>
      </ul>
    </li>
    <?php if ($_SESSION['MM_Username'] != 'Mitchell') : ?>
    <li>
      <a href="#">Sales Quotes</a>
      <ul>
        <li class="current" style="width: 16.5em;">
          <a href="#">Short Sea Customer Quotes</a>
          	<ul>
      			<li class="current">
		          <a href="<?php echo HOME; ?>erp.php/customer-quotes/live/index">Live</a>
		        </li>
		         <li class="current">
		           <a href="<?php echo HOME; ?>erp.php/customer-quotes/archive/index">Archive</a>
		        </li>
		   </ul>
        </li>
        <li class="current">
          <a href="#">Deep Sea Customer Quotes</a>
          <ul>
      			<li class="current">
		          <a href="<?php echo HOME; ?>erp.php/customer-quotes/deep-sea/live/index">Live</a>
		        </li>
		         <li class="current">
		           <a href="<?php echo HOME; ?>erp.php/customer-quotes/deep-sea/archive/index">Archive</a>
		        </li>
		   </ul>
        </li>
      </ul>
    </li>
     <li>
      <a href="#">Job Template</a>
      <ul>
      	 <li>
      		<a href="#">Short Sea Job Template &nbsp;&nbsp;&nbsp;</a>
      		<ul>
      			<li class="current">
		          <a href="<?php echo HOME; ?>erp.php/jobtemplate-quotes/index">Live</a>
		        </li>
		        <li class="current">
		        	<a href="<?php echo HOME; ?>erp.php/jobtemplate-quotes/pending/index">Pending</a>         
		        </li>
		        <li class="current">
		           <a href="<?php echo HOME; ?>erp.php/jobtemplate-quotes/archive/index">Archive</a>
		        </li>
		        <li class="current">
		          <a href="<?php echo HOME; ?>erp.php/jobtemplate-quotes/trash/index">Trash</a>
		        </li>
      		</ul>
      	 </li>
      	 <li>
      		<a href="#">Deep Sea Job Template</a>
      		<ul>
      			<li class="current">
		          <a href="<?php echo HOME; ?>erp.php/jobtemplate-quotes-deepsea/index">Live</a>
		        </li>
		        <li class="current">
		        	<a href="<?php echo HOME; ?>erp.php/jobtemplate-quotes-deepsea/pending/index">Pending</a>         
		        </li>
		        <li class="current">
		           <a href="<?php echo HOME; ?>erp.php/jobtemplate-quotes-deepsea/archive/index">Archive</a>
		        </li>
		        <li class="current">
		          <a href="<?php echo HOME; ?>erp.php/jobtemplate-quotes-deepsea/trash/index">Trash</a>
		        </li>
      		</ul>
      	 </li>
         <li class="current">
          <a href="<?php echo HOME; ?>erp.php/customerancillary/">Customer Surcharges</a>
         </li>
      </ul>
    </li>
    <!-- 
    <li>
      <a href="#">Quotations</a>
      <ul>
        <li class="current">
          <a href="<?php //echo HOME; ?>brQuote.php">View</a>
        </li>
        <li class="current">
          <a href="<?php //echo HOME; ?>qtmas1.php">Create</a>
        </li>
        <li class="current">
          <a href="<?php //echo HOME; ?>quote-archive.php">Archive</a>
        </li>
        <li class="current">
          <a href="<?php // echo HOME; ?>quote-trash.php">Trash</a>
        </li>
      </ul>
    </li>
     -->
    <?php endif; ?>
    <!-- 
    <li>
      <a href="#">Jobs</a>
      <ul>
        <li class="current">
          <a href="<?php //echo HOME; ?>brJobs.php">View</a>
        </li>
        <li class="current">
          <a href="<?php //echo HOME; ?>jbmas1.php">Create</a>
        </li>
        <li class="current">
          <a href="<?php //echo HOME; ?>job-archive.php">Archive</a>
        </li>
         
      </ul>
    </li> 
     -->
    <li>
     <a href="#">Jobs</a>
      <ul>
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/job/live/view">View</a>
        </li>
<!--        <li class="current">
          <a href="<?php // echo HOME; ?>erp.php/job/create-job">Create</a>
        </li>
-->
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/job/archive/view">Archive</a>
        </li>
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/demtk/index">Recharge DEMTK</a>
       </li>
      </ul>
    </li>
    
    <li>
      <a href="#">Purchase Orders</a>
      <ul>
     <!--  <li class="current">
          <a href="<?php echo HOME; ?>erp.php/non-job-activity/">Non Job PO Activity</a>
        </li>  -->
        
      	<li>
      		<a href="#">Purchase Order Template &nbsp;&nbsp;</a>
      		<ul>
        		<li class="current">
          		<a href="<?php echo HOME; ?>erp.php/potemplate/poindex">Live</a>
        	</li>
        	<li class="current">
          		<a href="<?php echo HOME; ?>erp.php/potemplate/archive/poindex">Archive</a>
        	</li>
        	</ul>
        </li>
        <li>
          <a href="#">Purchase Order &nbsp;&nbsp;</a>
      		<ul>
        		<li class="current">
          		<a href="<?php echo HOME; ?>erp.php/purchase_order/index">Live</a>
        	</li>
        	<li class="current">
          		<a href="<?php echo HOME; ?>erp.php/purchase_order/archive/index">Archive</a>
        	</li>
        	<li class="current">
          		<a href="<?php echo HOME; ?>erp.php/purchase_order/trash/index">Trash</a>
        	</li>
        	<?php
          $po_users = array( 'admin', 'gayleb', 'gary', 'jchris','david','jwebster','PaulA','marcj','graeme','pelthe','csmith','bhessing','cjessop','milski');
          if(in_array($_SESSION['MM_Username'], $po_users)) { ?>
         <li class="current">
          <a href="<?php echo HOME; ?>erp.php/purchase/purchasegroupindex">Purchase Order Data</a>
        </li>
        <?php } ?>
        	</ul>
        </li>
      </ul>
    </li>
    <li>
      <a href="#">BTT</a>
      <ul>
      <li>
          <a href="#">Equipment PO &nbsp;&nbsp;</a>
      		<ul>
        		<li class="current">
          		<a href="<?php echo HOME; ?>erp.php/purchase_order/index?category=Eqmt">Live</a>
        	</li>
        	<li class="current">
          		<a href="<?php echo HOME; ?>erp.php/purchase_order/archive/index?category=Eqmt">Archive</a>
        	</li>
        	<li class="current">
          		<a href="<?php echo HOME; ?>erp.php/purchase_order/trash/index?category=Eqmt">Trash</a>
        	</li>
        	
        	</ul>
        </li>
        <li>
      		<a href="#">Equipment Template &nbsp;&nbsp;</a>
      		<ul>
        		<li class="current">
          		<a href="<?php echo HOME; ?>erp.php/potemplate/poindex?category=Eqmt">Live</a>
        	</li>
        	<li class="current">
          		<a href="<?php echo HOME; ?>erp.php/potemplate/archive/poindex?category=Eqmt">Archive</a>
        	</li>
        	</ul>
        </li>
      	<li class="current">
          <a href="<?php echo HOME; ?>erp.php/equipment/index">Equipment Master</a>
        </li>
        <?php
          $po_users = array( 'admin', 'gayleb', 'gary', 'jchris','david','jwebster','PaulA','marcj','graeme','pelthe','csmith','bhessing','cjessop','milski');
          if(in_array($_SESSION['MM_Username'], $po_users)) { ?>
         <li class="current">
          <a href="<?php echo HOME; ?>erp.php/purchase/purchasegroupindex?category=Eqmt&group-name=po_subtype">Equipment Data</a>
        </li>
        <?php } ?>
      	
        
      </ul>
    </li>
    <li>
      <a href="<?php echo HOME; ?>erp.php/tank/">Tank Plan</a>
    </li>
    <li>
      <a href="#">Reports</a>
      <ul>
        <!-- <li class="current">
          <a href="<?php  // echo HOME; ?>erp.php/metabase/index">Metabase Report</a>
        </li> -->
        <li class="current">
          <a href="<?php echo HOME; ?>repVolume.php">Volume</a>
        </li>
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/job-performance-report/index">Job Performance</a>
        </li>
        <li class="current">
          <a href="<?php echo HOME; ?>report-accruals.php">Accruals</a>
        </li>
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/accruals/index">Accruals New</a>
        </li>
        <?php
          $allowed_users = array('lagullo', 'wjin', 'admin', 'rchevalier', 'gayleb', 'david', 'gary', 'alison', 'karen', 'milski', 'steph', 'nadiner', 'bpine', 'srutherford','hreveley');
          if(in_array($_SESSION['MM_Username'], $allowed_users)) { ?>
          <li class="current">
            <a href="<?php echo HOME; ?>report-tank-performance.php">Tank Performance</a>
          </li>
          <li class="current">
            <a href="<?php echo HOME; ?>report-tank-performance-rev1.php">Tank Performance New</a>
          </li>
         <!--  <li class="current">
            <a href="<?php // echo HOME; ?>erp.php/tank-performance/index">Tank Performance V1</a>
          </li> -->
          <li class="current">
            <a href="<?php echo HOME; ?>report-supplier-costs.php">Supplier rates</a>
          </li>
          <!-- <li class="current">
            <a href="<?php // echo HOME; ?>erp.php/supplier-report/index">Supplier rates New</a>
          </li> -->
          <li class="current">
            <a href="<?php echo HOME; ?>report-supplier-performance.php">Supplier performance</a>
          </li>
          <li class="current">
            <a href="<?php echo HOME; ?>report-accounts-export.php">Accounts export</a>
          </li>
           <li class="current">
            <a href="<?php echo HOME; ?>erp.php/account-export/account-report">Accounts export New</a>
          </li>
          <li class="current">
            <a href="<?php echo HOME; ?>report-accounts-export-costs.php">Accounts export - Costs</a>
          </li>
          <!-- <li class="current">
            <a href="<?php // echo HOME; ?>erp.php/account-export-costs/index">Accounts export - Costs New</a>
          </li> -->
          <li class="current">
            <a href="<?php echo HOME; ?>report-invoices.php">Invoice report</a>
          </li>
        <?php } ?>
        
        <!--  <li class="current">
            <a href="<?php  // echo HOME; ?>erp.php/demtk-revenue-report/">DEMTK Revenue Report</a>
        </li> -->
        <li class="current">
            <a href="<?php  echo HOME; ?>erp.php/demtk-revenue-report/index?rev=1">DEMTK Revenue Report (New)</a>
        </li>
        <?php 
            //User permission to this report
            //modified DM-05-jun-2017
            // new users(piverson,andread,edoardo,olivia,alison,marco)
	        //add new user Leanne Pilkington DM-13-Sep-2017
	        //change app/helper/get_managers() also
      $permitted_users = array("lagullo", "mmorley", "pwood", "rhimsworth", "ahoetzinger", "cfraser", "marcj","jwebster", "leannep","admin", "PaulA", "gary", "david", "graeme","alison","Guido","gerwin","piverson","andread","edoardo","olivia","rebeccar","marco","mhanafin","RebeccaP","ageers","emilyt","rhughes");
      if (in_array($_SESSION["MM_Username"], $permitted_users)) :
    ?>
          <!--  <li class="current">
            <a href="<?php // echo HOME; ?>erp.php/business-overview-report/">Business Overview Report</a>
          </li> -->
          <li class="current">
            <a href="<?php echo HOME; ?>erp.php/business-overview-report/indexNew">Business Overview Report (New)</a>
          </li>
        <?php endif; ?>
          <li class="current">
			<a href="<?php echo HOME; ?>erp.php/job-template-report/">Job Template Report</a>
		</li>
		<li class="current">
			<a href="<?php echo HOME; ?>erp.php/supplier-route-compare/">Supplier Rate Comparisons</a>
		</li>
		<li class="current">
			<a href="<?php echo HOME; ?>erp.php/status-report/">Status Report</a>
		</li>
		<li class="current">
			<a href="<?php echo HOME; ?>erp.php/internal-status-report/">Internal Status Report</a>
		</li>
		<!-- <li>
      <a href="<?php // echo HOME; ?>erp.php/kickback-report/">Kickback Report</a>
    </li> !-->
    <li>
      <a href="<?php echo HOME; ?>erp.php/kickback-report/report">Kickback Report</a>
    </li>
        <li>
            <a href="<?php echo HOME; ?>erp.php/invoice-performance-report/">Invoice Performance Report</a>
        </li>
        <li>
            <a href="<?php echo HOME; ?>erp.php/common-backend/job-load-index">Job Info (Load)</a>
        </li>
        <li>
            <a href="<?php echo HOME; ?>erp.php/missing-tanks-report/">Missing Tanks Report</a>
        </li>
      </ul>
    </li>
     <li>
      <a href="#">M&R</a>
      <ul>
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/status-report/test-data">Test Data</a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#">GPS</a>
      <ul>
        <li class="current">
          <a href="<?php echo HOME; ?>erp.php/gps-settings/dashboard">Dashboard</a>
        </li>
      </ul>
    </li>
  </ul>
</div>

<?php endif; ?>

<input type="hidden" value="<?php echo HOME; ?>images/ajax-loader-large.gif" name="big_loader_path" class="big_loader_path" />
