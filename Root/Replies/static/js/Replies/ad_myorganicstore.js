
////////////////////////////////////////////////////////////////
$(document).ready(function(){
   $("#example1").datepicker();
});

 $(document).ready(function(){
	$( "#from" ).datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 3,
      onClose: function( selectedDate ) {
        $( "#to" ).datepicker( "option", "minDate", selectedDate );
      }
    });
    $( "#to" ).datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 3,
      onClose: function( selectedDate ) {
        $( "#from" ).datepicker( "option", "maxDate", selectedDate );
      }
    });
});
  
  
function orderSearch ( param1){
	var condtion ='';

	switch(param1) {
		case 'getSearchOrderForm': condtion = '&c=getSearchOrderForm'; break;
		case 'getSearchOrderFromByStatus': condtion = '&c=getSearchOrderFromByStatus'; break;
		case 'getSearchOrderFormByDate': condtion = '&c=getSearchOrderFormByDate'; break;
		case 'getSearchOrderFromEmail': condtion = '&c=getSearchOrderFromEmail' ;break;
		case 'getSearchOrderFromPhone': condtion = '&c=getSearchOrderFromPhone' ;break;
		case 'getSearchOrderFormByDateRange': condtion = '&c=getSearchOrderFormByDateRange' ;break;
		default: break;        
	}
    var url = '/cgi-bin/myorganicstore/AdminAjax.pl?FLAG=orderSearch'+condtion;
    //alert (url);
	$.get(
            url,
            function(data, textStatus, jqXHR) {
				$("#dispsearch").html(data);
                        },
            "html"
        );     

} 


function getSearchOrderForm (){
	var orderCode = document.getElementById("getSearchOrderForm").value;
	var url = '/cgi-bin/myorganicstore/AdminAjax.pl?FLAG=orderCode&orderCode='+orderCode;
	listOrders ( url) ;
}


function getSearchOrderFromByStatus (){
	var orderStatus = document.getElementById("getSearchOrderFromByStatus").value;
	var url = '/cgi-bin/myorganicstore/AdminAjax.pl?FLAG=orderStatus&orderStatus='+orderStatus;
	listOrders ( url) ;
}


function getSearchOrderFormByDate (){
	var orderDate = document.getElementById("getSearchOrderFormByDate").value;
	var url = '/cgi-bin/myorganicstore/AdminAjax.pl?FLAG=orderDate&orderDate='+orderDate;
	listOrders ( url) ;
}


function getSearchOrderFromEmail (){
	var orderEmail = document.getElementById("getSearchOrderFromEmail").value;
	var url = '/cgi-bin/myorganicstore/AdminAjax.pl?FLAG=orderEmail&orderEmail='+orderEmail;
	listOrders ( url) ;
}


function getSearchOrderFromPhone (){
	var orderPhone = document.getElementById("getSearchOrderFromPhone").value;
	var url = '/cgi-bin/myorganicstore/AdminAjax.pl?FLAG=orderPhone&orderPhone='+orderPhone;
	listOrders ( url) ;
}

function listOrders (url){
         $.get(
            url,
            function(data, textStatus, jqXHR) {
				$("#dispsearch").html(data);
                        },
            "html"
        ); 
}
function getSearchOrderFormByDateRange (){
         var to = document.getElementById("to").value;
		 var from = document.getElementById("from").value;
		 var url = '/cgi-bin/myorganicstore/AdminAjax.pl?FLAG=orderDateRange&to='+to+'&from='+from;
	//alert ( url) ;
}


function changeOrderStatus (orderId,orderCode){
	var url = '/cgi-bin/myorganicstore/admin.pl?pg=chOrderStat&orderId='+orderId+'&orderCode='+orderCode;
	window.location = url;


}

function getOrderDetailInDialog (orderId, orderCode ){
	     var url = '/cgi-bin/myorganicstore/AdminAjax.pl?FLAG=getOrderDetailInDialog&orderId='+orderId+'&orderCode='+orderCode; 
		 var tag = $('<div  style="overflow:scroll"> </div>');
         $.get(
                 url,
                 function(data, textStatus, jqXHR) {									
						 tag.html(data).dialog({
                                modal: true,
                                title: 'Order Details',
                                open: function(event, ui) {  
                                        $('.ui-dialog-titlebar-close')
                                        .removeClass("ui-dialog-titlebar-close")
                                        .html('<img src="/static/images/myorganicstore/closebutton.png" width="25" height="25" style="padding:1px; float:right">');
                                        $('.ui-widget-overlay').css('width','100%');
                                },  
								width:  $(window).width(),
                                height:  $(window).height(),       
                                close: function(event, ui){
                                                    $('body').css('overflow','auto');																			    
                                } 
                               
                              }).dialog('open');      
						
                    },
                 "html"
            ); 
}



