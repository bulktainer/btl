
function productFileuploadList(prod_id) {
    $('.product-pannel-file-list').hide();
    $('.product_loadershow').show();
    $('#product_product_file_to_upload,#productfileName,#product_file_customer').val('');
    $('#product_file_customer').chosen().trigger("chosen:updated")
    $('#productfileSize,#productfileType').html('');
    $("#product_file_upload_btn").attr('disabled', true);
    $('#product_upload-progress-bar').css('width', '0%');
    $('#product_upload-progress-bar').data('aria-valuenow', '0');
    $('#product_upload-progress-bar').html('');
    $('.highlight').removeClass('highlight');

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: appHome + '/products/common_ajax',
        beforeSend: function () {

        },
        data: {
            'prod_id': prod_id,
            'action_type': 'get_document_list'
        },
        success: function (response) {
            $('.product_loadershow').hide();
            $('.product-pannel-file-list').show();
            tddata = "";
            if (response.length > 0) {
                $.each(response, function (i, item) {
                    tddata += '<tr id="prod_file_tr_' + item.docs_id + '">' +
                        '<td><a target="_blank" href="' + item.filePath + '">' + item.fileName + '</a></td>' +
                        '<td class="text-left" >' + item.custCode + '</td>' +
                        '<td class="text-center" >' +
                        '<a title="Change Customer" data-doc-id="' + item.docs_id + '"  data-cust-id="' + item.cust_id + '"href="#"  data-cust-code="' + item.custCode + '" class="prod_upload_change_customer">' +
                        '<span class="fa fa-pencil"></span>' +
                        '</a></td>' +
                        '<td class="text-center" >' + item.docDate + '</td>' +
                        '<td class="text-center" ><a target="_blank" title="Download Document" href="' + item.filePath + '"><i class="fa fa-download"></i></a></td>';
                    tddata += '<td class="text-center" ><a style="color:red;" class="delete_document" data-id="' + item.docs_id + '" title="Delete Document"><i class="fa fa-trash-o"></i></a></td>' +
                        '</tr>';
                });

            } else {
                tddata += '<tr id="emptyFilesTr" class="">' +
                    '<td style="text-align:center;" colspan="6"><p class="alert alert-warning" style="margin-bottom:0;">No files found.</p></td>' +
                    '</tr>';
            }
            $('#ProductFileAttachment').html(tddata);
        },
        error: function (response) {
            BootstrapDialog.show({
                title: 'Error', message: 'Error occured. Please try later.',
                buttons: [{ label: 'Close', action: function (dialogRef) { dialogRef.close(); } }], cssClass: 'small-dialog',
            });
        }
    });
}
/**
 * document file uplad function
 */
function productdocumentFileUpload(e) {

    uploadPath = $("#productfileUploadPath").val();

    if (!$('#product_file_to_upload')[0]) {
        return false;
    }

    if (!$('#product_file_to_upload').val()) {
        $("#product_file_upload_btn").attr('disabled', 'disabled');
        return false;
    }

    var fd = new FormData();
    fd.append("file_to_upload", $('#product_file_to_upload')[0].files[0]);
    fd.append("prod_id", $('#file_upload_prod_id').val());
    fd.append("prod_customer", $('#product_file_customer').val());
    fd.append("new_file_name", $('#productfileName').val());
    var xhr = new XMLHttpRequest();

    // file received/failed
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4) {
            $('#product_upload-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
            xhr.addEventListener("load", productdocumentFileUploadComplete, false);
            $('#product_progress_num_uf').addClass(xhr.status == 200 ? "success" : "failure");

        }
    };

    xhr.upload.addEventListener("progress", productdocumentFileUploadProgress, false);
    xhr.addEventListener("load", productdocumentFileUploadComplete, false);
    xhr.addEventListener("error", productdocumentFileUploadFailed, false);
    xhr.addEventListener("abort", productdocumentFileUploadCanceled, false);
    xhr.open("POST", uploadPath);
    xhr.send(fd);
}
/**
 * process function
 * @param evt
 */
function productdocumentFileUploadProgress(evt) {
    $("#product_file_upload_btn").attr('disabled', true);
    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
    $('#product_progress_num_uf').show();
    $('#product_upload-progress-bar').removeClass('progress-bar-danger').addClass('progress-bar-success');
    $('#product_upload-progress-bar').css('width', percentComplete.toString() + '%');
    $('#product_upload-progress-bar').data('aria-valuenow', percentComplete.toString());
    $('#product_upload-progress-bar').html(percentComplete.toString() + '%');
}

/**
 * when upload is failed
 * @param evt
 */
function productdocumentFileUploadFailed(evt) {
    alert("There was an error attempting to upload the file.");
}

/**
 * if uplad is cancel
 * @param evt
 */
function productdocumentFileUploadCanceled(evt) {
    alert("The upload has been canceled by the user or the browser dropped the connection.");
}

/**
 * upload complete
 * @param evt
 */
function productdocumentFileUploadComplete(evt) {
    var prod_id = $('#file_upload_prod_id').val();
    $("#product_file_upload_btn").attr('disabled', true);
    $('#product_file_upload_form').trigger('reset');
    $("#product_file_customer").trigger("chosen:updated");
    setTimeout(function () {
        productFileuploadList(prod_id);
        $('#product_progress_num_uf').hide();
    }, 1000);
}

//file upload start---------------------------------------
$('#product_file_to_upload').change(function () {
    changeFileToUpload();
});

function changeFileToUpload() {
    var file = document.getElementById('product_file_to_upload').files[0];
    $('#productfileSize,#productfileType,#productfileExist').show();
    if (file) {
        var productfileSize = 0;
        if (file.size > 1024 * 1024)
            productfileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
        else
            productfileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';

        var fname = file.name.replace(/[^_.a-z0-9\s]/gi, '').replace(/[\s]/g, '_').replace(/_+/g, '_').slice(-40);
        document.getElementById('productfileSize').innerHTML = 'Size: ' + productfileSize;
        document.getElementById('productfileType').innerHTML = 'Type: ' + file.type;
        document.getElementById('productfileName').value = Math.floor((Math.random() * 99999) + 10000) + '-' + fname;
        document.getElementById("productfileName").select(fname);

    }

    var file_cntrl = $('#product_file_to_upload');
    if (file_cntrl.val() != "") {
        $("#product_file_upload_btn").removeAttr('disabled');
    }
    $('#product_upload-progress-bar').css('width', '0%');
    $('#product_upload-progress-bar').data('aria-valuenow', '0');
    $('#product_upload-progress-bar').html('');
}

$('#add_product').click(function () {
    var prod_id = "PD-" + Math.floor(1000 + Math.random() * 9000);
    $('#file_upload_prod_id').val(prod_id);
    $('#product_file_upload_form').trigger('reset');
    $("#product_file_customer").trigger("chosen:updated");
    productFileuploadList(prod_id);
});

$(document).on('click', '.delete_document', function (e) {
    var doc_id = $(this).data('id');
    BootstrapDialog.show({
        type: BootstrapDialog.TYPE_DANGER,
        title: 'Confirmation',
        message: 'Are you sure want to Delete?',
        buttons: [{
            label: 'Close',
            action: function (dialogItself) {
                dialogItself.close();
            }
        }, {
            label: 'Ok',
            cssClass: 'btn-danger',
            action: function (dialogItself) {
                dialogItself.close();
                $.ajax({
                    type: 'POST',
                    url: appHome + '/products/common_ajax',
                    data: {
                        'doc_id': doc_id,
                        'action_type': 'delete_document'
                    },
                    success: function (response) {
                        var prod_id = $('#file_upload_prod_id').val();
                        productFileuploadList(prod_id);
                    },
                    error: function (response) {
                        BootstrapDialog.show({
                            title: 'Error', message: 'Error occured. Please try later.',
                            buttons: [{ label: 'Close', action: function (dialogRef) { dialogRef.close(); } }], cssClass: 'small-dialog',
                        });
                    }
                });;
            }
        }]
    });
});

$(function () {
    if ($("#add_product_modal").length > 0) {
        Dropzone.autoDiscover = false;
        //Dropzone class
        var myDropzone = new Dropzone("#add_product_modal", {
            url: "#",
            // acceptedFiles: "image/*,application/pdf",
            maxFiles: 1,
            previewsContainer: "#add_product_modal",
            disablePreviews: true,
            autoProcessQueue: false,
            uploadMultiple: false,
            clickable: false,
            init: function () {

                myDropzone = this;

                //Restore initial message when queue has been completed
                this.on("drop", function (event) {
                    if (event.dataTransfer.files.length > 0) {
                        fileInput = document.getElementById("product_file_to_upload");
                        fileInput.files = event.dataTransfer.files;
                        document.getElementById("product-file-upload-panel").scrollIntoView();
                        $("#product-file-upload-panel").css("background-color", "#bdbdbd");
                        setTimeout(() => {
                            $("#product-file-upload-panel").css("background-color", "unset");
                        }, 800);
                        changeFileToUpload();
                        setTimeout(() => {
                            // documentFileUpload(); to automatic upload
                            myDropzone.removeAllFiles(true);
                        }, 200);
                    }


                });

            }
        });
    }
});

$(document).on('click', '.prod_upload_change_customer', function (e) {
    e.preventDefault();
    $("#add_product_modal").animate({ scrollTop: 0 });
    var cust_id = $(this).attr('data-cust-id');
    var cust_code = $(this).attr('data-cust-code');
    if ($("#edit_customer_file_upload option[value=" + cust_id + "]").length == 0) {
        $('#edit_customer_file_upload').append($("<option></option>").attr("value", cust_id).text(cust_code));
    }
    $('#hidden_change_doc_id').val($(this).attr('data-doc-id'));
    $('#edit_customer_file_upload').chosen().val(cust_id).trigger("chosen:updated");
    $('#prod_change_customer').modal('show');
});

$(document).on('click', '.btn-change-customer', function (e) {

    var doc_id = $('#hidden_change_doc_id').val();
    var customerName = $('#edit_customer_file_upload option:selected').text();
    if (customerName == "") {
        customerName = "-";
    }
    var customerId = $('#edit_customer_file_upload').val();
    $.ajax({
        type: 'POST',
        url: appHome + '/products/common_ajax',
        data: {
            'customer_code': customerId,
            'doc_id': doc_id,
            'action_type': 'change_uploaded_customer'
        },
        success: function (response) {
            $('.prod_upload_change_customer[data-doc-id="' + doc_id + '"]').parent('td').prev('td').text(customerName);
            $('.prod_upload_change_customer[data-doc-id="' + doc_id + '"]').attr('data-cust-id', customerId);
            $('#prod_change_customer').modal('hide');
        },
        error: function (response) {
            BootstrapDialog.show({
                title: 'Error', message: 'Error occured. Please try later.',
                buttons: [{ label: 'Close', action: function (dialogRef) { dialogRef.close(); } }], cssClass: 'small-dialog',
            });
        }
    });;
});

$('#add_product_modal').on('hidden.bs.modal', function () {
    $('#prod_change_customer').modal('hide');
});