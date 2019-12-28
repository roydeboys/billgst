var invoice_item_row_counter = 1
var fuse_customers;

// ADDING INVOICE ROWS ===================================================
function add_invoice_item_row() {
    old_item_row_count = invoice_item_row_counter
    invoice_item_row_counter++;

    $('#invoice-form-items-table-body >tr:last').clone(true).insertAfter('#invoice-form-items-table-body >tr:last');
    $('#invoice-form-items-table-body >tr:last input').val('');

    $('#invoice-form-items-table-body >tr:last td')[0].innerHTML = invoice_item_row_counter
}

function setup_invoice_rows() {
    $("#invoice-form-addrow").click(function(event) {
       event.preventDefault();
       add_invoice_item_row();
    });
}


// CUSTOMER SEARCH ========================================================

function customer_result_to_domstr(result) {
    var domstr = "<div class='customer-search-result' data-customer='" + JSON.stringify(result) + "'>"+
    "<div>"+ result['customer_name'] + "</div>" +
    "<div>"+ result['customer_address'] + "</div>" +
    "<div>"+ result['customer_phone'] + "</div>" +
    "<div>"+ result['customer_gst'] + "</div>" +
    "</div>";
     return domstr;
}

function customer_result_click() {
    console.log("UPDATE THE FORM WITH SEARCH RESULT");
    customer_data_json = JSON.parse($(this).attr('data-customer'));
    $('#customer-name-input').val(customer_data_json['customer_name']);
    $('#customer-address-input').val(customer_data_json['customer_address']);
    $('#customer-phone-input').val(customer_data_json['customer_phone']);
    $('#customer-gst-input').val(customer_data_json['customer_gst']);
}

function initialize_fuse_customers_search_bar() {
    console.log("INITIALIZING CUSTOMER SEARCH");

    $(".customer_search_area").focusin(function() {
        $("#customer_search_bar").show();
        var input = $('.customer_search_input');
        var val = input.val();
        update_customer_search_bar(val);
    });

    $(document).bind('focusin click',function(e) {
        if ($(e.target).closest('#customer_search_bar, .customer_search_area').length) return;
        $('#customer_search_bar').hide();
    });

    $(".customer_search_input").on("input", function(e) {
        $("#customer_search_bar").show();
        var input = $(this);
        var val = input.val();
        update_customer_search_bar(val);
    });
}

function update_customer_search_bar(search_string){
    console.log("Update customer search bar with query: " + search_string);
    results = fuse_customers.search(search_string);
    // console.log(results);
    $("#customer_search_bar").empty();
    for (var i = 0; i < results.length; i++) {
        $("#customer_search_bar").append(customer_result_to_domstr(results[i]));
    }
    $('.customer-search-result').click(customer_result_click);
}


function initialize_fuse_customers () {
    // fetch customer data
    $.getJSON( "/customersjson", function( data ) {
        var fuse_customer_options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
            "customer_name",
            "customer_address",
            "customer_gst",
            ]
        };
        fuse_customers = new Fuse(data, fuse_customer_options);

        // initialize the search bar
        initialize_fuse_customers_search_bar();
    });
}


// START =============================================================

$(document).ready(function() {

    // Initialize invoice row addition
    setup_invoice_rows();

    // Initialize customer search
    initialize_fuse_customers();
});
