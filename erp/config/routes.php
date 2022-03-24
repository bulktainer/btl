<?php

on("GET", "/", function() {
  // redirect("/".BTL_URL_PREFIX."erp.php/supplier-costs/index");
  redirect("/".BTL_URL_PREFIX."Welcome.php");
});

on("GET", "/login", function() {
    $controller = new LoginController();
    $controller->index();
});

on("GET", "/:controller", function() {
  redirect("/".BTL_URL_PREFIX."erp.php/".params("controller")."/index");
});
/*
 *
 *on("GET", "/:controller/:id/:action", function() {
 *  $controller = BaseController::get_name(params("controller"));
 *  $id = params("id");
 *  $action = params("action");
 *  $c = new $controller();
 *  $c->$action($id);
 *});
 *
 *on("GET", "/:controller/:action", function() {
 *  $controller = BaseController::get_name(params("controller"));
 *  $action = params("action");
 *  $c = new $controller();
 *  $c->$action();
 *});
 *
 *on("POST", "/:controller", function() {
 *  $controller = BaseController::get_name(params("controller"));
 *  $c = new $controller();
 *  $c->create();
 *});
 */

//login form route 
prefix("auth", function() {
  on("GET", "/login", function() {
    $controller = new LoginController();
    $controller->index();
  });
  on("GET", "/login/:auth", function() {
    $controller = new LoginController();
    $auth = params("auth");
    $controller->index($auth);
  });
  on("POST", "/authenticate", function() {
    $controller = new LoginController();
    $controller->authentication();
  });
  on("GET", "/logout", function() {
    $controller = new LoginController();
    $controller->logout();
  });
  on("GET", "/:user_id/reset-password", function() {
    $controller = new LoginController();
    $user_id = params('user_id');
    $controller->resetPassword($user_id);
  });
  on("POST", "/save-password", function() {
    $controller = new LoginController();
    $controller->savePassword();
  });
  on("POST", "/common-ajax", function() {
    $controller = new LoginController();
    $controller->commonAjax();
  });
  on("GET", "/forgot-password", function() {
    $controller = new LoginController();
    $controller->forgotPassword();
  });
  on("GET", "/change-password/:token", function() {
    $controller = new LoginController();
    $token = params('token');
    $controller->changePassword($token);
  });
  on("GET", "/scan-tfa-qr/:token", function() {
    $controller = new LoginController();
    $token = params("token");
    $controller->scanTfaQr($token);
  });
  on("POST", "/set-qr-scanned-flag", function() {
    $controller = new LoginController();
    $controller->scanTfaQr();
  });
  on("GET", "/scan-tfa-qr/:token/:auth", function() {
    $controller = new LoginController();
    $token = params("token");
    $auth = params("auth");
    $controller->scanTfaQr($token,$auth);
  });
});
	
prefix("", function() {
  // Upload file and create attachment
	on("POST", "/upload", function() {
    $controller = new FilesController();
    $controller->upload();
  });
  on("POST", "/has-session", function() {
    $controller = new LoginController();
    $controller->hasSession();
  });
});

// Delete file and attachment
on("POST", "/delete-attachment-and-file", function() {
  $controller = new FilesController();
  $controller->deleteAttachmentAndFile();
});

// Suppliers routes -----------------------------------------------------------
prefix("suppliers", function() {

  // Index
  on("GET", "/index", function() {
    $controller = new SuppliersController();
    $controller->index();
  });

  // New
  on("GET", "/add", function() {
    $controller = new SuppliersController();
    $controller->add();
  });

  // Create
  on("POST", "/add/:total_supplier_extras", function() {
    $controller = new SuppliersController();
    $total_supplier_extras = params("total_supplier_extras");
    $controller->create($total_supplier_extras);
  });

  // Edit
  on("GET", "/:supplier_id/edit", function() {
    $controller = new SuppliersController();
    $supplier_id = params("supplier_id");
    $form = 'edit';
    $controller->edit($supplier_id, $form);
  });

  // Fuel Surcharges
  on("GET", "/:supplier_id/fuel-surcharges", function() {
    $controller = new SuppliersController();
    $supplier_id = params("supplier_id");
    $controller->fuel_surcharges($supplier_id);
  });

  // Update
  on("POST", "/:supplier_id/update/:total_supplier_extras", function() {
    $controller = new SuppliersController();
    $supplier_id = params("supplier_id");
    $total_supplier_extras = params("total_supplier_extras");
    $controller->update($supplier_id, $total_supplier_extras);
  });

  // Delete
  on("POST", "/:supplier_id/delete", function() {
    $supplier_id = params("supplier_id");
    $controller = new SuppliersController();
    $controller->delete($supplier_id);
  });

  // Extras
  on("GET", "/extra/:extra_id", function() {
    $extra_id = params("extra_id");
    $controller = new SuppliersController();
    $controller->extra($extra_id);
  });

  // Extras add supplier extra
  on("POST", "/add-edit-supplier-extra", function() {
  	$controller = new SuppliersController();
  	$controller->add_edit_supplier_extra();
  });
  
  // Extras delete supplier extra
  on("POST", "/delete-supplier-extra", function() {
  	$extra_cost_id = params("id");
  	$controller = new SuppliersController();
  	$controller->delete_supplier_extra($extra_cost_id);
  });
  
  // Fuel Surcharges
  on("GET", "/:supplier_id&:transport_mode/supplier-costs", function() {
    $supplier_id = params("supplier_id");
    $transport_mode = params("transport_mode");
    $controller = new SuppliersController();
    $controller->supplier_costs($supplier_id, $transport_mode);
  });

  // Save Fuel Surcharges
  on("POST", "save-supplier-costs", function() {
    $controller = new SuppliersController();
    $controller->save_supplier_costs();
  });
	
	// Upload file and create attachment
	on("POST", "/upload", function() {
    $controller = new FilesController();
    $controller->upload();
  });
	
	// Delete file and attachment
  on("POST", "/delete-attachment-and-file", function() {
    $controller = new FilesController();
    $controller->deleteAttachmentAndFile();
  });
	
	// Generate a list of attachments for a supplier costs extra
  on("POST", "/generate-attachment-table-rows", function() {
    $controller = new FilesController();
    $controller->generateAttachmentTableRows();
  });

});

// Supplier Costs routes ------------------------------------------------------
prefix("supplier-costs", function() {

  // Index
  on("GET", "/index", function() {
    $controller = new SupplierCostsController();
    $controller->index();
  });

  // Create
  on("POST", "/index", function() {
    $controller = new SupplierCostsController();
    $id = params('id');
    empty($id) ? $controller->create() : $controller->update($id);
  });

  // Show
  on("GET", "/:route_id/show", function() {
    $controller = new SupplierCostsController();
    $route_id = params("route_id");
    $controller->show($route_id);
  });

  // Edit
  on("GET", "/:route_id/edit", function() {
    $controller = new SupplierCostsController();
    $route_id = params("route_id");
    $form = 'edit';
    $controller->edit($route_id, $form);
  });

  // Duplicate
  on("GET", "/:route_id/duplicate", function() {
    $controller = new SupplierCostsController();
    $route_id = params("route_id");
    $form = 'duplicating';
    $controller->edit($route_id, $form);
  });

  // Update
  on("POST", "/:supplier_cost_id/update", function() {
    $controller = new SupplierCostsController();
    $supplier_cost_id = params("supplier_cost_id");
    $controller->update($supplier_cost_id);
  });

  // Delete
  on("POST", "/:supplier_cost_id/delete", function() {
    $supplier_cost_id = params("supplier_cost_id");
    $controller = new SupplierCostsController();
    $controller->delete($supplier_cost_id);
  });

  // Get Transport Mode
  on("GET", "/:transport_mode", function() {
    $controller = new SupplierCostsController();
    $transport_mode = params("transport_mode");
    $controller->get($transport_mode);
  });

  // export supplier city to excel
  // DM-01-Feb-2016
  on("GET", "/:transport_mode/export_city", function() {
  	$controller = new SupplierCostsController();
  	$transport_mode = params("transport_mode");
  	$controller->exportCity($transport_mode);
  });
  
  // New
  on("GET", "/:transport_mode/add", function() {
    $controller = new SupplierCostsController();
    $transport_mode = params("transport_mode");
    $controller->add($transport_mode);
  });

  // Create
  on("POST", "/add", function() {
    $controller = new SupplierCostsController();
    $controller->create();
  });

  on("GET", "/csv/exportStatus", function() {
    $transport_mode =$_GET;
    $controller = new SupplierCostsController();
    $controller->exportStatus($transport_mode);
  });

  // Import
  on("GET", "/import/rates", function() {
    $controller = new SupplierCostsController();
    $controller->import();
  });

  // Process import
  on("POST", "/process_import", function() {
    $params = array(
      'supplier_id' => params('supplier'),
      'transport_mode_id' => params('transport_mode'),
      'file' => files('file'),
      '_archive_all' => params('_archive_all'));
    $controller = new SupplierCostsController();
    $controller->process_import($params);
  });

  // Search
  on("POST", "/search", function() {
    $controller = new SupplierCostsController();
    $controller->search();
  });

  // Extras
  on("GET", "/extras/:supplier_id&:customer_quote_id&:supplier_cost_id&:cqoute_currency", function() {
    $supplier_id = params("supplier_id");
    $customer_quote_id = params("customer_quote_id");
    $supplier_cost_id = params("supplier_cost_id");
    $controller = new SupplierCostsController();
    $extraArray['cqoute_currency'] = params("cqoute_currency");
    $controller->extras($supplier_id, $customer_quote_id, $supplier_cost_id,$extraArray);
  });

	// Upload cost file
	on("POST", "/upload", function() {
    $controller = new SupplierCostsController();
    $controller->upload();
  });
  // Upload common cost files
  on("POST", "/commonUpload", function() {
    $controller = new SupplierCostsController();
    $controller->commonUpload();
  });

	// Delete cost file
  on("POST", "/deleteFile", function() {
    $controller = new SupplierCostsController();
    $controller->deleteFile();
  });
	
	// Extras
  on("GET", "/supplier-cost-files-info/:supplier_cost_id", function() {
    $supplier_cost_id = params("supplier_cost_id");
    $controller = new SupplierCostsController();
    $controller->supplier_cost_files_info($supplier_cost_id);
  });

  on("POST", "/common_ajax", function() {
    $controller = new SupplierCostsController();
    $controller->commonAjax();
  });

});

// Customer Quotes routes ------------------------------------------------------
prefix("customer-quotes", function() {

  // Index
  on("GET", "/:status/index", function() {
    $controller = new CustomerQuotesController();
    $quote_type = "short-sea";
    $status = params("status");
    $controller->index($quote_type,$status);
  });
  
  // Deep Sea Index
  on("GET", "/deep-sea/:status/index", function() {
  	$controller = new CustomerQuotesController();
  	$quote_type = "deep-sea";
  	$status = params("status");
  	$controller->index($quote_type,$status);
  });

  // Show
  on("GET", "/:route_id/show", function() {
    $controller = new CustomerQuotesController();
    $route_id = params("route_id");
    $controller->show($route_id);
  });

  // Edit
  on("GET", "/:cstatus/:route_id/edit", function() {
    $controller = new CustomerQuotesController();
    $route_id = params("route_id");
    $quote_type = "short-sea";
    $form = 'edit';
    $cstatus = params("cstatus");
    $controller->edit($form, $route_id,$quote_type,$cstatus);
  });

  on("GET", "/deep-sea/:cstatus/:route_id/edit", function() {
    $controller = new CustomerQuotesController();
    $route_id = params("route_id");
    $quote_type = "deep-sea";
    $form = 'edit';
    $cstatus = params("cstatus");
    $controller->edit($form, $route_id,$quote_type,$cstatus);
  });
  
  // Duplicate
  on("GET", ":ctype/:route_id/duplicate", function() {
    $controller = new CustomerQuotesController();
    $route_id = params("route_id");
    $ctype = params("ctype");
    $quote_type = "short-sea";
    $form = 'duplicating';
    $controller->edit($form, $route_id,$quote_type,$ctype);
  });
  
  on("GET", "/deep-sea/:cstatus/:route_id/duplicate", function() {
    $controller = new CustomerQuotesController();
    $route_id = params("route_id");
    $cstatus = params("cstatus");
    $quote_type = "deep-sea";
    $form = 'duplicating';
    $controller->edit($form, $route_id,$quote_type,$cstatus);
  });

  // Update
  on("POST", "/:cstatus/:customer_quote_id/update", function() {
    $customer_quote_id = params("customer_quote_id");
    $quote_type = "short-sea";
    $controller = new CustomerQuotesController();
    $cstatus = params("cstatus");
    $controller->update($customer_quote_id,$quote_type,$cstatus);
  });
  
  on("POST", "/deep-sea/:cstatus/:customer_quote_id/update", function() {
    $customer_quote_id = params("customer_quote_id");
    $quote_type = "deep-sea";
    $controller = new CustomerQuotesController();
    $cstatus = params("cstatus");
    $controller->update($customer_quote_id,$quote_type,$cstatus);
  });

  // Delete
  on("POST", "/:cstatus/:customer_quote_id/delete", function() {
    $customer_quote_id = params("customer_quote_id");
    $cstatus = params('cstatus');
    $quote_type = "short-sea";
    $controller = new CustomerQuotesController();
    $controller->delete($customer_quote_id,$quote_type,$cstatus);
  });
  
  on("POST", "/deep-sea/:cstatus/:customer_quote_id/delete", function() {
    $customer_quote_id = params("customer_quote_id");
    $cstatus = params("cstatus");
    $quote_type = "deep-sea";
    $controller = new CustomerQuotesController();
    $controller->delete($customer_quote_id,$quote_type,$cstatus);
  });

  // New
  on("GET", "/:cstatus/add", function() {
    $controller = new CustomerQuotesController();
    $form = 'add';
    $quote_type = "short-sea";
    $cstatus = params("cstatus");
    $controller->add($form,$quote_type,$cstatus);
  });

  // Deep sea New
  on("GET", "/deep-sea/:cstatus/add", function() {
  	$controller = new CustomerQuotesController();
  	$form = 'add';
  	$quote_type = "deep-sea";
  	$cstatus = params("cstatus");
  	$controller->add($form,$quote_type,$cstatus);
  });
  
  // Create
  on("POST", "/:cstatus/add", function() {
  	$quote_type = "short-sea";
    $controller = new CustomerQuotesController();
    $cstatus = params("cstatus");
    $controller->create($quote_type,$cstatus);
  });
  
  on("POST", "/deep-sea/:cstatus/add", function() {
  	$quote_type = "deep-sea";
    $controller = new CustomerQuotesController();
    $cstatus = params("cstatus");
    $controller->create($quote_type,$cstatus);
  });

  // Export
  on("GET", "/export-quote/:customer_id", function() {
  	$customer_id = params("customer_id");
  	$controller = new CustomerQuotesController();
  	$controller->export_quote($customer_id);
  });

  on("POST", "/export-quote/quotes", function() {
    $controller = new CustomerQuotesController();
    $controller->export_selected_quote();
  });
  
  on("POST", "/export-quote-ajax/:customer_id", function() {
    
  	$customer_id = params("customer_id");
  	$controller = new CustomerQuotesController();
  	$controller->export_quote_ajax($customer_id);
  });
  //for selected quotes
  on("POST", "/export-selected-quote-ajax", function() {
  	$controller = new CustomerQuotesController();
  	$controller->export_quote_ajax("");
  });
  
  on("POST", "/deep-sea/export-quote-ajax/:customer_id", function() {

  	$customer_id = params("customer_id");
  	$controller = new CustomerQuotesController();
  	$controller->deep_sea_export_quote_ajax($customer_id);
  });

    
  on("POST", "/deep-sea/export-selected-quote-ajax", function() {

  	$controller = new CustomerQuotesController();
  	$controller->deep_sea_export_quote_ajax("");
  });
  
  // Export to excel
  on("POST", "/export_quote_excel", function() {
  	$controller = new CustomerQuotesController();
  	$controller->export_quote_excel();
  });
  
  // Export to pdf
  on("POST", "/export-quote-pdf", function() {
  	$controller = new CustomerQuotesController();
  	$controller->export_quote_pdf();
  });
  
  on("GET", "/customer-quotes-files-info/:customer_quote_id", function() {
  	$customer_quote_id = params("customer_quote_id");
  	$controller = new CustomerQuotesController();
  	$controller->customer_quotes_files_info($customer_quote_id);
  });
  
  // Delete cost file
  on("POST", "/deleteFile", function() {
  	$controller = new CustomerQuotesController();
  	$controller->deleteFile();
  });
  
  // Extras
  on("GET", "/customer-quote-cost-info/:customer_quote_id&:quote_type", function() {
    $customer_quote_id = params("customer_quote_id");
    $quote_type = params("quote_type");
    $controller = new CustomerQuotesController();
    $controller->customer_quote_cost_info($customer_quote_id,$quote_type);
  });
    
  on("GET", "/customer-quote-cost-info/:customer_quote_id", function() {
    $customer_quote_id = params("customer_quote_id");
    $controller = new CustomerQuotesController();
    $controller->customer_quote_cost_info($customer_quote_id,'short-sea');
  });
  
  on("POST", "/rate-feedback-update/:customer_quote_id", function() {
  	$customer_quote_id = params("customer_quote_id");
  	$controller = new CustomerQuotesController();
  	$controller->rate_feedback_update($customer_quote_id);
  });
  // common ajax
  on("POST", "/common_ajax", function() {
  	$controller = new CustomerQuotesController();
  	$controller->commonAjax();
  });
  
  on("POST", "/customer-add", function() {
      $controller = new CustomerController();
      $controller->addCustomerForQuote();
  });

  on("GET", "/product-documents/:document_type/:quote_id", function(){
    $controller = new CustomerQuotesController();
    $controller->createDocuments(params('document_type'), params('quote_id'));
  });
  on("POST", "/product-documents/:document_type/:quote_id", function(){
    $controller = new CustomerQuotesController();
    $controller->generatePdf(params('document_type'), params('quote_id'));
  });
});

// Job Costs  ------------------------------------------------------
prefix("files", function() {
	
   // Delete file and attachment
  on("POST", "/deleteUploadedFile", function() {
    $controller = new FilesController();
    $controller->deleteUploadedFile();
  });
	
});

// Supplier Costs routes ------------------------------------------------------
prefix("routes", function() {

});

// Products routes ------------------------------------------------------------
prefix("products", function() {
  on("GET", "/:product_id/imo_check", function() {
    $product_id = params("product_id");
    $controller = new ProductsController();
    $controller->imo_check($product_id);
  });
  
  //DM-04-May-2017 Rewrite product page start---------------
  on("GET", "/index", function() {
  	$controller = new ProductsController();
  	$controller->index();
  });
  
  on("GET", "/create", function() {
  	$controller = new ProductsController();
  	$form = 'add';
  	$controller->create($form);
  });
  
  on("POST", "/add", function() {
  	$controller = new ProductsController();
  	$form = 'add';
  	$controller->add($form);
  });
  
  on("GET", "/:prod_id/edit", function() {
  	$controller = new ProductsController();
  	$form = 'edit';
  	$prod_id = params("prod_id");
  	$controller->edit($form,$prod_id);
  });
  
  on("POST", "/:prod_id/update", function() {
  	$controller = new ProductsController();
  	$prod_id = params("prod_id");
  	$controller->update($prod_id);
  });
  
  on("POST", "/delete", function() {
  	$controller = new ProductsController();
  	$controller->delete();
  });
  // common ajax
  on("POST", "/common_ajax", function() {
  	$controller = new ProductsController();
  	$controller->commonAjax();
  });
  // write data from db
  on("GET", "/:doc_id/writedoc", function() {
  	$controller = new ProductsController();
  	echo $doc_id = params("doc_id");
	$controller->writedoc($doc_id);
  });
  on("POST", "/upload", function() {
  	$controller = new ProductsController();
  	$controller->upload();
  });
  on("GET", "/product-validity-notification", function() {
  	$controller = new ProductsController();
  	$controller->productValidityJob();
  });
  //DM-04-May-2017 Rewrite product page end---------------
});

// Customer routes ------------------------------------------------------------
prefix("customer", function() {
	
	//Edit
	on("GET", "/short-sea/:cust_id/edit", function() {
		$controller = new CustomerController();
		$cust_id = params("cust_id");
		$quote_type = "short-sea";
		$controller->edit($cust_id, $quote_type);
	});
	
	on("GET", "/deep-sea/:cust_id/edit", function() {
		$controller = new CustomerController();
		$cust_id = params("cust_id");
		$quote_type = "deep-sea";
		$controller->edit($cust_id, $quote_type);
	});
	
	on("GET", "/terms-ajax/short-sea/:cust_id", function() {
		$cust_id = params("cust_id");
		$quote_type = "short-sea";
		$controller = new CustomerController();
		$controller->terms_ajax($cust_id, $quote_type);
	});
	
	on("GET", "/terms-ajax/deep-sea/:cust_id", function() {
		$cust_id = params("cust_id");
		$quote_type = "deep-sea";
		$controller = new CustomerController();
		$controller->terms_ajax($cust_id, $quote_type);
	});
	
	on("POST", "/short-sea/save-terms", function() {
		$quote_type = "short-sea";
		$controller = new CustomerController();
		$controller->save_terms($quote_type);
	});
	
	on("POST", "/deep-sea/save-terms", function() {
		$quote_type = "deep-sea";
		$controller = new CustomerController();
		$controller->save_terms($quote_type);
	});
	//DM-09-Oct-2017 customer group start ------------------------
	on("GET", "/customergroupindex", function() {
		$controller = new CustomerController();
		$controller->customerGroupIndex();
	});
	on("GET", "/customergroupcreate", function() {
		$controller = new CustomerController();
		$form = 'add';
		$controller->customerGroupCreate($form);
	});
	on("POST", "/customergroupadd", function() {
		$controller = new CustomerController();
		$controller->customerGroupAdd();
	});
	on("GET", "/:group_id/customergroupedit", function() {
		$controller = new CustomerController();
		$form = 'edit';
		$group_id = params("group_id");
		$controller->customerGroupEdit($form,$group_id);
	});
	on("POST", "/:group_id/customerGroupUpdate", function() {
		$controller = new CustomerController();
		$group_id = params("group_id");
		$controller->customerGroupUpdate($group_id);
	});
	// common ajax
	on("POST", "/common_ajax", function() {
		$controller = new CustomerController();
		$controller->commonAjax();
	});
	//DM-09-Oct-2017 customer group end ------------------------
  //Customer core data
     // Index
    on("GET", "/index", function() {
        $controller = new CustomerController();
        $controller->index();
    });
    //Delete the customer
    on("POST", "/delete", function() {
        $controller = new CustomerController();
        $controller->delete();
    });
    //Customer create
    on("GET", "/customer-create", function() {
        $controller = new CustomerController();
        $controller->customerCreate();
    });
    //Customer detail creation
    on("POST", "/customer-add", function() {
        $controller = new CustomerController();
        $controller->customerAdd();
    });
    //Edit customer details
    on("GET", "/:cust_id/customer-edit", function() {
        $controller = new CustomerController();
        $cust_id = params("cust_id");
        $controller->customerEdit($cust_id);
    });
    // Update the customer details
    on("POST", "/:cust_id/customer-update", function() {
        $controller = new CustomerController();
        $cust_id = params("cust_id");
        $controller->customerUpdate($cust_id);
    });
    //Upload the file
    /* on("POST", "/upload", function() {
        $controller = new CustomerController();
        $controller->upload();
    }); */
});

// Tank  ------------------------------------------------------------
prefix("tank", function() {

	// Index
	on("GET", "/index", function() {
		$controller = new TankController();
		$controller->index();
	});
	
	// Update check box items
	on("POST", "/update-checkbox", function() {
		$controller = new TankController();
		$controller->update_checkbox();
	});
	
	// Edit
	on("GET", "/:plan_id/edit", function() {
		$controller = new TankController();
		$form = 'edit';
		$plan_id = params("plan_id");
		$controller->edit($plan_id, $form);
	});

  // Duplicate
  on("GET", "/:plan_id/duplicate", function() {
    $controller = new TankController();
    $form = 'duplicating';
    $plan_id = params("plan_id");
    $controller->edit($plan_id, $form);
  });
	
	// add
	on("GET", "/add", function() {
		$controller = new TankController();
		$form = 'add';
		$controller->add($form);
	});
	
	// add
	on("POST", "/add", function() {
		$controller = new TankController();
		$controller->create();
	});
	
	// Update
	on("POST", "/:plan_id/update", function() {
		$controller = new TankController();
		$plan_id = params("plan_id");
		$controller->update($plan_id);
	});
	
	// Delete
	on("POST", "/delete", function() {
		$controller = new TankController();
		$controller->delete();
	});
	
	// search tank no
	on("POST", "/tankno-search", function() {
		$controller = new TankController();
		$controller->search_tankno();
	});
		
	on("POST", "/docslist", function() {
		$controller = new TankController();
		$controller->docslist();
	});		
	
	on("POST", "/ship-jobfiles", function() {
		$controller = new TankController();
		$controller->shipjobfiles();
	});

  on("GET", "/ajax-get-tank-plans", function(){
    $controller = new TankController();
    $controller->getTankPlans();
  });
  // common ajax
  on("POST", "/common_ajax", function() {
  	$controller = new TankController();
  	$controller->commonAjax();
  });
  
  on("GET", "/get_tank_no_list", function() {
     $controller = new TankController();
     $controller->getTankNumberList();
  });
         
  // Update tank status
  on("POST", "/move-archived", function() {
    $controller = new TankController();
    $controller->move_archived();
  });
  on("GET", "/move-archived", function() {
    $controller = new TankController();
    $controller->move_archived();
  });
  on("GET", "/autocomp_town", function(){
    $controller = new TankController();
    $controller->autocompTown();
  });
  on("GET", "/autocomp_supplier", function(){
    $controller = new TankController();
    $controller->autocompSupplier();
  });

  on("GET", "/get_tank_filter", function() {
    $controller = new TankController();
    $controller->getTankPlanFilter();
  });

  on("POST", "/save_get_filter_data", function() {
    $controller = new TankController();
    $controller->saveFilterData();
  });

  

});

// Supplier Invoices  ------------------------------------------------------------
prefix("supplier-invoices", function() {

	// Index
	on("GET", "/index", function() {
		$controller = new SupplierInvoicesController();
		$controller->index();
	});
	
	
	// Add
	on("GET", "/add", function() {
		$controller = new SupplierInvoicesController();
    $form = 'add';
		$controller->add($form);
	});
  
  // Edit
	on("GET", "/:supplier_invoice_id/edit", function() {
		$controller = new SupplierInvoicesController();
		$form = 'edit';
		$supplier_invoice_id = params("supplier_invoice_id");
		$controller->edit($supplier_invoice_id, $form);
	});
  
  // Create
	on("POST", "/add", function() {
		$controller = new SupplierInvoicesController();
		$controller->create();
	});
  
  
  // Update
	on("POST", "/:supplier_invoice_id/update", function() {
		$controller = new SupplierInvoicesController();
		$supplier_invoice_id = params("supplier_invoice_id");
		$controller->update($supplier_invoice_id);
	});
	
	
	// Delete
	on("POST", "/delete", function() {
		$controller = new SupplierInvoicesController();
		$controller->delete();
	});
  
  // Duplicate
  on("GET", "/:invoice_id/duplicate", function() {
    $controller = new SupplierInvoicesController();
    $invoice_id = params("invoice_id");
    $form = 'duplicating';
    $controller->edit($invoice_id, $form);
  });
  
  on("POST", "/generate_supplier_inv_job_costs", function() {
    $controller = new SupplierInvoicesController();
    $supplier_invoice_id = params("supplier_invoice_id");
    $invoice_amount = params("invoice_amount");
    $controller->generateSupplierInvJobCosts($supplier_invoice_id, $invoice_amount);
  });
  
  // get the VAT rate for a supplier
  on("POST", '/get_supplier_vat_rate', function() {
    $controller = new SuppliersController();
    $supplier_id = params("supplier_id");
    $controller->get_supplier_vat_rate($supplier_id);
  });

  // Generate a list of attachments for a supplier costs extra
  on("POST", "/generate-attachment-table-rows", function() {
    $controller = new FilesController();
    $controller->generateAttachmentTableRows();
  });
  
  // common ajax DM-14-Jul-2017
  on("POST", "/common_ajax", function() {
  	$controller = new SupplierInvoicesController();
  	$controller->commonAjax();
  });
  
  on("GET", '/:record_id/supplier-email-details', function() {
    $controller = new SupplierInvoicesController();
    $record_id = params("record_id");
    $controller->getSupplierEmailDetails($record_id);
  });	
});

// Job  ------------------------------------------------------------
prefix("job", function() {
	// Update check box items
	on("POST", "/update-checkbox", function() {
		$controller = new JobController();
		$controller->update_checkbox();
	});
	
	// VGM edit
	on("GET", "/:job_num/vgm", function() {
		$controller = new JobController();
		$job_num = params("job_num");
		$controller->vgm_doc_edit($job_num);
	});
	
	// VGM POST 
	on("POST", "/:job_num/vgm", function() {
		$controller = new JobController();
		$job_num = params("job_num");
		$controller->vgm_doc_pdf($job_num);
	});
	
	// VGM pdf
	on("POST", "/:job_num/vgm_pdf", function() {
		$controller = new JobController();
		$job_num = params("job_num");
		$controller->vgm_doc_pdf($job_num);
	});
	
	// Create job from quote number in first page
	on("GET", "/create-job", function() {
		$controller = new JobController();
		$controller->create_job();
	});
	
	// Create job from quote number in 2nd page
	on("POST", "/create-job", function() {
		$controller = new JobController();
		$quoteNo = trim($_POST['quote-number']);
		$controller->create_job_data(NULL,$quoteNo);
	});
	
	// Create job from job template in 2nd page
	on("GET", "/:quote/create-job-from-template", function() {
		$controller = new JobController();
		$quoteNo = params("quote");
		$controller->create_job_data(NULL,$quoteNo);
	});
	
	// Create job from quote number in 2nd page
	on("POST", "/save-job-data-intermidate", function() {
		$controller = new JobController();
		$controller->intermediate_page_job_data();
	});
	
	// redirect to first page
	on("GET", "/save-job-data-intermidate", function() {
		$controller = new JobController();
		$controller->create_job();
	});
	
	// Create job from quote number in 2nd page
	on("POST", "/save-job-data", function() {
		$controller = new JobController();
		$controller->save_job_data();
	});
	
	// Create job from quote number in 2nd page
	on("GET", "/save-job-data", function() {
		$controller = new JobController();
		$jobNoGet = $_GET['jobno'];
		$controller->saveJobDataGet($jobNoGet);
	});
  // Common save for Safety securty in detail page
    // common ajax
  on("POST", "/save_update_js", function() {
    $controller = new JobController();
    $controller->saveUpdateJss();
  });
 
  on("GET", "/save-job-data", function() {
    $controller = new JobController();
    $jobNoGet = $_GET['jobno'];
    $controller->saveJobDataGet($jobNoGet);
  });
	
	// common ajax
	on("POST", "/common_ajax", function() {
		$controller = new JobController();
		$controller->commonAjax();
	});
	
	// listing page
	on("GET", "/:job_type/view", function() {
		$controller = new JobController();
		$job_type = params("job_type");
		$controller->job_listing($job_type);
	});
	
	// multi-job jan 4 2016 DM
	on("GET", "/:job_no/multi-job", function() {
		$controller = new JobController();
		$job_no = params("job_no");
		$controller->create_job_data($job_no,NULL);
	});
	
	// multi-job jan 4 2016 DM
	on("POST", "/backbutton", function() {
		$controller = new JobController();
		$controller->create_job_data_back();
	});
    // edit job information page
    on("GET", "/:job_num/job-info", function() {
        $controller = new JobController();
        $job_num = params("job_num");
        $controller->job_information_listing($job_num);
    });
    on("GET", "/:job_num/job-info-edit", function() {
        $controller = new JobController();
        $job_num = params("job_num");
        $controller->job_information_editing($job_num);
    });
    // Update
    on("POST", "/:job_num/update", function() {
        $controller = new JobController();
        $job_num    = params("job_num");
        $controller->update($job_num);
    });

  // Job manager
  on("GET", "/:job_num/detail", function() {
    $controller = new JobController();
    $job_num = params("job_num");
    $controller->jobDetail($job_num);
  });

  // Job File upload
  on("POST", "/jobF-fle-upload", function() {
    $controller = new JobController();
    $controller->jobFileUpload();
  });

  // Mail view
  on("GET", "/:email_id/job-email-file-details", function() {
    $controller = new JobController();
    $email_id = params("email_id");
    $controller->jobEmailFileDetails($email_id);
  });

  // Replay Mail 
  on("GET", "/:email_id/job-email-reply", function() {
    $controller = new JobController();
    $email_id = params("email_id");
    $controller->jobEmailReply($email_id);
  });
  
  // Replay Mail 
  on("POST", "/:email_id/job-email-reply", function() {
    $controller = new JobController();
    $email_id = params("email_id");
    $controller->jobEmailReply($email_id);
  });

  on("GET", "/contact_list", function() {
    $controller = new JobController();
    $term = params("term");
    $controller->contactList($term);
  });

  // Mail job file 
  on("GET", "/job-email-files", function() {
    $controller = new JobController();
    $controller->jobEmailFiles();
  });

  on("POST", "/job-email-files", function() {
    $controller = new JobController();
    $controller->jobEmailFiles();
  });

  on("GET", "/get_job_doc_type", function() {
    $controller = new JobController();
    $controller->getJobDocsAutoComplete();
  });

  // Mail job template file 
  on("GET", "/template-document-email-files", function() {
    $controller = new JobController();
    $controller->templateDocumentEmailFiles();
  });

  on("POST", "/template-document-email-files", function() {
    $controller = new JobController();
    $controller->templateDocumentEmailFiles();
  });

  //Template Mail view
  on("GET", "/:email_id/job-template-email-file-details", function() {
    $controller = new JobController();
    $email_id = params("email_id");
    $controller->jobTemplateEmailFileDetails($email_id);
  });

  // Replay Mail 
  on("GET", "/:email_id/job-template-email-reply", function() {
    $controller = new JobController();
    $email_id = params("email_id");
    $controller->jobTemplateEmailReply($email_id);
  });
  
  // Replay Mail 
  on("POST", "/:email_id/job-template-email-reply", function() {
    $controller = new JobController();
    $email_id = params("email_id");
    $controller->jobTemplateEmailReply($email_id);
  });  
});

// Job files routes -----------------------------------------------------------
prefix("jobfiles", function() {

	on("POST", "/upload", function() {
		$controller = new JobfilesController();
		$controller->upload();
	});

	on("POST", "/deleteUploadedFile", function() {
		$controller = new JobfilesController();
		$controller->deleteUploadedFile();
	});
});

// Business overview report  ------------------------------------------------------------
prefix("business-overview-report", function() {

	// Index
	on("GET", "/index", function() {
		$controller = new BusinessOverviewReportController();
		$controller->index();
	});

	// Index New
	on("GET", "/indexNew", function() {
		$controller = new BusinessOverviewReportController();
		$controller->indexNew();
	});
});

// VGM Route  ------------------------------------------------------------
prefix("vgm-route", function() {

	// Index
	on("GET", "/index", function() {
		$controller = new VgmRouteController();
		$controller->index();
	});
	
	// Create
	on("GET", "/create", function() {
		$controller = new VgmRouteController();
		$controller->create();
	});
	
	// Create
	on("POST", "/add", function() {
		$controller = new VgmRouteController();
		$controller->add();
	});
	
	// Edit
	on("GET", "/:route_id/edit", function() {
		$controller = new VgmRouteController();
		$route_id = params("route_id");
		$form = 'edit';
		$controller->edit($route_id,$form);
	});
	// duplicate
	on("GET", "/:route_id/duplicate", function() {
		$controller = new VgmRouteController();
		$form = 'duplicating';
		$route_id = params("route_id");
		$controller->edit($route_id,$form);
	});
	// Update
	on("POST", "/:route_id/update", function() {
		$controller = new VgmRouteController();
		$route_id = params("route_id");
		$controller->update($route_id);
	});
	// Delete
	on("POST", "/:route_id/delete", function() {
		$controller = new VgmRouteController();
		$route_id = params("route_id");
		$controller->delete($route_id);
	});
	
	on("POST", "/route_exist", function() {
		$controller = new VgmRouteController();
		$controller->route_exist();
	});

});

// job template for SS job template------------------------------------------------------------
prefix("jobtemplate-quotes", function() {

  // cct updtae
  on("GET", "/set-cct-no-approved", function() {
    $controller = new JobTemplateController();
    $controller->setCctNonApproved();
  });

	// index
	on("GET", "/index", function() {
		$controller = new JobTemplateController();
		$quote_type = 'short-sea';
		$listType = 'list';
		$controller->index($quote_type,$listType);
	});
	// index
	on("GET", "/:listType/index", function() {
		$controller = new JobTemplateController();
		$quote_type = 'short-sea';
		$listType = params("listType");
		$controller->index($quote_type,$listType);
	});
	// add
	on("GET", "/add", function() {
		$controller = new JobTemplateController();
		$form = 'add';
		$quote_type = "short-sea";
		$controller->add($form,$quote_type);
	});
	// Create
	on("POST", "/add", function() {
		$quote_type = "short-sea";
		$controller = new JobTemplateController();
		$controller->create($quote_type);
	});
	// common ajax
	on("POST", "/common_ajax", function() {
		$controller = new JobTemplateController();
		$controller->commonAjax();
	});
	// save suppliercost
	on("POST", "/save_supp_cost", function() {
		$controller = new JobTemplateController();
		$controller->saveSuppCost();
	});

	// ssupplier cost list
	on("POST", "/supplier_rate_list", function() {
		$controller = new JobTemplateController();
		$controller->supplierRateList();

	});
	// Edit
	on("GET", "/:quote_id/edit", function() {
		$controller = new JobTemplateController();
		$route_id = params("quote_id");
		$quote_type = "short-sea";
		$form = 'edit';
		$controller->edit($form, $route_id,$quote_type);
	});

	// Edit
	on("GET", "/:quote_id/duplicate", function() {
		$controller = new JobTemplateController();
		$route_id = params("quote_id");
		$quote_type = "short-sea";
		$form = 'duplicating';
		$controller->edit($form, $route_id,$quote_type);
	});

	// update
	on("POST", "/:quote_id/update", function() {
		$controller = new JobTemplateController();
		$route_id = params("quote_id");
		$quote_type = "short-sea";
		$form = 'edit';
		$controller->update($form, $route_id,$quote_type);
	});

	// create job templatye dynamically from short sea
	on("GET", "/:quote_id/create-jobtemplate", function() {
		$controller = new JobTemplateController();
		$shortsea_id = params("quote_id");
		$quote_type = "short-sea";
		$form = 'auto-generate';
		$controller->add($form,$quote_type,$shortsea_id);
	});
  // file upload
  on("POST", "/job-template-file-upload", function() {
    $controller = new JobTemplateController();
    $controller->jobTemplateFileUpload();
  });

});

// job template for DS job template------------------------------------------------------------
prefix("jobtemplate-quotes-deepsea", function() {

	// index
	on("GET", "/index", function() {
		$controller = new JobTemplateDeepseaController();
		$quote_type = 'deep-sea';
		$listType = 'list';
		$controller->index($quote_type,$listType);
	});
	// index
	on("GET", "/:listType/index", function() {
		$controller = new JobTemplateDeepseaController();
		$quote_type = 'deep-sea';
		$listType = params("listType");
		$controller->index($quote_type,$listType);
	});
	// add
	on("GET", "/add", function() {
		$controller = new JobTemplateDeepseaController();
		$form = 'add';
		$quote_type = "deep-sea";
		$controller->add($form,$quote_type);
	});
	// Create
	on("POST", "/add", function() {
		$quote_type = "deep-sea";
		$controller = new JobTemplateDeepseaController();
		$controller->create($quote_type);
	});
	// common ajax
	on("POST", "/common_ajax", function() {
		$controller = new JobTemplateDeepseaController();
		$controller->commonAjax();
	});
	// save suppliercost
	on("POST", "/save_supp_cost", function() {
		$controller = new JobTemplateDeepseaController();
		$controller->saveSuppCost();
	});

	// ssupplier cost list
	on("POST", "/supplier_rate_list", function() {
		$controller = new JobTemplateDeepseaController();
		$controller->supplierRateList();

	});
	// Edit
	on("GET", "/:quote_id/edit", function() {
		$controller = new JobTemplateDeepseaController();
		$route_id = params("quote_id");
		$quote_type = "deep-sea";
		$form = 'edit';
		$controller->edit($form, $route_id,$quote_type);
	});

	// Edit
	on("GET", "/:quote_id/duplicate", function() {
		$controller = new JobTemplateDeepseaController();
		$route_id = params("quote_id");
		$quote_type = "deep-sea";
		$form = 'duplicating';
		$controller->edit($form, $route_id,$quote_type);
	});

	// update
	on("POST", "/:quote_id/update", function() {
		$controller = new JobTemplateDeepseaController();
		$route_id = params("quote_id");
		$quote_type = "deep-sea";
		$form = 'edit';
		$controller->update($form, $route_id,$quote_type);
	});

	// create job templatye dynamically from short sea
	on("GET", "/:quote_id/create-jobtemplate", function() {
		$controller = new JobTemplateDeepseaController();
		$shortsea_id = params("quote_id");
		$quote_type = "deep-sea";
		$form = 'auto-generate';
		$controller->add($form,$quote_type,$shortsea_id);
	});
  // file upload
  on("POST", "/job-template-file-upload", function() {
    $controller = new JobTemplateController();
    $controller->jobTemplateFileUpload();
  });
});


prefix("job-template-report", function() {

	// index
	on("GET", "/index", function() {
		$controller = new JobTemplateReportController();
		$quote_type = 'short-sea';
		$controller->index($quote_type);
	});

	// index
	on("GET", "/export", function() {
		$controller = new JobTemplateReportController();
		$quote_type = 'short-sea';
		$controller->exportExcel($quote_type);
	});

	// common ajax
	on("POST", "/common_ajax", function() {
		$controller = new JobTemplateReportController();
		$controller->commonAjax();
	});
});

// Kickback report  ------------------------------------------------------------
prefix("kickback-report", function() {

	// Index
	on("GET", "/index", function() {
		$controller = new KickbackReportController();
		$controller->index();
	});
	// common ajax
	on("POST", "/common_ajax", function() {
		$controller = new KickbackReportController();
		$controller->commonAjax();
	});
  // Index
  on("GET", "/report", function() {
    $controller = new KickbackReportController();
    $controller->report();
  });
  // Get kickback report
  on("POST", "/ajax-get-kickback-report", function() {
    $controller = new KickbackReportController();
    $controller->getKickBackReportByAjax();
  });
  // Get kickback report
  on("POST", "/ajax-get-kickback-report-load-data", function() {
    $controller = new KickbackReportController();
    $controller->getKickBackReportLoadDataByAjax();
  });
  // Index
  on("POST", "/report", function() {
    $controller = new KickbackReportController();
    $controller->report();
  });

});
// Update supplier ancillary Rate from core data
prefix("customerancillary", function() {

	// Index
	on("GET", "/index", function() {
		$controller = new CustomerAncillaryController();
		$controller->index();
	});

	// get quotes of particular customer
	on("GET", "/:customer_id/get-quotes", function() {
		$cust_id = params("customer_id");
		$controller = new CustomerAncillaryController();
		$controller->customerQuotes($cust_id);
	});

	// view history of particular customer
	on("GET", "/:customer_id/viewhistory", function() {
		$cust_id = params("customer_id");
		$controller = new CustomerAncillaryController();
		$controller->viewHistory($cust_id);
	});

	// common ajax
	on("POST", "/common_ajax", function() {
		$controller = new CustomerAncillaryController();
		$controller->commonAjax();
	});

});
prefix("supplier-route", function() {

	// index
	on("GET", "/index", function() {
		$controller = new SupplierRouteEmailController();
		$controller->index();
	});
	
	// render create page
	on("GET", "/create", function() {
		$controller = new SupplierRouteEmailController();
		$controller->create();
	});

	// add page
	on("POST", "/add", function() {
		$controller = new SupplierRouteEmailController();
		$controller->add();
	});
	
	// Edit
	on("GET", "/:route_id/edit", function() {
		$controller = new SupplierRouteEmailController();
		$route_id = params("route_id");
		$form = 'edit';
		$controller->edit($form, $route_id);
	});

	// Update
	on("POST", "/:route_id/update", function() {
		$controller = new SupplierRouteEmailController();
		$route_id = params("route_id");
		$controller->update($route_id);
	});
	
	// Duplicate
	on("GET", "/:route_id/duplicate", function() {
		$controller = new SupplierRouteEmailController();
		$route_id = params("route_id");
		$form = 'duplicating';
		$controller->edit($form, $route_id);
	});

	// common ajax
	on("POST", "/common_ajax", function() {
		$controller = new SupplierRouteEmailController();
		$controller->commonAjax();
	});
    
	// Delete
	on("POST", "/:route_id/delete", function() {
		$route_id = params("route_id");
		$controller = new SupplierRouteEmailController();
		$controller->delete($route_id);
	});
});

// dangerous goods start--------------------------------------
prefix("dangerousgoods", function() {
	// Create
	on("GET", "/:job_number/:plan_id/:activity/create", function() {
		$controller = new DangerousGoodsController();
		$job_number = params("job_number");
		$plan_id = params("plan_id");
		$activity = params("activity");
		$controller->create($job_number,$plan_id,$activity,false);
	});
    on("POST", "/report", function() {
        $controller = new DangerousGoodsController();
        $controller->report();
    });
});
// dangerous goods end--------------------------------------

// supplier validity start--------------------------------------
prefix("suppliers-validity", function() {
	//DM-10-Jan-2016
  on("GET", "/:supplier_id/update-validity", function() {
    $supplier_id = params("supplier_id");
    $controller = new SuppliersValidityController();
    $controller->update_supplier_validity($supplier_id);
  });
  
  // Fuel Surcharges
  on("POST", "/supplier-costs", function() {
  	$controller = new SuppliersValidityController();
  	$controller->supplier_costs();
  });
  // Save Fuel Surcharges
  on("POST", "update-supplier-validity", function() {
  	$controller = new SuppliersValidityController();
  	$controller->save_supplier_validity();
  });
  // common ajax
  on("POST", "/common_ajax", function() {
  	$controller = new SuppliersValidityController();
  	$controller->commonAjax();
  });
  
});
// supplier validity end--------------------------------------


// Bank accounts  ------------------------------------------------------------
prefix("bank-accounts", function() {

	// index
	on("GET", "/index", function() {
		$controller = new BankAccountsController();
		$controller->index();
	});
  
  // add bank account form
	on("GET", "/add", function() {
		$controller = new BankAccountsController();
		$form = 'add';
		$controller->add($form);
	});
  
  // Create a bank account
	on("POST", "/add", function() {
		$controller = new BankAccountsController();
		$controller->create();
	});
  
  // Edit
	on("GET", "/:bank_account_id/edit", function() {
		$controller = new BankAccountsController();
		$form = 'edit';
		$bank_account_id = params("bank_account_id");
		$controller->edit($bank_account_id, $form);
	});
  
  // Update
	on("POST", "/:bank_account_id/update", function() {
		$controller = new BankAccountsController();
		$bank_account_id = params("bank_account_id");
		$controller->update($bank_account_id);
	});
  
  // Delete a bank account
	on("POST", "/delete", function() {
		$controller = new BankAccountsController();
		$controller->delete();
	});

});

// Bank accounts end  ------------------------------------------------------------
// supplier rate comparisons start--------------------------------------
prefix("supplier-route-compare", function() {
	//DM-24-aPR-2017
	on("GET", "/index", function() {
		$controller = new SupplierRateCompareController();
		$controller->index();
	});
});
// supplier rate comparisons end--------------------------------------
// status reports start--------------------------------------
prefix("status-report", function() {
	//DM-29-May-2017
	on("GET", "/index", function() {
		$controller = new StatusReportController();
		$controller->index();
	});
	//DM-29-May-2017
	on("POST", "/index", function() {
		$controller = new StatusReportController();
		$controller->index();
	});
	// common ajax
	on("POST", "/common_ajax", function() {
		$controller = new StatusReportController();
		$controller->commonAjax();
	});
  // Get M&R Test data
  on("GET", "/test-data", function() {
    $controller = new StatusReportController();
    $controller->getTestData();
  });

  // POST M&R Test data
  on("POST", "/test-data", function() {
    $controller = new StatusReportController();
    $controller->getTestData();
  });
});
// status reports end--------------------------------------
// DM-23-Aug-2017 Internal status reports start--------------------------------------
prefix("internal-status-report", function() {
	//DM-23-Aug-2017
	on("GET", "/index", function() {
		$controller = new StatusReportInternalController();
		$controller->index();
	});
	//DM-23-Aug-2017
	on("POST", "/index", function() {
		$controller = new StatusReportInternalController();
		$controller->index();
	});
});
// Internal status reports end--------------------------------------
// job cost start--------------------------------------
prefix("job-cost", function() {

  //DM-10-Jan-2016
  on("GET", "/index", function() {
    $controller = new JobcostController();
    $controller->index();
  });

	//DM-10-Jan-2016
	on("GET", "/:job_no/create", function() {
		$job_no = params("job_no");
		$controller = new JobcostController();
		$controller->create($job_no);
	});
	// create
	on("POST", "add", function() {
		$controller = new JobcostController();
		$controller->add();
	});
	//DM-10-Jan-2016
	on("GET", "/:job_cost_no/edit", function() {
		$job_cost_no = params("job_cost_no");
		$controller = new JobcostController();
		$controller->edit($job_cost_no);
	});
	// Update
	on("POST", "/:job_cost_no/update", function() {
		$job_cost_no = params("job_cost_no");
		$controller = new JobcostController();
		$controller->update($job_cost_no);
	});
	// common ajax
	on("POST", "/common_ajax", function() {
		$controller = new JobcostController();
		$controller->commonAjax();
	});
	//DM-31-Mar-2017
	on("GET", "/change-supp-rate", function() {
		$controller = new JobcostController();
		$controller->change_supp_rate();
	});
	// Search
	on("POST", "/search", function() {
		$controller = new JobcostController();
		$controller->search();
	});
	// save suppliercost
	on("POST", "/save_supp_cost", function() {
		$controller = new JobcostController();
		$controller->saveSuppCost();
	});
  on("POST", "/multirecharge", function() {
    $controller = new JobcostController();
    $controller->multirecharge();
  });
  on("POST", "/apply-multi-recharge", function() {
    $controller = new JobcostController();
    $controller->applyMultiRecharge();
  });
	//DM-08-Jun-2017 next change in jobcost
	on("GET", "/:recharge_id/recharge", function() {
		$jobCostId = params("recharge_id");
		$controller = new JobcostController();
		$controller->recharge($jobCostId);
	});
	//DM-08-Jun-2017 next change in jobcost
	on("POST", "/:recharge_id/recharge", function() {
		$jobCostId = params("recharge_id");
		$controller = new JobcostController();
		$controller->updateRecharge($jobCostId);
	});
  on("POST", "update_multipaste_jobcost", function() {
    $controller = new JobcostController();
    $controller->updatemultipasteJobcost();
  });
  on("GET", "/update-slush-eur", function() {
  	$controller = new JobcostController();
  	$controller->updateExistingSlushCostEUR();
  });
  on("GET", "/unlock-costs", function() {
    $controller = new JobcostController();
    $controller->geUnlockCosts();
  });
	
});
// job cost end--------------------------------------

//user management start DM-20-Jul-2017 Start-------------------
prefix("user", function() {
	//DM-20-Jul-2017
	on("GET", "/index", function() {
		$controller = new UserManagementController();
		$controller->index();
	});
	//DM-20-Jul-2017
	on("GET", "/create", function() {
		$controller = new UserManagementController();
		$controller->create();
	});
	// common ajax DM-21-Jul-2017
	on("POST", "/common_ajax", function() {
		$controller = new UserManagementController();
		$controller->commonAjax();
	});
	// common ajax DM-21-Jul-2017
	on("POST", "/add", function() {
		$controller = new UserManagementController();
		$controller->add();
	});
	//DM-21-Jul-2017
	on("GET", "/:user_id/edit", function() {
		$controller = new UserManagementController();
		$user_id = params("user_id");
		$controller->edit($user_id,'edit');
	});
	//DM-21-Jul-2017
	on("POST", "/:user_id/update", function() {
		$controller = new UserManagementController();
		$user_id = params("user_id");
		$controller->update($user_id);
	});
  on("GET", "/:user_id/reset-password", function() {
    $controller = new UserManagementController();
    $user_id = params("user_id");
    $controller->resetPassword($user_id);
  });
  on("GET", "update-existing-password", function() {
    $controller = new UserManagementController();
    $controller->updateExistingPassword();
  });
});


prefix("access", function() {
	  //DM-04-OCT-2019
  on("GET", "/privilege-error", function() {
    $controller = new AccessController();
    $controller->showPrivilegeError();
  });
  //DM-04-OCT-2019
  on("GET", "/module-user-privilege", function() {
    $controller = new AccessController();
    $controller->moduleUserPrivilege();
  });
  //DM-04-OCT-2019
  on("GET", "/user-module-privilege", function() {
    $controller = new AccessController();
    $controller->userModulePrivilege();
  });
-  //DM-04-OCT-2019
  on("POST", "/create-module-privileges", function() {
    $controller = new AccessController();
    $controller->createModulePrivilege();
  });
  //DM-09-OCT-2019
  on("POST", "/get-privilege-users-by-module", function() {
    $controller = new AccessController();
    $controller->getPrivilegedUsersByModule();
  });
  //DM-04-OCT-2019
  on("POST", "/create-user-privileges", function() {
    $controller = new AccessController();
    $controller->createUserPrivileges();
  });
  //DM-09-OCT-2019
  on("POST", "/get-privilege-modules-by-user", function() {
    $controller = new AccessController();
    $controller->getPrivilegedmodulesByUser();
  });

  on("GET", "/module-index", function() {
    $controller = new AccessController();
    $controller->moduleIndex();
  });

  on("GET", "/module-create", function() {
    $controller = new AccessController();
    $controller->moduleCreate();
  });

  on("POST", "/module-create", function() {
    $controller = new AccessController();
    $controller->moduleCreate();
  });

  on("GET", "/:module_id/module-edit", function() {
    $controller = new AccessController();
    $module_id = params("module_id");
    $controller->moduleEdit($module_id,'edit');
  });

  on("POST", "/:module_id/module-edit", function() {
    $controller = new AccessController();
    $module_id = params("module_id");
    $controller->moduleEdit($module_id,'edit');
  });

  on("POST", "/get-next-module-data", function() {
    $controller = new AccessController();
    $controller->getNextModuleData();
  });
  on("GET", "/account-unlock", function() {
    $controller = new AccessController();
    $controller->getAccountUnlock();
  });
  // common ajax
  on("POST", "/common-ajax", function() {
    $controller = new AccessController();
    $controller->commonAjax();
  });
  // Session time 
  on("GET", "/session-period", function() {
    $controller = new AccessController();
    $controller->getSessionPeriod();
  });
});

//user management start DM-20-Jul-2017 End---------------------
//Backend controller for manupulate backend start DM-28-Nov-2017 Start-------------------
prefix("common-backend", function() {
	//DM-28-Nov-2017
	on("GET", "/customer-tank-days", function() {
		$controller = new CommonBackendController();
		$controller->applyTankDays();
	});
	on("GET", "/customer-tank-days/:update", function() {
		$controller = new CommonBackendController();
		$update = params("update");
		$controller->applyTankDays($update);
	});
	on("POST", "/job-load-index", function() {
		$controller = new CommonBackendController();
		$controller->downloadBatchLoadActivites();
	});
	on("GET", "/job-load-index", function() {
		$controller = new CommonBackendController();
		$controller->loadReportIndex();
	});
	on("GET", "/tank-core-data", function() {
		$controller = new CommonBackendController();
		$controller->getTankCoreData();
	});
	on("GET", "/get-duplicate-inv", function() {
		$controller = new CommonBackendController();
		$controller->getDuplicateInvoices();
	});
  on("GET", "/set-demtk-date", function() {
    $controller = new CommonBackendController();
    $controller->setDemtkdate();
  });
  on("GET", "/fix-demtk-recharge-curr", function() {
  	$controller = new CommonBackendController();
  	$controller->fixDEMTKExistingRecharge();
  });
  on("GET", "/update-po-est-currency", function() {
  	$controller = new CommonBackendController();
  	$controller->updatepoEstmaterur();
  });
  on("GET", "/update-job-demurrage-bit", function() {
    $controller = new CommonBackendController();
    $controller->updateJobDemurrageBackEnd();
  });
  on("GET", "/supplier-rate-updation", function() {
    $controller = new CommonBackendController();
    $controller->updateSupplierCostChange();
  });
  on("GET", "/tank-allock-mail", function() {
      $controller = new CommonBackendController();
      $controller->sendTankAllocMail();
  });
  on("GET", "/move-sql-backup", function() {
      $controller = new CommonBackendController();
      $controller->moveFileToSharepoint();
  });
  on("GET", "/update-city-lat-long", function() {
    $controller = new CommonBackendController();
    $controller->updateCityLatLong();
  });
  on("GET", "/lock-unused-accounts", function() {
    $controller = new CommonBackendController();
    $controller->lockUnusedAccounts();
  });
  on("GET", "/update-tank-status-one-time", function() {
      $controller = new CommonBackendController();
      $controller->updateTankStausOneTimeOnly();
  });
  on("GET", "/storage-cost-alert", function() {
      $controller = new CommonBackendController();
      $controller->storageCostAlert();
  });
  on("GET", "/storage-cost-history", function() {
      $controller = new CommonBackendController();
      $controller->storageCostHistory();
  });  
  on("GET", "/supplier-qshe-disapproval", function() {
      $controller = new CommonBackendController();
      $controller->supplierQssheDisapprovalCoutDown();
  });
});
//Backend controller for manupulate backend start DM-28-Nov-2017 Start-------------------
// Invoice perfomance report  ------------------------------------------------------------
prefix("invoice-performance-report", function() {

	// Index
	on("GET", "/index", function() {
		$controller = new InvoicePerformanceReportController();
		$controller->index();
	});
	on("POST", "/index", function() {
		$controller = new InvoicePerformanceReportController();
		$controller->index();
	});
});
// Job Instructions DM-21-mar2018 start ------------------------------------------------------------
prefix("job-instruction", function() {
	
	// Heat Instruction
	on("GET", "/:jobno/:plid/heat", function() {
		$controller = new JobInstructionController();
		$jobno = params("jobno");
		$plid = params("plid");
		$controller->heatInstruction($jobno,$plid);
	});
	// Heat Instruction Post
	on("POST", "/generate-heat-pdf", function() {
		$controller = new JobInstructionController();
		$controller->heatInstructionCreatePdf();
	});
	// common ajax
	on("POST", "/common_ajax", function() {
		$controller = new JobInstructionController();
		$controller->commonAjax();
	});
});
//Job Instructions DM-21-mar2018 end ------------------------------------------------------------
prefix("missing-tanks-report", function() {
    // Index
    on("GET", "/index", function() {
        $controller = new MissingTanksReportController();
        $controller->index();
    });
    // get AVLB tanks
    on("GET", "/get-AVLB-tanks", function() {
      $controller = new MissingTanksReportController();
      $controller->getAVLBTanks();
    });
});

//DEMTK   ------------------------------------------------------------
prefix("demtk", function() {

	// Index
	on("GET", "/index", function() {
		$controller = new DmtkController();
		$controller->index();
	});
	//
	on("GET", "/:j_number/generate", function() {
		$controller = new DmtkController();
		$j_number = params("j_number");
		$controller->generate($j_number);
	});
	
	// common ajax
	on("POST", "/common_ajax", function() {
		$controller = new DmtkController();
		$controller->commonAjax();
	});
	on("GET", "/apply-ds-tkday", function() {
		$controller = new DmtkController();
		//$j_number = params("j_number");
		$controller->applyDeepSeaTKdaysCalculation();
	});
  on("POST", "/demkJobUpdate", function() {
    $controller = new DmtkController();
    $controller->demkJobUpdate();
  });
});

//Accurals
prefix("accruals", function() {
  //index
  on("GET", "/index", function() {
    $controller = new AccuralsController();
    $controller->index();
  });

  //Ajax to get accruals report
   on("POST", "/ajax-get-accruals-report", function() {
    $controller = new AccuralsController();
    $controller->getAccrualsReport();
  });

    //Ajax to get accruals report
   on("POST", "/ajax-get-accruals-report-more-data", function() {
    $controller = new AccuralsController();
    $controller->getAccrualsReportMoreData();
  });

   //export accrual
   on("GET", "/export-accrual", function() {
    $controller = new AccuralsController();
    $controller->exportAccrual();
  });
});

//Accurals
prefix("account-export", function() {

  on("GET", "/account-report", function() {
    $controller = new AccuralsController();
    $controller->getAccountExport();
  });

  on("POST", "/account-report", function() {
    $controller = new AccuralsController();
    $controller->getAccountExport();
  });

  //Ajax to get account export report
   on("POST", "/ajax-get-account-export-report", function() {
    $controller = new AccuralsController();
    $controller->getAccountExportReport();
  });

   //Ajax to get account export report
  on("POST", "/ajax-get-account-export-report-data", function() {
    $controller = new AccuralsController();
    $controller->getAccountExportReportData();
  });

    //Ajax to get account export report
  on("POST", "/ajax-mark-invoice-exported", function() {
    $controller = new AccuralsController();
    $controller->markInvoiceAsExported();
  });

  on("POST", "/account-report-csv", function() {
    $controller = new AccuralsController();
    $controller->getAccountExportCsv();
  });

  on("POST", "/common-ajax", function() {
    $controller = new AccuralsController();
    $controller->commonAjax();
  });

  on("GET", "/contact_list", function() {
    $controller = new AccuralsController();
    $term = params("term");
    $controller->contactList($term);
  });

  on("POST", "/send_email_inv", function() {
    $controller = new AccuralsController();
    $controller->sendEmailInvoice();
  });


});
// Tank allocates for jobs ------------------------------------------------------------
prefix("tank-allocate", function() {

	on("GET", "/:j_number/index", function() {
		$controller = new TankAllocateController();
		$j_number = params("j_number");
		$controller->index($j_number);
	});
	on("POST", "/update", function() {
		$controller = new TankAllocateController();
		$controller->update();
	});
	on("POST", "/common_ajax", function() {
		$controller = new TankAllocateController();
		$controller->commonAjax();
	});

});

//purchase order
prefix("purchase", function() {       
       
    //DM-28-Jan-2019 purchase order start ------------------------
    on("GET", "/purchasegroupindex", function() {
        $controller = new PurchaseController();
        $controller->purchaseGroupIndex();
    });
    on("GET", "/purchasegroupcreate", function() {
         $controller = new PurchaseController();
         $form = 'add';
         $controller->purchaseGroupCreate($form);
        });
    on("POST", "/purchasegroupadd", function() {
        $controller = new PurchaseController();
        $controller->purchaseGroupAdd();
     });
    on("POST", "/common_ajax", function() {
        $controller = new PurchaseController();
        $controller->commonAjax();
     });
     on("POST", "/delete", function() {
        $controller = new PurchaseController();
        $controller->delete();
      });
     on("GET", "/:po_id/edit", function() {
        $controller = new PurchaseController();
        $form = 'edit';
        $po_id = params("po_id");
        $groupname = params('group');
        $controller->edit($form,$po_id,$groupname);
      });            
     on("POST", "/:po_id/groupUpdate", function() {
        $controller = new PurchaseController();
        $po_id = params("po_id");
        $controller->update($po_id);
      });
         //DM-04-Feb-2019 purchase order end ------------------------
    });
 prefix("potemplate", function() {
        
        //DM-28-Jan-2019 purchase order start ------------------------
        on("GET", "/poindex", function() {
            $controller = new poTemplateController();
            $listType = 'live';
            $controller->Index($listType);
        });
        on("GET", "/archive/poindex", function() {
            $controller = new poTemplateController();
            $listType = 'archive';
            $controller->Index($listType);
        });
        on("GET", "/potemplatecreate", function() {
            $controller = new poTemplateController();
            $form = 'add';
            $controller->poTemplateCreate($form);
        });
        // common ajax
        on("POST", "/common_ajax", function() {
            $controller = new poTemplateController();
            $controller->commonAjax();
        });
        on("POST", "/potemplateadd", function() {
            $controller = new poTemplateController();
            $controller->poTemplateAdd();
        });
        on("POST", "/delete", function() {
            $controller = new poTemplateController();
            $controller->delete();
        });
        on("GET", "/:poid/edit", function() {
            $controller = new poTemplateController();
            $poid = params("poid");
            $controller->edit($poid,'edit');
        });
        on("POST", "/:po_id/update", function() {
            $controller = new poTemplateController();
            $po_id = params("po_id");
            $controller->update($po_id);
        });
        on("GET", "/get_equipment_no_list", function() {
            $controller = new poTemplateController();
            $controller->getEquipmentNumberList();
        });
    });
 
  /* prefix("non-job-activity",function() {
            
       // index
       on("GET", "/index", function() {
            $controller = new NonJobActivityController();
            $controller->index();
       });
                
       on("GET", "/create", function() {
            $controller = new NonJobActivityController();
            $controller->create();
        });
                    
       // Create non job activity
       on("POST", "/create", function() {
            $controller = new NonJobActivityController();
            $controller->add();
        });
        on("GET", "/:non_job_activity_id/edit", function() {
            $controller = new NonJobActivityController();
            $form = 'edit';
            $non_job_activity_id = params("non_job_activity_id");
            $controller->edit($non_job_activity_id, $form);
        });
                            
        // Update
        on("POST", "/:non_job_activity_id/edit", function() {
            $controller = new NonJobActivityController();
            $non_job_activity_id = params("non_job_activity_id");
            $controller->update($non_job_activity_id);
        });
                                
        on("POST", "/delete", function() {
            $controller = new NonJobActivityController();
            $controller->delete();
        });
            
        on("POST", "/common_ajax", function() {
            $controller = new NonJobActivityController();
            $controller->commonAjax();
        });
                                        
        }); */
  
  prefix("purchase_order",function() {
        
     // Create po from quote number in first page
        on("GET", "/:temp/create-po-date", function() {
            $controller = new PurchaseOrderController();
            $tempNo = params("temp");
            $tempORpo="Template";
            $controller->create_po_date($tempNo,$tempORpo);
        });
        // Create po directly from po using template number in first page
        on("GET", "/create-po-date", function() {
            $controller = new PurchaseOrderController();
            $poTempId=trim($_POST['po_temp_id']);
            $tempORpo="direct_po";
            $controller->create_po_date($poTempId,$tempORpo);
        });
        on("POST", "/upload", function() {
            $controller = new PurchaseOrderController();
            $controller->upload();
        });
     // common ajax
        on("POST", "/common_ajax", function() {
            $controller = new PurchaseOrderController();
            $controller->commonAjax();
        });
        // Create po from po number in 2nd page
        on("POST", "/create-po", function() {
            $controller = new PurchaseOrderController();
            $form = 'add';
            $poNo = trim($_POST['po_number']);
            $poTempId=trim($_POST['po_temp_id']);
            $controller->create_job_data($poNo,$poTempId);
        });
        on("GET", "/:poid/create-po", function() {
            $controller = new PurchaseOrderController();
            $form = 'add';
            $poNo = params("poid");
            $controller->create_job_data($poNo);
        });
        on("GET", "/:po_no/create", function() {
            $po_no = params("po_no");
            $controller = new PurchaseOrderController();
            $controller->create($po_no);
        });
        // create
        on("POST", "add", function() {
            $controller = new PurchaseOrderController();
            $controller->add();
        });
        on("GET", "/:po_cost_no/edit", function() {
            $po_cost_no = params("po_cost_no");
            $form       = 'edit';
            $controller = new PurchaseOrderController();
            $controller->edit($po_cost_no,$form);
        });
        on("GET", "/:po_cost_no/duplicate", function() {
            $po_cost_no = params("po_cost_no");
            $form       = "duplicate";
            $controller = new PurchaseOrderController();
            $controller->edit($po_cost_no,$form);
        });
        on("GET", "/:recharge_id/po_recharge", function() {
            $poCostId = params("recharge_id");
            $controller = new PurchaseOrderController();
            $controller->recharge($poCostId);
        });
        //recharge section
         on("POST", "/:recharge_id/recharge", function() {
            $poCostId = params("recharge_id");
            $controller = new PurchaseOrderController();
            $controller->updateRecharge($poCostId);
        }); 
         // Update
         on("POST", "/:po_cost_no/update", function() {
             $po_cost_id = params("po_cost_no");
          
             $controller = new PurchaseOrderController();
             $controller->update($po_cost_id);
         });
         on("GET", "/index", function() {
             $controller = new PurchaseOrderController();
             $listType = 'live';
             $controller->index($listType);
         });
         on("GET", "/archive/index", function() {
             $controller = new PurchaseOrderController();
             $listType = 'archive';
             $controller->Index($listType);
         });
         on("GET", "/trash/index", function() {
             $controller = new PurchaseOrderController();
             $listType = 'trash';
             $controller->Index($listType);
         });
         on("POST", "/common_ajax", function() {
             $controller = new PurchaseOrderController();
             $controller->commonAjax();
         });
         /* on("POST", "/delete", function() {
             $controller = new PurchaseOrderController();
             $controller->delete();
         }); */
         on("GET", "/:po_id/poedit", function() {
             $controller = new PurchaseOrderController();
             $form = 'edit';
             $poNo = params("po_id");
             $controller->poedit($poNo,$form);
         });
         on("GET", "/getname_email", function() {
             $controller = new PurchaseOrderController();
             $controller->getNameEmail();
          });
         on("GET", "/:po_no/rechargecreate", function() {
             $po_no = params("po_no");
             $controller = new PurchaseOrderController();
             $controller->addRecharge($po_no);
         });
         on("POST", "addextracost", function() {
             $controller = new PurchaseOrderController();
             $controller->addExtraCost();
         });
         on("GET", "/:extracostid/edit_extra_cost", function() {
             $controller = new PurchaseOrderController();
             $extracostid = params("extracostid");
             $controller->editExtraCost($extracostid,'edit');
         });
         on("POST", "/:extra_cost_id/update_extra_cost", function() {
             $controller = new PurchaseOrderController();
             $extra_cost_id = params("extra_cost_id");
             $controller->updateExtraCost($extra_cost_id);
         });
		 on("GET", "/generate_po_invoices", function() {
          	$controller = new PurchaseOrderController();
          	$controller->generateBatchInvoice(0);
          });
          on("POST", "/generate_po_invoices", function() {
          	$controller = new PurchaseOrderController();
          	$controller->generateBatchInvoice(1);
          });
          on("GET", "/get_equipment_no_list", function() {
              $controller = new PurchaseOrderController();
              $controller->getEquipmentNumberList();
          });
          on("GET", "/get_po_no_list", function() {
          	$controller = new PurchaseOrderController();
          	$controller->getPOnumberList('Slush');
          });
          on("GET", "/update_account_po", function() {
              $controller = new PurchaseOrderController();
              $controller->updateTables();
          });
          on("GET", "/update_MR_account_po", function() {
              $controller = new PurchaseOrderController();
              $controller->mrTableUpdateAccount();
          });
          on("GET", "/update_equipment_po", function() {
              $controller = new PurchaseOrderController();
              $controller->mrTableUpdateEquipment();
          });
          on("GET", "/get_tank_no_list", function() {
              $controller = new PurchaseOrderController();
              $controller->getTankNumberList();
          });
  });
  
  	// Invoicing Code  ------------------------------------------------------------
  prefix("invoicing-responsibility-code", function() {
  	
  		// index
  		on("GET", "/index", function() {
  			$controller = new InvoicingResponsibilityCodeController();
  			$controller->index();
  		});	
  		
  		on("GET", "/add", function() {
  			$controller = new InvoicingResponsibilityCodeController();
  			$form = 'add';
  			$controller->add($form);
  		});
  			
  				// Create Invoicing Responsibility Code
  		on("POST", "/add", function() {
  			$controller = new InvoicingResponsibilityCodeController();
  			$controller->create();
  		});
  		
  			// Edit
  		on("GET", "/:inv_responsibility_id/edit", function() {
  			$controller = new InvoicingResponsibilityCodeController();
  			$form = 'edit';
  			$inv_responsibility_id = params("inv_responsibility_id");
  			$controller->edit($inv_responsibility_id, $form);
  		});
  			
  			// Update
  		on("POST", "/:inv_responsibility_id/edit", function() {
  			$controller = new InvoicingResponsibilityCodeController();
  			$inv_responsibility_id = params("inv_responsibility_id");
  			$controller->update($inv_responsibility_id);
  		});
  			//Delete
  		on("POST", "/delete", function() {
  			$controller = new InvoicingResponsibilityCodeController();
  			$controller->delete();
  		});
  	});
    prefix("re_route", function() {
      on("GET", "/:j_num/reroute", function() {
        $controller = new RerouteController();
        $j_num = params("j_num");
        $controller->reRouteJob($j_num);
      });
      // common ajax
      on("POST", "/common_ajax", function() {
        $controller = new RerouteController();
        $controller->commonAjax();
      });

    });

      // activity start DM-23-OCT-2018 Start-------------------
prefix("activity", function () {
    // idex page DM-20-Jul-2017
    on("GET", "/index", function () {
        $controller = new ActivityController();
        $controller->index();
    });
    // common ajax DM-24-OCT-2018
    on("POST", "/common_ajax", function () {
        $controller = new ActivityController();
        $controller->commonAjax();
    });

    // Delete function 25-OCT-2018
    on("POST", "/:activity_id/delete", function () {
        $activity_id = params("activity_id");
        $controller = new ActivityController();
        $controller->delete($activity_id);
    });
    // create function 25-OCT-2018
    on("GET", "/create", function () {
        $controller = new ActivityController();
        $controller->create();
    });
    // common ajax DM-26-OCT-2017
    on("POST", "/add", function () {
        $controller = new ActivityController();
        $controller->add();
    });
    // Edit 29-OCT-2018
    on("GET", "/:activity_id/edit", function () {
        $controller = new ActivityController();
        $activity_id = params("activity_id");
        $controller->edit($activity_id, 'edit');
    });
    // Update 30-OCT-2018
    on("POST", "/:activity_id/update", function () {
        $controller = new ActivityController();
        $activity_id = params("activity_id");
        $controller->update($activity_id);
    });
});

//Job Performance Report
prefix("job-performance-report", function() {
	// index
	on("GET", "/index", function() {
		$controller = new JobPerformanceReportController();
		$controller->index();
	});

	on("POST", "/ajax_report", function() {
		$controller = new JobPerformanceReportController();
		$params = $_POST;
		$controller->ajax_report($params);
	});
	
	//Report scheduler
	on("GET", "/jpr_scheduler", function() {
		$controller = new JobPerformanceReportController();
		$controller->JPR_Scheduler();
	});

    //Report History scheduler
  on("GET", "/jprhistory_scheduler", function() {
    $controller = new JobPerformanceReportController();
    $controller->JPRHistory_Scheduler();
  });

  // index
  on("POST", "/export", function() {
    $controller = new JobPerformanceReportController();
    $params = $_POST;
    $controller->exportExcel($params);
  });

  // common Ajax Functions
  on("POST", "/common_ajax", function() {
      $controller = new JobPerformanceReportController();
      $controller->commonAjax();
  });
	
});

  //demtk revenue report.............8-8-2019
  prefix("demtk-revenue-report", function() {
  // index
  on("GET", "/index", function() {
    $controller = new DemtkRevenueReportController();
    $controller->index();
  });

  // index
  on("GET", "/export", function() {
    $controller = new DemtkRevenueReportController();
    $controller->exportExcel();
  });

  // common ajax
  on("POST", "/common_ajax", function() {
    $controller = new DemtkRevenueReportController();
    $controller->commonAjax();
  });
});

// Tank Core Data start ------------------------------------------------------------
prefix("tank_master", function() {
    
    on("GET", "/tank-data-list", function() {
        $controller = new TankMasterController();
        $controller->tankDataList();
    });
    on("GET", "/create-tank-data", function() {
        $controller = new TankMasterController();
        $controller->createTankData();
    });
    on("POST", "/add-datatype", function() {
        $controller = new TankMasterController();
        $controller->addTankData();
    });
    //update tank data
    on("POST", "/:tank_data_id/update-tank-data", function() {
        $controller = new TankMasterController();
        $tank_data_id = params("tank_data_id");
        $controller->updateTankData($tank_data_id);
    });
    on("GET", "/:tank_data_id/edit-tank-data", function() {
        $controller = new TankMasterController();
        $tank_data_id = params("tank_data_id");
        $form = 'edit';
        $controller->editTankData($tank_data_id,$form);
    });
    // Delete tank data
    /* on("POST", "/:tank_data_id/delete-tank-data", function() {
        $controller = new TankMasterController();
        $tank_data_id = params("tank_data_id");
        $controller->deleteTankData($tank_data_id);
    }); */
    // common ajax
    on("POST", "/common_ajax", function() {
        $controller = new TankMasterController();
        $controller->commonAjax();
    });
    // Save ownership
    on("POST", "/save-tank-ownership", function() {
        $controller = new TankMasterController();
        $controller->saveTankOwnership();
    });
});

//Core data Exchange rate
prefix("exchange-rate",function(){
    //index
    on("GET", "/index", function() {
        $controller = new ExchangeRateController();
        $controller->index();
    });
    on("POST", "/update", function () {
        $controller = new ExchangeRateController();
        $controller->update();
    });

    on("GET", "/update-rate", function () {
        $controller = new ExchangeRateController();
        $controller->updateExchangeRate();
    });

    on("GET","/ajax-get-currency-list",function(){
      $controller = new ExchangeRateController();
      $controller->getCurrencyList();
    });

    on("POST","/ajax-get-rates",function(){
      $controller = new ExchangeRateController();
      $controller->updateNulExchangeRates();
    });
    
    on("POST", "/common_ajax", function () {
      $controller = new ExchangeRateController();
      $controller->commonAjax();
  });
});
        
//Core data Supplier rewrite
prefix("contact", function() {
    //index
    on("GET", "/index", function() {
        $controller = new ContactController();
        $controller->index();
    });
    //Delete
    on("POST", "/delete", function() {
        $controller = new ContactController();
        $controller->delete();
    });
});
// ------------------------ Currency core -------------------------------
prefix("currencies", function() {
  // index
  on("GET", "/index", function() {
    $controller = new CurrenciesController();
    $controller->index();
  });

  on("GET", "/add", function () {
        $controller = new CurrenciesController();
        $controller->add();
    });
    // common ajax DM-26-OCT-2017
    on("POST", "/add", function () {
        $controller = new CurrenciesController();
        $controller->create();
    });
    on("GET", "/:id/edit", function () {
      $controller = new CurrenciesController();
      $id = params("id");
      $controller->edit($id);
    });
    on("POST", "/:id/update", function () {
      $controller = new CurrenciesController();
      $id = params("id");
      $controller->update($id);
    });
    //Delete
    on("POST", "/delete", function() {
        $controller = new CurrenciesController();
        $controller->delete();
    });
});
//Job Performance Report
prefix("equipment", function() {
  // index
  on("GET", "/index", function() {
    $controller = new EquipmentMasterController();
    $controller->index();
  });
  // create
  on("GET", "/create", function() {
    $controller = new EquipmentMasterController();
    $controller->create();
  });
  // add
  on("POST", "/add", function() {
    $controller = new EquipmentMasterController();
    $controller->add();
  });
  // Edit 
  on("GET", "/:equipment_id/edit", function () {
      $controller = new EquipmentMasterController();
      $equipment_id = params("equipment_id");
      $controller->edit($equipment_id, 'edit');
  });
  // Update
  on("POST", "/:equipment_id/update", function () {
      $controller = new EquipmentMasterController();
      $equipment_id = params("equipment_id");
      $controller->update($equipment_id, 'edit');
  });
  // Delete function 25-OCT-2018
  on("POST", "/:equipment_id/delete", function () {
      $equipment_id = params("equipment_id");
      $controller = new EquipmentMasterController();
      $controller->delete($equipment_id);
  });
  // Common ajax
  on("POST", "/common_ajax", function () {
      $controller = new EquipmentMasterController();
      $controller->commonAjax();
  });
});

//Core data Supplier rewrite
prefix("supplier-core", function() {
    //index
    on("GET", "/index", function() {
        $controller = new SupplierCoreController();
        $controller->index();
    });
    on("GET", "/qsshe_index", function() {
        $controller = new SupplierCoreController();
        $controller->qsshe_index();
    });
    on("POST", "/qsshe_index", function() {
        $controller = new SupplierCoreController();
        $controller->qsshe_index();
    });
    on("GET", "/accounts_index", function() {
        $controller = new SupplierCoreController();
        $controller->accounts_index();
    });
    on("GET", "/invoicing_index", function() {
        $controller = new SupplierCoreController();
        $controller->invoicing_index();
    });
    on("GET", "/procurement_index", function() {
        $controller = new SupplierCoreController();
        $controller->procurement_index();
    });
    on("GET", "/operation_index", function() {
        $controller = new SupplierCoreController();
        $controller->operations_index();
    });
    on("GET", "/create", function () {
        $controller = new SupplierCoreController();
        $controller->create();
    });
    on("POST", "/add", function () {
        $controller = new SupplierCoreController();
        $controller->add();
    });
    // common ajax
    on("POST", "/common_ajax", function() {
        $controller = new SupplierCoreController();
        $controller->commonAjax();
    });
    on("GET", "/:id/edit", function () {
        $controller = new SupplierCoreController();
        $id = params("id");
        $controller->edit($id);
    });
    on("POST", "/:id/update", function () {
        $controller = new SupplierCoreController();
        $id = params("id");
        $controller->update($id);
    });
    //Delete
    on("POST", "/delete", function() {
        $controller = new SupplierCoreController();
        $controller->delete();
    });

    on("POST", "/upload-supplier-qsshe-file", function() {
        $controller = new SupplierCoreController();
        $controller->qssheFileUpload();
    });
    
    on("GET", "/supplier-qsshe-email-files", function () {
        $controller = new SupplierCoreController();
        $controller->supplierQssheEmailFiles();
    });

    on("POST", "/supplier-qsshe-email-files", function () {
        $controller = new SupplierCoreController();
        $controller->supplierQssheEmailFiles();
    });

    // Mail view
   on("GET", "/:email_id/supplier-qsshe-email-file-details", function() {
    $controller = new SupplierCoreController();
    $email_id = params("email_id");
    $controller->supplierQssheEmailFileDetails($email_id);
   });
});
//Core data Country rewrite
prefix("country", function() {
    on("GET", "/index", function() {
        $controller = new CountryController();
        $controller->index();
    });
    // common ajax
    on("POST", "/common_ajax", function() {
        $controller = new CountryController();
        $controller->commonAjax();
    });
    //Delete
    on("POST", "/delete", function() {
        $controller = new CountryController();
        $controller->delete();
    });
    on("GET", "/create", function () {
        $controller = new CountryController();
        $controller->create();
    });
    on("POST", "/add", function () {
        $controller = new CountryController();
        $controller->add();
    });
    on("GET", "/:id/edit", function () {
        $controller = new CountryController();
        $id = params("id");
        $controller->edit($id);
    });
    on("POST", "/:id/update", function () {
        $controller = new CountryController();
        $id = params("id");
        $controller->update($id);
    });
});
//Core data City rewrite
prefix("supplier-city", function() {
    on("GET", "/index", function() {
        $controller = new SupplierCityController();
        $controller->index();
    });
    // common ajax
    on("POST", "/common_ajax", function() {
        $controller = new SupplierCityController();
        $controller->commonAjax();
    });
    //Delete
    on("POST", "/delete", function() {
        $controller = new SupplierCityController();
        $controller->delete();
    });
    on("GET", "/create", function () {
        $controller = new SupplierCityController();
        $controller->create();
    });
    on("POST", "/add", function () {
        $controller = new SupplierCityController();
        $controller->add();
    });
    on("GET", "/:id/edit", function () {
        $controller = new SupplierCityController();
        $id = params("id");
        $controller->edit($id);
    });
    on("POST", "/:id/update", function () {
        $controller = new SupplierCityController();
        $id = params("id");
        $controller->update($id);
    });
});
//Address list page rewritten DM-20-sep-2018 start
prefix("address", function() {
    // Index
    on("GET", "/index", function() {
        $controller = new AddressController();
        $controller->index();
    });
        // Create
    on("GET", "/create", function() {
         $controller = new AddressController();
         $controller->create();
    });
    on("GET", "/:address_id/addressedit", function() {
        $controller = new AddressController();
        $form = 'edit';
        $address_id = params("address_id");
        $controller->addressEdit($form,$address_id);
    });
        // Create
    on("POST", "/add", function() {
        $controller = new AddressController();
        $controller->addAddress();
    });
        // Create
    on("POST", "/:address_id/update", function() {
        $controller = new AddressController();
        $address_id = params("address_id");
        $controller->updateAddress($address_id);
    });
     // common ajax DM-21-Jul-2017
    on("POST", "/common_ajax", function() {
        $controller = new AddressController();
        $controller->commonAjax();
    });
    // Delete
    on("POST", "/delete", function() {
        $controller = new AddressController();
        $controller->deleteAddress();
    });  
});
// Zoom API 
prefix("zoom", function() {
  // index
  on("POST", "/common_ajax", function() {
    $controller = new ZoomAPIController();
    $controller->commonAjax();
  });
  // index
  on("GET", "/index", function() {
    $controller = new ZoomAPIController();
    $controller->index();
  });
});

prefix("tank-core-new", function() {
    // index
    on("GET", "/index", function() {
        $controller = new TankCoreNewController();
        $controller->index();
    });
    // Common ajax
    on("POST", "/common_ajax", function () {
        $controller = new TankCoreNewController();
        $controller->commonAjax();
    });
    // create
    on("GET", "/create", function() {
        $controller = new TankCoreNewController();
        $controller->create();
    });
    // add
    on("POST", "/add", function() {
        $controller = new TankCoreNewController();
        $controller->add();
    });
    //edit
    on("GET", "/:tank_id/edit", function () {
        $controller = new TankCoreNewController();
        $tank_id = params("tank_id");
        $controller->edit($tank_id);
    });
    // Update
    on("POST", "/:tank_id/update", function () {
        $controller = new TankCoreNewController();
        $tank_id = params("tank_id");
        $controller->update($tank_id);
    });
    //tank exist
    on("POST", "/tank_exist", function() {
        $controller = new TankCoreNewController();
        $controller->tank_exist();
    });
    // Delete
    on("POST", "/:tank_id/delete", function() {
        $controller = new TankCoreNewController();
        $tank_id = params("tank_id");
        $controller->delete($tank_id);
    });
    //upload
    on("POST", "/upload", function() {
        $controller = new TankCoreNewController();
        $controller->upload();
    });
    // Save ownership
    on("POST", "/save-tank-ownership", function() {
        $controller = new TankCoreNewController();
        $controller->saveTankOwnership();
    });
});

//job Common Instruction rewrite
prefix("instructions", function() {
    on("GET", "/:type/commonInstruction/:jobno/:pl_id", function() {
        $controller = new JobInstructionCommonController();
        $type    = params("type");
        $job_num = params("jobno");
        $pl_id   = params("pl_id");
        $controller->commonInstruction($type,$job_num,$pl_id);
    });
    on("GET", "/:type/commonInstruction/:jobno/", function() {
        $controller = new JobInstructionCommonController();
        $type    = params("type");
        $job_num = params("jobno");
        $controller->commonInstruction($type,$job_num);
    });
    // Clean Instruction Post
    on("POST", "/clean-instruction-pdf", function() {
        $controller = new JobInstructionCommonController();
        $controller->clean_pdf_render();
    });
    //Heat Generation POST
    on("POST", "/generate-heat-pdf", function() {
        $controller = new JobInstructionCommonController();
        $controller->heat_instruction_pdf_render();
    });
    on("POST", "/generate-sety-pdf/", function() {
        $controller = new JobInstructionCommonController();
        $controller->sety_pdf_render();
    });
    on("POST", "/generate-tip-pdf/", function() {
        $controller = new JobInstructionCommonController();
        $controller->tip_pdf_render();
    });
     on("POST", "/generate-load-pdf/", function() {
        $controller = new JobInstructionCommonController();
        $controller->load_pdf_render();
    });
    on("POST", "/generate-ship-pdf/", function() {
        $controller = new JobInstructionCommonController();
        $controller->ship_safety_pdf_render();
    });
});
// Metabase
prefix("metabase", function() {
    // index
    on("GET", "/index", function() {
        $controller = new MetaBaseController();
        $controller->index();
    });
    on("POST", "/common-ajax", function() {
        $controller = new MetaBaseController();
        $controller->commonAjax();
    });
});
//Tank Performance Report
prefix("tank-performance", function() {
  // Index
  on("GET", "/index", function() {
      $controller = new TankPerformanceController();
      $controller->index();
  });

  on("POST", "/common-ajax", function() {
      $controller = new TankPerformanceController();
      $controller->commonAjax();
  });
});

prefix("supplier-report", function() {
  // Index
  on("GET", "/index", function() {
      $controller = new CommonReportController();
      $controller->index();
  });
  // Common Ajax
  on("POST", "/common-ajax", function() {
      $controller = new CommonReportController();
      $controller->commonAjax();
  });
});
// Account export  costs new
prefix("account-export-costs", function() {

  on("GET", "/index", function() {
      $controller = new CommonReportController();
      $controller->getAccountExportCost();
  });

  on("POST", "/index", function() {
      $controller = new CommonReportController();
      $controller->getAccountExportCost();
  });

  //Common Ajax
  on("POST", "/common-ajax", function() {
    $controller = new CommonReportController();
    $controller->commonAjax();
  });
});
//GPS - Azure Storage
prefix("gps-settings", function() {
  // index
  on("GET", "/dashboard", function() {
    $controller = new GPSSettingsController();
    $controller->view();
  });
  // Get tanknumbers for GPS
  on("GET", "/get-tanknumbers-gps", function() {
    $controller = new GPSSettingsController();
    $controller->getTankNumberForGPS();
  });
  // Common ajax
  on("POST", "/common-ajax", function() {
    $controller = new GPSSettingsController();
    $controller->commonAjax();
  });
});
// Tank Core Data start ------------------------------------------------------------
prefix("tank-core", function() {
    
    // Index
    on("GET", "/index", function() {
        $controller = new TankCoreController();
        $controller->index();
    });
        
    // Create
    on("GET", "/create", function() {
        $controller = new TankCoreController();
        $controller->create();
    });
        
    // Create
    on("POST", "/intermediate-page", function() {
        $controller = new TankCoreController();
        $page = 2;
        $source = 'direct';
        $controller->create($page,$source);
    });
        
    // Create backbutton
    on("POST", "/backbutton", function() {
        $controller = new TankCoreController();
        $page = 1;
        $source = 'back';
        $controller->create($page,$source);
    });
        
    // Create
    on("POST", "/add", function() {
        $controller = new TankCoreController();
        $controller->add();
    });
        
    on("POST", "/tank_exist", function() {
        $controller = new TankCoreController();
        $controller->tank_exist();
    });
    // Edit
    on("GET", "/:tank_id/edit", function() {
        $controller = new TankCoreController();
        $tank_id = params("tank_id");
        $form = 'edit';
        $controller->edit($tank_id,$form);
    });
        
    // Edit intermediate page
    on("POST", "/:tank_id/intermediate-page-edit", function() {
        $controller = new TankCoreController();
        $tank_id = params("tank_id");
        $form = 'edit';
        $page = 2;
        $source = 'direct';
        $controller->edit($tank_id,$form,$page,$source);
    });
        
    // Edit backbutton
    on("POST", "/:tank_id/backbutton-edit", function() {
        $controller = new TankCoreController();
        $tank_id = params("tank_id");
        $form = 'edit';
        $page = 1;
        $source = 'back';
        $controller->edit($tank_id,$form,$page,$source);
    });
        
    // Update
    on("POST", "/:tank_id/update", function() {
        $controller = new TankCoreController();
        $tank_id = params("tank_id");
        $controller->update($tank_id);
    });
    // Delete
    on("POST", "/:tank_id/delete", function() {
        $controller = new TankCoreController();
        $tank_id = params("tank_id");
        $controller->delete($tank_id);
    });
        
    // common ajax
    on("POST", "/common_ajax", function() {
        $controller = new TankCoreController();
        $controller->commonAjax();
    });
        
    on("POST", "/upload", function() {
        $controller = new TankCoreController();
        $controller->upload();
    });
        
    // write data from db
    on("GET", "/:doc_id/writedoc", function() {
        $controller = new TankCoreController();
        $doc_id = params("doc_id");
        $controller->writedoc($doc_id);
    });
        
    on("GET", "/tank-data-list", function() {
        $controller = new TankCoreController();
        $controller->tankDataList();
    });
        
    on("GET", "/create-datatype", function() {
        $controller = new TankCoreController();
        $controller->createTankData();
    });
        
    on("POST", "/add-datatype", function() {
        $controller = new TankCoreController();
        $controller->addTankData();
    });
        
    on("GET", "/:tank_data_id/edit-tank-data", function() {
        $controller = new TankCoreController();
        $tank_data_id = params("tank_data_id");
        $form = 'edit';
        $controller->editTankData($tank_data_id,$form);
    });
    //update tank data
    on("POST", "/:tank_data_id/update-tank-data", function() {
        $controller = new TankCoreController();
        $tank_data_id = params("tank_data_id");
        $controller->updateTankData($tank_data_id);
    });
        
    // Delete tank data
    on("POST", "/:tank_data_id/delete-tank-data", function() {
        $controller = new TankCoreController();
        $tank_data_id = params("tank_data_id");
        $controller->deleteTankData($tank_data_id);
    });
        
    // Duplicate Tank
    on("GET", "/:tank_id/duplicate", function() {
        $controller = new TankCoreController();
        $tank_id = params("tank_id");
        $form = 'duplicate';
        $page = 1;
        $source = 'direct';
        $controller->edit($tank_id,$form,$page,$source);
    });
    
    on("GET", "/profile-index", function() {
        $controller = new TankCoreController();
        $controller->getTankProfile();
    });
    
    on("GET", "/profile-create", function() {
        $controller = new TankCoreController();
        $controller->createTankProfile();
    });

    on("POST", "/profile-add", function() {
        $controller = new TankCoreController();
        $controller->addTankProfile();
    });
    //tank profile exist
    on("POST", "/tank-profile-exist", function() {
        $controller = new TankCoreController();
        $controller->tankProfileExist();
    });                                                     

    on("GET", "/:tank_id/profile-edit", function() {
        $controller = new TankCoreController();
        $tank_id = params("tank_id");
        $form = 'edit';
        $controller->editTankProfile($tank_id,$form);
    }); 
    // Update
    on("POST", "/:tank_id/profile-update", function() {
        $controller = new TankCoreController();
        $tank_id = params("tank_id");
        $controller->updateTankProfile($tank_id);
    }); 

    // Delete
    on("POST", "/:tank_id/profile-delete", function() {
        $controller = new TankCoreController();
        $tank_id = params("tank_id");
        $controller->deleteTankProfile($tank_id);
    }); 

    on("POST", "/profile-upload", function() {
        $controller = new TankCoreController();
        $controller->profileUpload();
    });
    on("POST", "/damage_upload", function() {
        $controller = new TankCoreController();
        $controller->damageFileUpload();
    });

    // Create Batch
    on("GET", "/create_batch", function() {
        $controller = new TankCoreController();
        $controller->createBatch();
    });  
    // Create Batch 
    on("POST", "/intermediate-batches-edit", function() {
        $controller = new TankCoreController();
        $controller->intermediate_batch_page();
    }); 
    //make tank series available for final save and allocation
    on("POST", "/make-available", function() {
        $controller = new TankCoreController();
        $controller->make_available();
    });

    //Last Stage of Tank Creation
    on("POST", "/create_tanks", function() {
        $controller = new TankCoreController();
        $controller->create_tanks_plans();
    });

    // Create backbutton for Tank Series
    on("POST", "/back-button-tank-series", function() {
        $controller = new TankCoreController();
        $controller->intermediate_batch_page_back();
    });
    // Create backbutton for Tank Series
    on("POST", "/back-button-create-batch", function() {
        $controller = new TankCoreController();
        $controller->createBatchBack();
    });
    on("GET", "/update-nominal-capacity", function() {
      $controller = new TankCoreController();
      $controller->updateTankNominal();
  });        
});

// Supplier Ancillary routes ------------------------------------------------------
prefix("supplier-ancillary", function() {

  // Index
  on("GET", "/index", function() {
    $controller = new SupplierAncillaryController();
    $ancillary_type = "storage-rates";
    $controller->index($ancillary_type);
  });

  on("GET", "/:ancillary_type/index", function() {
    $controller = new SupplierAncillaryController();
    $ancillary_type = params("ancillary_type");
    $controller->index($ancillary_type);
  });

  on("POST", "/:ancillary_type/index", function() {
    $controller = new SupplierAncillaryController();
    $ancillary_type = params("ancillary_type");
    $controller->index($ancillary_type);
  });

  on("GET", "/:ancillary_type/add", function() {
    $controller = new SupplierAncillaryController();
    $ancillary_type = params("ancillary_type");
    $controller->add($ancillary_type);
  });

  on("POST", "/:ancillary_type/add", function() {
    $controller = new SupplierAncillaryController();
    $ancillary_type = params("ancillary_type");
    $controller->add($ancillary_type);
  });

  on("GET", "/:ancillary_type/:id/edit", function() {
    $controller = new SupplierAncillaryController();
    $ancillary_type = params("ancillary_type");
    $form = 'edit';
    $id = params("id");
    $controller->edit($ancillary_type, $id, $form);
  });

  on("POST", "/:ancillary_type/:id/edit", function() {
    $controller = new SupplierAncillaryController();
    $ancillary_type = params("ancillary_type");
    $form = 'edit';
    $id = params("id");
    $controller->edit($ancillary_type, $id, $form);
  });

  on("POST", "/common_ajax", function() {
    $controller = new SupplierAncillaryController();
    $controller->commonAjax();
  });

  on("POST", "/:ancillary_type/:id/delete", function() {
    $controller = new SupplierAncillaryController();
    $ancillary_type = params("ancillary_type");
    $id = params("id");
    $controller->delete($ancillary_type, $id);
  });

  // Duplicate
  on("GET", "/:ancillary_type/:id/duplicate", function() {
    $controller = new SupplierAncillaryController();
    $ancillary_type = params("ancillary_type");
    $form = 'duplicating';
    $id = params("id");
    $controller->edit($ancillary_type, $id, $form);
  });

  // Upload file and create attachment
  on("POST", "/:ancillary_type/upload", function() {
    $ancillary_type = params("ancillary_type");
    $controller = new SupplierAncillaryController();
    $controller->upload($ancillary_type);
  });

  // Delete cost file
  on("POST", "/:ancillary_type/deleteFile", function() {
    $ancillary_type = params("ancillary_type");
    $controller = new SupplierAncillaryController();
    $controller->deleteFile($ancillary_type);
  });

  // Extras
  on("GET", "/:ancillary_type/supplier-cost-files-info/:cost_id", function() {
    $ancillary_type = params("ancillary_type");
    $cost_id = params("cost_id");
    $controller = new SupplierAncillaryController();
    $controller->supplier_cost_files_info($ancillary_type, $cost_id);
  });

  //Upload the file
    on("POST", "/mrupload", function() {
        $controller = new SupplierAncillaryController();
        $controller->mrupload();
    });

    //manage csv
    on("GET", "/manage-csv/:action", function() {
    $controller = new SupplierAncillaryController();
    $action = params("action");
    $controller->manage_csv($action);
  });

  on("POST", "/storage-rates/import", function() {
    $controller = new SupplierAncillaryController();
    $controller->bulkImportCSV();
  });
  
  on("GET", "/storage-rates/import", function() {
    $controller = new SupplierAncillaryController();
    $controller->bulkImportCSV();
  });

});


prefix("summary-invoice", function() {
	// Index
	on("GET", "/index", function() {
		$controller = new SummaryInvoiceController();
		$controller->index();
	});
	on("GET", "/create", function() {
		$controller = new SummaryInvoiceController();
		$controller->create();
	});
	on("POST", "/create-summary-po", function() {
		$controller = new SummaryInvoiceController();
		$controller->add();
	});
	on("GET", "/:id/edit", function() {
		$id = params("id");
		$controller = new SummaryInvoiceController();
		$controller->edit($id);
	});
  on("POST", "/:id/edit", function() {
    $id = params("id");
    $controller = new SummaryInvoiceController();
    $controller->generateSumaryInvoice($id);
  });

  on("GET", "/:id/preview-su-pdf", function() {
    $id = params("id");
    $controller = new SummaryInvoiceController();
    $controller->generateSumaryInvoice($id);
  });
	
	on("GET", "/:id/link-to-summary", function() {
		$id = params("id");
		$controller = new SummaryInvoiceController();
		$controller->linkToSummary($id);
	});
  
	on("POST", "/common_ajax", function() {
	    $controller = new SummaryInvoiceController();
	    $controller->commonAjax();
	});
	  
	on("GET", "/:id/export", function() {
	  	$id = params("id");
	  	$controller = new SummaryInvoiceController();
	  	$controller->exportInvoiceExcel($id);
	});
  on("GET", "/:id/edit-summary-main", function() {
      $id = params("id");
      $controller = new SummaryInvoiceController();
      $controller->editMainData($id);
  });
	
	on("POST", "/:id/update-summary-po", function() {
		$id = params("id");
		$controller = new SummaryInvoiceController();
		$controller->updateMainData($id);
	});

  on("GET", "/unlink-overview", function() {
      $controller = new SummaryInvoiceController();
      $controller->unLinkOverView();
  });
	
});

// DeepSea Job  ------------------------------------------------------
prefix("deepsea-jobgroup", function() {

  // Index
  on("GET", "/index", function() {
    $controller = new DsJobGroupController();
    $controller->ds_job_group_listing("live");
  }); 
  // Index
  on("POST", "/common_ajax", function() {
    $controller = new DsJobGroupController();
    $controller->commonAjax();
  });
  // Job File upload
  on("POST", "/jobF-fle-upload", function() {
      $controller = new DsJobGroupController();
      $controller->jobFileUpload();
  });
  

});

// ------------------------------------ QSSHE controller start------------------------------------
prefix("qsshe", function() {

// common
  on("POST", "/common_ajax", function() {
    $controller = new QssheController();
    $controller->commonAjax();
  });

  // Index
  on("GET", "/index", function() {
    $controller = new QssheController();
    $controller->index();
  }); 

  on("GET", "/:id/edit", function() {
    $controller = new QssheController();
    $id = params("id");
    $controller->edit($id);
  });

  on("POST", "/:id/update", function() {
    $controller = new QssheController();
    $id = params("id");
    $controller->update($id);
  });
  on("GET", "/:id/:type/qsshe_doc", function() {
    $controller = new QssheController();
    $id = params("id");
    $type = params("type");
    $controller->editDocument($id, $type);
  });

  on("POST", "/:id/:type/process_doc", function() {
    $controller = new QssheController();
    $id = params("id");
    $type = params("type");
    $controller->processDocument($id, $type);
  });

   // Mail job file 
  on("GET", "/qsshe-email-files", function() {
    $controller = new QssheController();
    $controller->qssheEmailFiles();
  });

  on("POST", "/qsshe-email-files", function() {
    $controller = new QssheController();
    $controller->qssheEmailFiles();
  });

  on("GET", "/:email_id/qsshe-email-file-details", function() {
    $controller = new QssheController();
    $email_id = params("email_id");
    $controller->jobEmailFileDetails($email_id);
  });

  // Replay Mail 
  on("GET", "/:email_id/qsshe-email-reply", function() {
    $controller = new QssheController();
    $email_id = params("email_id");
    $controller->jobEmailReply($email_id);
  });
  
  // Replay Mail 
  on("POST", "/:email_id/qsshe-email-reply", function() {
    $controller = new QssheController();
    $email_id = params("email_id");
    $controller->jobEmailReply($email_id);
  });

});
// ------------------------------------ QSSHE controller end------------------------------------
// Lease agreements
prefix("lease", function() {
  // Index
  on("GET", "/index", function() {
    $controller = new LeaseController();
    $controller->index();
  });
  // Create
  on("GET", "/create", function() {
    $controller = new LeaseController();
    $controller->create();
  });  
  // Add
  on("POST", "/add", function() {
    $controller = new LeaseController();
    $controller->add();
  }); 
  on("GET", "/:lease_id/edit", function() {
    $lease_id = params("lease_id");
    $controller = new LeaseController();
    $form = 'edit';
    $controller->edit($lease_id, $form);
  });
  on("POST", "/:lease_id/update", function() {
    $lease_id = params("lease_id");
    $controller = new LeaseController();
    $controller->update($lease_id);
  });
  // Delete
  on("POST", "/:lease_id/delete", function() {
      $controller = new LeaseController();
      $lease_id = params("lease_id");
      $controller->delete($lease_id);
  });
  // Delete
  on("POST", "/common-ajax", function() {
      $controller = new LeaseController();
      $controller->commonAjax();
  });
  on("POST", "/:lease_id/update-tank-lease", function() {
    $lease_id = params("lease_id");
    $controller = new LeaseController();
    $controller->updateTankLease($lease_id);
  });
  on("GET", "/update-existing-tanks", function() {
    $controller = new LeaseController();
    $controller->updateExistingTanks();
  });
});

//---------------UN LoCodes
prefix("unlocodes", function() {
    // Index
    on("GET", "/index", function() {
        $controller = new UnLocodesController();
        $controller->index();
    });
    // Delete
    on("POST", "/delete", function() {
        $controller = new UnLocodesController();
        $controller->delete();
    });
    // Create
    on("GET", "/create", function() {
        $controller = new UnLocodesController();
        $controller->create();
    });
    on("POST", "/create", function() {
        $controller = new UnLocodesController();
        $controller->create();
    });
    // Edit
    on("GET", "/:un_id/edit", function() {
        $un_id = params("un_id");
        $controller = new UnLocodesController();
        $form = 'edit';
        $controller->edit($un_id, $form);
    });
    on("POST", "/:un_id/edit", function() {
        $un_id = params("un_id");
        $controller = new UnLocodesController();
        $form = 'edit';
        $controller->edit($un_id, $form);
    });
    // Process import
    on("POST", "/process_import", function() {
        $params = array('file' => files('file'));
        $controller = new UnLocodesController();
        $controller->process_import($params);
    });
    //Common ajax
    on("POST", "/common_ajax", function() {
        $controller = new UnLocodesController();
        $controller->commonAjax();
    });
    on("GET", "/codelist", function() {
        $controller = new UnLocodesController();
        $controller->codelist();
    });
});
    
//---------------GeoFence 
prefix("geofence", function() {
    // Index
    on("GET", "/index", function() {
        $controller = new GeoFenceController();
        $controller->index();
    });
    // Delete
    on("POST", "/delete", function() {
        $controller = new GeoFenceController();
        $controller->delete();
    });
    // Create
    on("GET", "/create", function() {
        $controller = new GeoFenceController();
        $controller->create();
    });
    on("POST", "/create", function() {
        $controller = new GeoFenceController();
        $controller->create();
    });
    // Edit
    on("GET", "/:gm_id/edit", function() {
        $gm_id = params("gm_id");
        $controller = new GeoFenceController();
        $form = 'edit';
        $controller->edit($gm_id, $form);
    });
    on("POST", "/:gm_id/edit", function() {
        $gm_id = params("gm_id");
        $controller = new GeoFenceController();
        $form = 'edit';
        $controller->edit($gm_id, $form);
    });
    //Common ajax
    on("POST", "/common_ajax", function() {
        $controller = new GeoFenceController();
        $controller->commonAjax();
    });
    // Index
    on("GET", "/checkgeofence", function() {
        $controller = new GeoFenceController();
        $controller->checkgeofenceposition();
    });
});
    
// --------- Batch Invoice controller Start ----------------------------------
prefix("batch-invoice", function() {
  // Index
  on("GET", "/index", function() {
    $controller = new BatchInvoiceController();
    $controller->index();
  });
  on("POST", "/generate", function() {
    $controller = new BatchInvoiceController();
    $controller->generateInvoice();
  });
  on("GET", "/:id/preview-demtk-pdf", function() {
    $controller = new BatchInvoiceController();
    $id = params("id");
    $controller->generateDEMTKPrevInvoice($id);
  });
});
// --------- Batch Invoice  controller End------------------------------------
//Core data Country rewrite
prefix("region", function() {
    on("GET", "/index", function() {
        $controller = new RegionController();
        $controller->index();
    });
    // common ajax
    on("POST", "/common_ajax", function() {
        $controller = new RegionController();
        $controller->commonAjax();
    });
    //Delete
    on("POST", "/delete", function() {
        $controller = new RegionController();
        $controller->delete();
    });
    on("GET", "/create", function () {
        $controller = new RegionController();
        $controller->create();
    });
    on("POST", "/add", function () {
        $controller = new RegionController();
        $controller->add();
    });
    on("GET", "/:id/edit", function () {
        $controller = new RegionController();
        $id = params("id");
        $controller->edit($id);
    });
    on("POST", "/:id/update", function () {
        $controller = new RegionController();
        $id = params("id");
        $controller->update($id);
    });
});

//Volume Report Rewrite
prefix("volreport",function(){
    //index
    on("GET", "/index", function() {
        $controller = new VolumeReportController();
        $controller->index();
    });
});

    //Volume Report Rewrite
    prefix("brexit",function(){
        //
        on("GET", "/:type/:jobnum/declaration-type", function() {
            $controller = new BrexitController();
            $type = params("type");
            $jobnum = params("jobnum");
            $controller->declarationTypeInfo($type,$jobnum);
        });
        
        on("GET", "/:job_number/getxml", function() {
            $job = params("job_number");
            $controller = new BrexitController();
            $controller->generateDeclarationXML($job);
        });
      	// check xml errors
      	on("GET", "/checkfor-brexit-error-xml", function() {
      		$controller = new BrexitController();
      		$controller->checkBrexitXMLErrors();
      	    });
      	// check xml errors
      	on("GET", "/move-zip-file", function() {
      		$controller = new BrexitController();
      		$controller->moveZipFile();
      	    });
      	    // check xml errors
      	on("GET", "/create", function() {
      		$controller = new BrexitController();
      		$controller->create();
      	    });
      	// check xml errors
      	on("POST", "/common-ajax", function() {
      		$controller = new BrexitController();
      		$controller->commonAjax();
      	    });
      	//getBrexitSupportingDocuments
      	// check xml errors
      	on("GET", "/get-supporting-documents", function() {
      		$controller = new BrexitController();
      		$controller->getBrexitSupportingDocuments();
        });
  	    on("POST", "/:type/:job_num/declarationCreate", function() {
  	        $type = params("type");
  	        $jobnum = params("job_num");
  	        $controller = new BrexitController();
  	        $controller->declarationCreate($type,$jobnum);
  	    });
        on("GET", "/:type/:job_num/getpdf", function() {
            $type = params("type");
            $jobnum = params("job_num");
            $controller = new BrexitController();
            $controller->getPdf($type, $jobnum);
        });
    });

prefix("jtcommon-quotes", function() {
    on("POST", "/common_ajax", function() {
        $controller = new JTCommonController();
        $controller->commonAjax();
    });
});

// Consignee routes ------------------------------------------------------------
    prefix("consignees", function() {
        
        // common ajax
        on("POST", "/common_ajax", function() {
            $controller = new ConsigneesController();
            $controller->commonAjax();
        });
        
        // Index
        on("GET", "/index", function() {
            $controller = new ConsigneesController();
            $controller->index();
        });
        //Delete the consignee
        on("POST", "/delete", function() {
            $controller = new ConsigneesController();
            $controller->delete();
        });
            //Consignee create
        on("GET", "/create", function() {
            $controller = new ConsigneesController();
            $controller->create();
        });
            //Consignee detail creation
        on("POST", "/add", function() {
            $controller = new ConsigneesController();
            $controller->consigneeAdd();
        });
            //Edit Consignee details
        on("GET", "/:consig_id/edit", function() {
            $controller = new ConsigneesController();
            $consig_id = params("consig_id");
            $controller->consigneeEdit($consig_id);
        });
            // Update the Consignee details
        on("POST", "/:consig_id/update", function() {
            $controller = new ConsigneesController();
            $consig_id = params("consig_id");
            $controller->consigneeUpdate($consig_id);
        });
        //Delete the customer
        on("POST", "/delete", function() {
            $controller = new ConsigneesController();
            $controller->delete();
        });
        //Get auto suggestion consignee name or custcodes
        on("GET", "/get_consignees", function() {
            $controller = new ConsigneesController();
            $controller->getConsignee();
        });

        //Upload the file
        on("POST", "/upload", function() {
            $controller = new ConsigneesController();
            $controller->upload();
        });
        
    });

// Rewrite Invoice Report
prefix("invoice-report", function() {
    // index
    on("GET", "/index", function() {
        $controller = new InvoiceReportController();
        $controller->index();
    });
    //AJAX loading
    on("POST", "/common-ajax", function() {
        $controller = new InvoiceReportController();
        $controller->commonAjax();
    });
});

// Intermodal Route  ------------------------------------------------------------
prefix("intermodal-route", function() {
    
    // Index
    on("GET", "/index", function() {
        $controller = new InterModalRouteController();
        $controller->index();
    });
        
    // Create
    on("GET", "/create", function() {
        $controller = new InterModalRouteController();
        $controller->create();
    });
        
    // Create
    on("POST", "/add", function() {
        $controller = new InterModalRouteController();
        $controller->add();
    });
    
    // Edit
    on("GET", "/:route_id/edit", function() {
        $controller = new InterModalRouteController();
        $route_id = params("route_id");
        $form = 'edit';
        $controller->edit($route_id,$form);
    });
    
    // duplicate
    on("GET", "/:route_id/duplicate", function() {
        $controller = new InterModalRouteController();
        $form = 'duplicating';
        $route_id = params("route_id");
        $controller->edit($route_id,$form);
    });
    // Update
    on("POST", "/:route_id/update", function() {
        $controller = new InterModalRouteController();
        $route_id = params("route_id");
        $controller->update($route_id);
    });
    // Delete
    on("POST", "/:route_id/delete", function() {
        $controller = new InterModalRouteController();
        $route_id = params("route_id");
        $controller->delete($route_id);
    });
    
    on("POST", "/route_exist", function() {
        $controller = new InterModalRouteController();
        $controller->route_exist();
    });
});
                        
//cmr-tracker

prefix("cmr-tracker", function() {

    on("GET", "/index", function() {
        $controller = new CmrTrackerController();
        $controller->index();
    });
    on("GET", "/add", function() {
        $controller = new CmrTrackerController();
        $form = 'add';
        $controller->add($form);
      });
        
          // Create cmr tracker
      on("POST", "/add", function() {
        $controller = new CmrTrackerController();
        $controller->create();
      });

      on("GET", "/:cmr_tracker_id/edit", function() {
        $controller = new CmrTrackerController();
        $form = 'edit';
        $cmr_tracker_id = params("cmr_tracker_id");
        $controller->edit($cmr_tracker_id, $form);
      });
        
        // Update
      on("POST", "/:cmr_tracker_id/edit", function() {
        $controller = new CmrTrackerController();
        $cmr_tracker_id = params("cmr_tracker_id");
        $controller->update($cmr_tracker_id);
      });
        //Delete
      on("POST", "/delete", function() {
        $controller = new CmrTrackerController();
        $controller->delete();
      });
      on("POST", "/common_ajax", function() {
        $controller = new CmrTrackerController();
        $controller->commonAjax();
      });
});

prefix("customer-portal", function() {
  // Index
  on("GET", "/index", function() {
    $controller = new customerPortalController();
    $portal_type = "declaration";
    $controller->index($portal_type);
  });

  // Create
  on("GET", "/:cust_type/add", function() {
      $controller = new customerPortalController();
      $cust_type  = params("cust_type");
      $controller->add($cust_type);
  });
  
  on("GET", "/:cust_type/:declaration_id/items", function() {
      $controller = new customerPortalController();
      $cust_type  = params("cust_type");
      $declarationId  = params("declaration_id");
      $controller->items($cust_type, $declarationId);
  });

  on("POST", "/:cust_type/:declaration_id/items", function() {
      $controller = new customerPortalController();
      $cust_type  = params("cust_type");
      $declarationId  = params("declaration_id");
      $controller->items_save($cust_type, $declarationId);
  });
      
  // Create
  on("POST", "/:cust_type/create", function() {
      $controller = new customerPortalController();
      $cust_type  = params("cust_type");
      $controller->create($cust_type);
  });
      
  on("GET", "/:cust_type/index", function() {
    $controller = new customerPortalController();
    $cust_type = params("cust_type");
    $controller->index($cust_type);
  });

  // common ajax
  on("POST", "/common_ajax", function() {
      $controller = new customerPortalController();
      $controller->commonAjax();
  });
  
  on("GET", "/common_ajax", function() {
      $controller = new customerPortalController();
      $controller->commonAjax();
  });
  
  on("POST", "/delete", function() {
      $controller = new customerPortalController();
      $controller->delete();
  });

  // Edit
  on("GET", "/:cust_type/:id/edit", function() {
    $controller = new customerPortalController();
    $cust_type  = params("cust_type");
    $id         = params("id");
    $controller->edit($cust_type,$id);
  });
  
  // Create declaration from Template
  on("GET", "/:cust_type/:id/create-declaration", function() {
      $controller = new customerPortalController();
      $cust_type  = params("cust_type");
      $id         = params("id");
      $controller->createDeclaration($cust_type,$id);
  });
  
  // Update 
  on("POST", "/:cust_type/:id/update", function() {
     $controller = new customerPortalController();
     $cust_type  = params("cust_type");
     $id         = params("id");
     $controller->update($cust_type,$id);
  });
  
  // Autocomplete
  on("GET", "/get_trader", function() {
      $controller = new customerPortalController();
      $controller->getTraders();
  });
  
  on("GET", "/get_consignee", function() {
      $controller = new customerPortalController();
      $controller->getConsignee();
  });
  
  // Get tanknumbers for GPS
  on("GET", "/get-API-version", function() {
    $controller = new customerPortalController();
    $controller->getAPIVersion();
  });
  
  on("GET", "/get-gb-declaration", function() {
    $controller = new customerPortalController();
    $controller->getGBDeclaration();
  });

  on("GET", "/redirect-page", function() {
    $controller = new customerPortalController();
    $controller->redirecttoTemplate();
  });

  on("GET", "/get_iatacode", function() {
      $controller = new customerPortalController();
      $controller->getIataCode();
  });

  on("GET", "/get_unlocodes", function() {
      $controller = new customerPortalController();
      $controller->getUnLoCode();
  });

  on("GET", "/custom-fields", function() {
    $controller = new customerCustomFileldsController();
    $controller->index();
  });
  on("POST", "/custom-fields/common-ajax", function() {
      $controller = new customerCustomFileldsController();
      $controller->commonAjax();
  });
  on("GET", "/manage-xtrader-backend", function() {
      $controller = new customerPortalController();
      $controller->manageCustomerXtraderBackend();
  });
 
  on("GET", "/import-from-backend", function() {
      $controller = new customerPortalController();
      $controller->getImportDataFromBackend();
  });

});

// TPT Rental Data start ------------------------------------------------------------
prefix("tpt-rental", function() {
    
  // Index
  on("GET", "/index", function() {
      $controller = new TPTRentalController();
      $controller->index();
  });
      
  // Create
  on("GET", "/create", function() {
      $controller = new TPTRentalController();
      $controller->create();
  });
      
  on("POST", "/add", function() {
      $controller = new TPTRentalController();
      $controller->add();
  });

  on("GET", "/:tpt_rental_id/edit", function() {
      $controller = new TPTRentalController();
      $tpt_id = params("tpt_rental_id");
      $controller->edit($tpt_id, 'edit');
  });
      
  // Update
  on("POST", "/:tpt_rental_id/update", function() {
    $controller = new TPTRentalController();
    $tpt_rental_id = params("tpt_rental_id");
    $controller->update($tpt_rental_id);
  });

  // Delete
  on("POST", "/:tpt_rental_id/delete", function() {
    $tpt_rental_id = params("tpt_rental_id");
    $controller = new TPTRentalController();
    $controller->delete($tpt_rental_id);
  });     
  
  on("POST", "/upload", function() {
    $controller = new TPTRentalController();
    $controller->upload();
  });

  // Job manager
  on("GET", "/:job_id/rental", function() {
    $controller = new TPTRentalController();
    $job_id = params("job_id");
    $controller->jobRentalAgreement($job_id);
  });  

  // Job manager
  on("POST", "common-ajax", function() {
    $controller = new TPTRentalController();
    $controller->commonAjax();
  });
  
  on("GET", "/job-cost/:job_no/create", function() {
    $job_no = params("job_no");
    $controller = new TPTRentalController();
    $controller->createTempJobCost($job_no);
  });
  on("GET", "/job-cost/:job_cost_id/edit", function() {
    $job_cost_id = params("job_cost_id");
    $controller = new TPTRentalController();
    $controller->editTempJobCost($job_cost_id);
  });

  // Tpt allocated
  on("GET", "/tpt-allocated", function() {
    $controller = new TPTRentalController();
    $controller->tpt_allocated();
  });
});

// Storage Costs
prefix("storage-costs", function() {
  // index
  on("GET", "/index", function() {
      $controller = new StorageCostController();
      $controller->index();
  });
  //AJAX loading
  on("POST", "/common-ajax", function() {
      $controller = new StorageCostController();
      $controller->commonAjax();
  });

  //Listing GET AJAX
  on("GET", "/ajax-get-listing", function(){
    $controller = new StorageCostController();
    $controller->getListing();
  });
});
prefix("qsshe-template", function() {
  // index
  on("GET", "/create/:type/:supp_id/", function() {
      $controller = new SupplierQssheTemplateController();
      $controller->create(params("supp_id"), params("type"));
  });

  on("POST", "/save-template", function() {
      $controller = new SupplierQssheTemplateController();
      $controller->saveData();
  });
  on("POST", "/preview-qsshe", function() {
      $controller = new SupplierQssheTemplateController();
      $controller->privewQSSHETemplate();
  });

  
});

// Storage Costs
prefix("insurancepo", function() {
  // index
  on("GET", "/index", function() {
      $controller = new InsurancePoController();
      $controller->index();
  });
  // Create
  on("GET", "/create", function() {
    $controller = new InsurancePoController();
    $poNo = trim($_GET['po_number']);
    $controller->create($poNo);
  });
  // Create
  on("GET", "/create_po", function() {
    $controller = new InsurancePoController();
    $controller->createPo();
  });
  // common ajax
  on("POST", "/common_ajax", function() {
    $controller = new InsurancePoController();
    $controller->commonAjax();
  });
  on("GET", "/get_po_no_list", function() {
    $controller = new InsurancePoController();
    $controller->getPoNumberList();
  });
  on("GET", "/get_job_no_list", function() {
    $controller = new InsurancePoController();
    $controller->getJobNumberList();
  });
  on("POST", "/create_sub_po", function() {
    $controller = new InsurancePoController();
    $controller->createSubPo();
  });
  on("GET", "/:sub_id/edit", function() {
    $controller = new InsurancePoController();
    $sub_id = params("sub_id");
    $controller->edit($sub_id);
  });
  // Create
  on("POST", "/:po_id/update", function() {
    $controller = new InsurancePoController();
    $po_id  = params("po_id");
    $controller->update($po_id);
  });
  on("POST", "/delete", function() {
    $controller = new InsurancePoController();
    $controller->delete();
  });
  on("POST", "/subDelete", function() {
    $controller = new InsurancePoController();
    $controller->subDelete();
  });
});

// Claim
prefix("claim", function() {
    //index
    on("GET", "/index", function() {
        $controller = new ClaimController();
        $controller->index();
    });
    // Edit
    on("GET", "/:claim_id/edit", function() {
        $controller = new ClaimController();
        $claim_id = params("claim_id");
        $controller->edit($claim_id);
    });
    // Edit
    on("POST", "/update", function() {
        $controller = new ClaimController();
        $controller->update();
    });
    //Delete
    on("POST", "/delete", function() {
        $controller = new ClaimController();
        $controller->delete();
    });
    // Upload 
    on("POST", "/upload", function() {
        $controller = new ClaimController();
        $controller->upload();
    });
    // Delete cost file
    on("POST", "/deletefile", function() {
        $controller = new ClaimController();
        $controller->deleteFile();
    });
    on("GET", "/getInsurancePO", function() {
      $controller = new ClaimController();
      $controller->getInsurancePO();
    });
    // common ajax
    on("POST", "/common_ajax", function() {
      $controller = new ClaimController();
      $controller->commonAjax();
    });
    on("GET", "/:sub_id/subedit", function() {
      $controller = new ClaimController();
      $sub_id = params("sub_id");
      $controller->subEdit($sub_id);
    });
    on("POST", "/:po_id/subupdate", function() {
      $controller = new ClaimController();
      $po_id  = params("po_id");
      $controller->subUpdate($po_id);
    });
    on("POST", "/subDelete", function() {
      $controller = new ClaimController();
      $controller->subDelete();
    });
});

//EDI 
prefix("edi",function(){
    //index
    on("POST", "/:job_number/:pl_id/booking-xml", function() {
        $job = params("job_number");
        $pl_id = params("pl_id");
        $data = $_POST;
        $flag = isset($_GET['flag']) ? $_GET['flag'] : '';
        $controller = new EdiController();
        $controller->generateBookingXML($job, $pl_id, $data, $flag);
    });
    //index
    on("GET", "/process-edi-return-xml", function() {
        $controller = new EdiController();
        $controller->processReturnXML();
    });
});

prefix("supplierclaim", function() {
  on("GET", "/index", function () {
    $controller = new SupplierClaimController();
    $controller->index();
  });
  on("GET", "/create", function () {
    $controller = new SupplierClaimController();
    $controller->create();
  });
  on("POST", "/add", function () {
    $controller = new SupplierClaimController();
    $controller->add();
  });
  on("GET", "/:supplierclaim_id/edit", function () {
    $controller = new SupplierClaimController();
    $supplierclaimId = params("supplierclaim_id");
    $controller->edit($supplierclaimId, 'edit');
  });
  on("POST", "/:supplierclaim_id/update", function () {
    $controller = new SupplierClaimController();
    $supplierclaimId = params("supplierclaim_id");
    $controller->update($supplierclaimId);
  });
  on("POST", "/delete", function() {
    $controller = new SupplierClaimController();
    $controller->delete();
  });
});
// Suggested charges
prefix("suggested-charge", function() {
  on("GET", "/index", function() {
      $controller = new SuggestedChargeController();
      $controller->index();
  });
  on("POST", "/common-ajax", function() {
      $controller = new SuggestedChargeController();
      $controller->commonAjax();
  });
  on("GET", "/create", function() {
      $controller = new SuggestedChargeController();
      $controller->create();
  });
  on("POST", "/add", function() {
      $controller = new SuggestedChargeController();
      $controller->add();
  });
  on("GET", "/:charge_id/edit", function () {
      $controller = new SuggestedChargeController();
      $charge_id = params("charge_id");
      $controller->edit($charge_id, 'edit');
  });
  on("POST", "/:charge_id/update", function () {
      $controller = new SuggestedChargeController();
      $charge_id = params("charge_id");
      $controller->update($charge_id);
  });
  on("POST", "/:charge_id/delete", function () {
      $charge_id = params("charge_id");
      $controller = new SuggestedChargeController();
      $controller->delete($charge_id);
  });
  on("GET", "/autocomp_quote", function () {
      $controller = new SuggestedChargeController();
      $controller->autoCompleteQuoteNumber();
  });
  on("GET", "/review", function() {
      $controller = new SuggestedChargeController();
      $controller->review();
  });
  on("GET", "/:job_charge_id/recharge", function () {
      $controller = new SuggestedChargeController();
      $job_charge_id = params("job_charge_id");
      $controller->suggestedChargeRecharge($job_charge_id);
  });
  on("POST", "/:job_charge_id/recharge", function () {
      $controller = new SuggestedChargeController();
      $job_charge_id = params("job_charge_id");
      $controller->applyRecharge($job_charge_id);
  });
});