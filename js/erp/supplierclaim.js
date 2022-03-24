$('.create-supplierclaim,.edit-supplierclaim').click(function(e) {
    var ExistSuccess = 'Ok';
    var alert_required = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-exclamation-triangle"></i> <strong>Uh oh!</strong> Please make sure you have entered all of the required/correct information below.</div>';
    var oldalert = alert_required;
    $('.highlight').removeClass('highlight');
    e.preventDefault();
    var form = '#' + $(this).closest('form').attr('id'),
        success = [],

        path = $(this).attr('data-path');

    function highlight(field, empty_value) {
        if (field.length > 0) {
            if (field.val().trim() === empty_value) {
                $(field).parent().addClass('highlight');
                success.push(false);
            } else {
                $(field).parent().removeClass('highlight');
                success.push(true);
            }
        }
    }
    highlight($(form).find('#claim_supplier'), '');
    highlight($(form).find('#threshold_currency'), '');
    highlight($(form).find('#maximum_liability_currency'), '');
    var check_fields = (success.indexOf(false) > -1);
    console.log(success);
    if ($(this).hasClass('create-supplierclaim')) {
        console.log(check_fields);
        if (check_fields === true) {
            $('html, body').animate({ scrollTop: 0 }, 400);
            $('form').find('#response').empty().prepend(alert_required).fadeIn();
        } else {
            $.ajax({
                type: 'POST',
                url: appHome + '/supplierclaim/add',
                data: $(form).serialize().replace(/%5B%5D/g, '[]'),
                success: function(response) {
                    window.location.href = $('#returnpath').val();
                    localStorage.setItem('response', response);
                },
                error: function(response) {
                    $('html, body').animate({ scrollTop: 0 }, 400);
                    $('form').find('#response').empty().prepend(alert_error).fadeIn();
                }
            });
        }
    }
    if ($(this).hasClass('edit-supplierclaim')) {
        var supplierClaimId = $('#hidden-supplierclaimId').val();
        if (check_fields === true) {
            $('html, body').animate({ scrollTop: 0 }, 400);
            $('form').find('#response').empty().prepend(alert_required).fadeIn();
        } else {
            $(this).prop('disabled', 'disabled');
            $.ajax({
                type: 'POST',
                url: appHome + '/supplierclaim/' + supplierClaimId + '/update',
                data: $(form).serialize().replace(/%5B%5D/g, '[]'),
                success: function(response) {
                    window.location.href = $('#returnpath').val();
                    localStorage.setItem('response', response);
                },
                error: function(response) {
                    $('html, body').animate({ scrollTop: 0 }, 400);
                    $('form').find('#response').empty().prepend(alert_error).fadeIn();
                }
            });
        }
    }

});

function switch_specific_currency_icons(currency_id, change_class) {
    var $currency = $('.currency-meta[data-id="' + currency_id + '"]'),
        currency_name = $currency.attr('data-label');

    if (!$currency.length) {
        alert('Error. Currency not found.');
        return false;
    }
    if (currency_having_symbols.indexOf(currency_name.toUpperCase()) >= 0) {
        $("." + change_class).removeClass().html("").addClass(change_class + ' fa currency-fa fa-' + currency_name);
    } else {
        $("." + change_class).removeClass().html(currency_name.toUpperCase()).addClass(change_class + ' fa currency-fa');
    }
}
$('#threshold_currency').on('change', function() {
    var currency_id = $(this).chosen().val();
    switch_specific_currency_icons(currency_id, 'currency-change');

});
$('#maximum_liability_currency').on('change', function() {
    var currency_id = $(this).chosen().val();
    switch_specific_currency_icons(currency_id, 'liability-currency-change');

});

function NumberOnly(fld, e) {
    var strCheckRadius = '0123456789';
    var key = '';
    var whichCodeNum = (window.Event) ? e.which : e.keyCode;

    if (window.navigator.userAgent.indexOf("MSIE") > -1) {
        whichCodeNum = e.keyCode;
    }

    if (whichCodeNum == 5 || whichCodeNum == 8 || whichCodeNum == 13 ||
        whichCodeNum == 0)
        return true; // Enter

    key = String.fromCharCode(whichCodeNum);

    if (strCheckRadius.indexOf(key) == -1)
        return false; // Not a valid key
}
$('.delete-supplierclaim').click(function(e) {
    e.preventDefault();

    var delete_url = $(this).attr('href'),
        id = $(this).data('id'),
        return_url = window.location.href;

    BootstrapDialog.confirm('Are you sure you want to delete this T&C Detail ?', function(result) {
        if (result) {
            $.ajax({
                type: 'POST',
                url: delete_url,
                data: { 'id': id },
                success: function(response) {
                    //location.reload();
                    window.location.href = return_url;
                    localStorage.setItem('response', response);
                },
                error: function(response) {
                    BootstrapDialog.show({
                        title: 'Error',
                        message: 'Unable to delete. Please try later.',
                        buttons: [{ label: 'Close', action: function(dialogRef) { dialogRef.close(); } }],
                        cssClass: 'small-dialog',
                    });
                }
            });
        }
    });
});
$('.custom-page-pagesize').change(function(e) {
    var pagelimit = $(this).val();
    $('#pagesize').val(pagelimit);
    $('#search-form').submit();
});

function isNumber(evt, element) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (
        (charCode != 46 || $(element).val().indexOf('.') != -1) && // “.” CHECK DOT, AND ONLY ONE.
        (charCode < 48 || charCode > 57))
        return false;
    return true;
}