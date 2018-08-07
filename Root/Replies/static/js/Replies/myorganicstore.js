
$('input[type="checkbox"].large').checkbox({
    buttonStyle: 'btn-link btn-large',
    checkedClass: 'icon-check',
    uncheckedClass: 'icon-check-empty'
});

$(document).ready(function(){
  $('.slider1').bxSlider({
    slideWidth: 200,
    minSlides: 2,
    maxSlides: 3,
    slideMargin: 10
  });
  $('#example1').datepicker();
});


function is_uname_exist (){
    $("#load").html('<img src="/static/images/myorganicstore/2.gif" />');
    var uname = document.getElementById("uname").value;
    var re = /\S+@\S+\.\S+/;
    ret =  re.test(uname);
    if ( ret == false){
	$("#load").html(' <font color="red" > <b> Not a email id </b> </font>');
    }else{
	 var url = '/cgi-bin/myorganicstore/get_proj_info.pl?FLAG=ADD_NEW_USER&uname=' + uname;
	 $.get(
            url,
            function(data, textStatus, jqXHR) {
				$("#load").html(data);
                        },
            "html"
        );     
	
    }
}

function getProductOrder (productId, usr){
	var qty = document.getElementById("qty").value;
	var lunit = document.getElementById("lunit").value;
	if ( qty == ''   ){
		$("#msg").html('<b><font color="red"> Quantity cannot be empty </font></b>');
		return;
	}else if (validatePricel(document.getElementById("qty") ) == false){
		$("#msg").html('<b><font color="red"> Quantity should be in Numbers </font></b>');
		return;
	}else{
		var url ='/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=GET_ORDER&productId=' + productId + '&qty=' + qty ;
		$.get(
                 url,
                 function(data, textStatus, jqXHR) {									
						window.location = data;	
                    },
                 "html"
            ); 
	}
}


function getUserProfile (){
    var url ='/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=GET_USER_PROFILE' ;
	$.get(
                 url,
                 function(data, textStatus, jqXHR) {									
						$("#dispset").html(data);
                    },
                 "html"
            ); 
}


function getModifyProductForm(opt){
         var product = document.getElementById("product").value; 
		 //alert ( product);
		 var url = '/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=getModifyProductForm&product='+product; 
         $.get(
			url,
			function(data, textStatus, jqXHR) {									
						$("#productImage").html(data);					
			},
			"html"
	);    	      
}


function showChangeUserDetailFrom (){
var url ='/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=GET_USER_PROFILE_CHANGE_FORM' ;
	$.get(
                 url,
                 function(data, textStatus, jqXHR) {									
						$("#dispset").html(data);
                    },
                 "html"
            ); 

}

function delAdress(adressId){
	var url ='/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=delAdress&adressId='+adressId ;
	  $.get(
                 url,
                 function(data, textStatus, jqXHR) {										 
						 delAdrsForm ();
                    },
                 "html"
        ); 
}

function delAdrsForm (){
      var url ='/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=delAdrsForm' ;
	  $.get(
                 url,
                 function(data, textStatus, jqXHR) {									
						$("#dispset").html(data);
                    },
                 "html"
        ); 
}


function showAddNewAdrs (){
	  var url ='/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=SHOW_ADD_NEW_ADRS' ;
	  $.get(
                 url,
                 function(data, textStatus, jqXHR) {									
						$("#dispset").html(data);
                    },
                 "html"
            ); 

}


function showChangePasswdFrom(){
         var url = '/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=GET_PASSWD_CHG_FORM'; 
         $.get(
                 url,
                 function(data, textStatus, jqXHR) {									
						$("#dispset").html(data);
                    },
                 "html"
            ); 
}


function new_adrs_reg (){
      var adrs =  document.getElementById("adrs").value;
      adrs = adrs.replace(/[^\w\s\][^,]/gi, '');	
	  var url ='/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=ADD_NEW_ADRS&adrs=' + adrs ;
       $.get(
                 url,
                 function(data, textStatus, jqXHR) {									
						 window.location = data;
                    },
                 "html"
            ); 

}

function terms (){
       var url ='/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=GET_TERMS' ;
		// alert (url);
		$.get(
                 url,
                 function(data, textStatus, jqXHR) {									
									bootbox.dialog({
                title: "Read out Terms and Conditions",
                message: data,
				// className: "modal2"
                       });
               },
                 "html"
         );
}

function payment (term,adrsCount){
         if ( document.getElementById(term).checked == false ){
              							
				bootbox.dialog({
					title: "Alert! Terms and Conditions",
					message: '<b><font color="red"> Accept Terms and Condtions </font> </b>' ,
				// className: "modal2"
                });
				return ;
		 }	
		 var count = adrsCount;
		 var tCount = 0;
		 //alert (count);
         for (var i = 0 ; i < adrsCount ; i++ ){
		    var chkBxId = 'chkBx_' + i;		
             //alert ( 	document.getElementById(chkBxId).value );		
			if ( document.getElementById(chkBxId).checked == true ){
				count--;
				tCount++;
			}
		 }
		 var deliveryAdrsId;
		 if (count == adrsCount){
			bootbox.dialog({
					title: "Delivery Adress",
					message: '<b><font color="red"> Select Delivery Address </font> </b>' ,
				// className: "modal2"
                });return ;
		 }else if( tCount > 1 ){
			bootbox.dialog({
					title: "Delivery Adress",
					message: '<b><font color="red"> Select One 	Delivery Address </font> </b>' ,
				// className: "modal2"
                });return ;
		 
		 }else{
		       for (var i = 0 ; i < adrsCount ; i++ ){
					var chkBxId = 'chkBx_' + i;		
					if ( document.getElementById(chkBxId).checked == true ){
						deliveryAdrsId =  document.getElementById(chkBxId).value;
						window.location = '/cgi-bin/myorganicstore/index.pl?pg=ProcessOrder&AdrsId='+deliveryAdrsId;
					}
				}		 
		 }	
}

function cancelPlacedOrder (orderCode ){
	     var url = '/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=cancelPlacedOrder&orderCode='+orderCode; 
         $.get(
                 url,
                 function(data, textStatus, jqXHR) {									
						 var ret = data.toString();
						 if (ret == 1){
								bootbox.alert({
								    closeButton: false,
									title: "Order Cancel",
									message: '<b><font color="green"> Order Cancelled ... </font></b>',
									// className: "modal2"
								     callback:function(result) {
															 window.location = '/cgi-bin/myorganicstore/index.pl?pg=OrderList';   
												}			
								});
						 }else{					
								bootbox.alert({
										closeButton: false,
										title: "Order Cancel Failed..",
										message: data,
										// className: "modal2"
										callback:function(result) {
												window.location =  '/cgi-bin/myorganicstore/index.pl?pg=OrderList';   
										}			
								});
					    }						
                    },
                 "html"
            ); 
}

function getOrderDetail (orderId, orderCode ){
	     var url = '/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=getOrderDetail&orderId='+orderId+'&orderCode='+orderCode; 
         $.get(
                 url,
                 function(data, textStatus, jqXHR) {									
						$("#dispset").html(data);
                    },
                 "html"
            ); 
}


function enable_price_edit( productId, user ){
   if ( user == ''){
        bootbox.dialog({
                title: "Login Request",
                message: 'Please Login <a href="/cgi-bin/myorganicstore/login.pl">  Login Page</a>  ',
				// className: "modal2"
            });
   }else {
		var url ='/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=GET_QTY_ORDER_DIALOG&productId=' + productId + '&usr=' + user ;
		// alert (url);
		$.get(
                 url,
                 function(data, textStatus, jqXHR) {									
									bootbox.dialog({
                title: "Product Order Form",
                message: data,
				// className: "modal2"
                       });
               },
                 "html"
         );
    }
	  
}

function logout( sid ){
    var url = '/cgi-bin/myorganicstore/logout.pl?sid=' + sid  + '&flag=' + 'jslogout';
    window.location = url;
    //window.location = '/cgi-bin/myorganicstore/login.pl?status=jslogout&sid='+sid;
}

function changePasswd (){
	if ($('#p1').val() == '' ){
          $("#msg").html('<b><font color="red">Password cannot be empty.. </font></b>');
    }else if ( $('#p2').val() == '' ) {	
	      $("#msg").html('<b><font color="red">Password cannot be empty.. </font></b>');  
	}else if ($('#p1').val() != $('#p2').val()) {
		$("#msg").html('<b><font color="red"> Password Donot Match </font></b>');
	}else{
		var cr = md5($('#p1').val());		
	    var url ='/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=S_PWD&cr=' + cr  ;
		$.get(
                 url,
                 function(data, textStatus, jqXHR) {									
									bootbox.alert({
									            closeButton: false,
												title: "Password Change",
												message: data,
												// className: "modal2"
												 callback:function(result) {
															 window.location = '/cgi-bin/myorganicstore/index.pl?pg=Setting';    
												}		
									});
               },
                 "html"
         );
		
		
	}
	
	
}


function new_user_reg (){
     var lmail = document.getElementById("email"); 	
	if ( $('#fname').val() == '' ) {	
	      $("#msg").html('<b><font color="red">First name cannot be empty.. </font></b>'); return ; 
	}else if ( $('#lname').val() == '' ) {	
	      $("#msg").html('<b><font color="red">Last Name cannot be empty.. </font></b>');   return ; 
	}else if ( $('#adrs').val() == '' ) {	
	      $("#msg").html('<b><font color="red">Adress cannot be empty.. </font></b>');   return ; 
	}else if ( $('#email').val() == '' ) {	
	      $("#msg").html('<b><font color="red">EMail cannot be empty.. </font></b>');   return ; 
	}else if (validateEmail(lmail) == false ) {	
	      $("#msg").html('<b><font color="red">Enter valid Email Id.. </font></b>');   
		  return; 
	}else if ( $('#phone').val() == '' ) {	
	      $("#msg").html('<b><font color="red">Phone cannot be empty.. </font></b>');   return ; 
	}
	
    var email = document.getElementById("email").value;   	
	var fname = document.getElementById("fname").value;
	var lname = document.getElementById("lname").value;
	var adrs = document.getElementById("adrs").value;
	adrs = adrs.replace(/[^\w\s\][^,]/gi, '');	
	var phone = document.getElementById("phone").value;
	var zip = document.getElementById("zip").value;
	if (zip == ''){
	    zip = '--';  
	}
	var lurl = '/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=REG_USR&email='+email+'&fname='+fname+'&lname='+lname+'&adrs='+adrs+'&phone='+phone+'&zip='+zip; 
	verify_email_exist ( email, lurl ) ;
	
	return true;
}


function modifyUserDetails(){
    if ( $('#fname').val() == '' ) {	
	      $("#msg").html('<b><font color="red">First name cannot be empty.. </font></b>'); return ; 
	}else if ( $('#lname').val() == '' ) {	
	      $("#msg").html('<b><font color="red">Last Name cannot be empty.. </font></b>');   return ; 
	}else if ( $('#adrs').val() == '' ) {	
	      $("#msg").html('<b><font color="red">Adress cannot be empty.. </font></b>');   return ; 
	}else if ( $('#phone').val() == '' ) {	
	      $("#msg").html('<b><font color="red">Phone cannot be empty.. </font></b>');   return ; 
	}
    var email = document.getElementById("email").value;   	
	var fname = document.getElementById("fname").value;
	var lname = document.getElementById("lname").value;
	var adrs = document.getElementById("adrs").value;
	adrs = adrs.replace(/[^\w\s\][^,]/gi, '');	
	var phone = document.getElementById("phone").value;
	var zip = document.getElementById("zip").value;
	if (zip == ''){
	    zip = '--';  
	} 
	var lurl = '/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=MOD_USER_INFO&fname='+fname+'&lname='+lname+'&adrs='+adrs+'&phone='+phone+'&zip='+zip; 
    
	$.get(
			lurl,
			function(data, textStatus, jqXHR) {									
						var ret = data.toString();
						 if (ret == 1){
								bootbox.alert({
								    closeButton: false,
									title: "Modifying User Details",
									message: '<b><font color="green"> User details Modified ... </font></b>',
									// className: "modal2"
								     callback:function(result) {
															 window.location = '/cgi-bin/myorganicstore/index.pl?pg=Setting';   
												}			
								});
						 }else{					
								bootbox.alert({
										closeButton: false,
										title: "Modifying User Details",
										message: data,
										// className: "modal2"
										callback:function(result) {
												window.location =  '/cgi-bin/myorganicstore/index.pl?pg=Setting';   
										}			
								});
					    }
			},
			"html"
	);  
	
	return true;
}

function getSubCategory ( opt ){
         var categoryId = document.getElementById("categories").value; 
		 var url = '/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=GET_SUB_CATEGORY&categoryId='+categoryId+'&opt='+opt; 
         $.get(
			url,
			function(data, textStatus, jqXHR) {									
						$("#disp").html(data);					
			},
			"html"
	);    	 
}

function getSubCategorySelectList (opt){
		 $("#productListDisp").html('');	
		 var categoryId = document.getElementById("categories").value; 
		 var url = '/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=getSubCategorySelectList&categoryId='+categoryId+'&opt='+opt; 
         $.get(
			url,
			function(data, textStatus, jqXHR) {									
						$("#subCategoryListDisp").html(data);					
			},
			"html"
	);    	 

}

function addProductOfSubCategory ( subCategoryId){
	var productName = document.getElementById("productName").value; 
	var productUnit = document.getElementById("productUnit").value; 
	var productPrice = document.getElementById("productPrice").value; 
	var url = '/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=addProductOfSubCategory&subCategoryId='+subCategoryId+'&productName='+productName+'&productUnit='+productUnit+'&productPrice='+productPrice;
	$.get(
			url,
			function(data, textStatus, jqXHR) {									
						var ret = data.toString();
						 if (ret == 1){								
										 window.location = '/cgi-bin/myorganicstore/admin.pl?pg=Product&Op=View';   								
						 }else{					
								bootbox.alert({
										closeButton: false,
										title: "Adding Category..",
										message: data,
										// className: "modal2"
										callback:function(result) {
												 window.location = '/cgi-bin/myorganicstore/admin.pl?pg=Product&Op=View';   
										}			
								});
					    }
			},
			"html"
	);      
}

function getProductList ( opt , categoryId ){
         var subCategoryId = document.getElementById("subcategories").value; 
         var url = '/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=getProductList&categoryId='+categoryId+'&opt='+opt+'&subCategoryId='+subCategoryId;          
       
		$.get(
			url,
			function(data, textStatus, jqXHR) {									
						$("#productListDisp").html(data);					
			},
			"html"
     	);    	 

}

function getImageUploadForm (){
	  var product = document.getElementById("products").value; 
	   var url = '/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=getImageUploadForm&product='+product;   
		$.get(
			url,
			function(data, textStatus, jqXHR) {									
						$("#productImage").html(data);					
			},
			"html"
     	);    	 
}

function imageUpload() {
      
			var name = document.getElementById("file").getAttribute("name");
			var fd = new FormData(document.getElementById("file"));
            fd.append("label", name);
            $.ajax({
              url:  '/cgi-bin/myorganicstore/upload.pl?productId=' + name,
              type: "POST",
              data: fd,
              enctype: 'multipart/form-data',
              processData: false,  // tell jQuery not to process the data
              contentType: false   // tell jQuery not to set contentType
            }).done(function( data ) {
                      var ret = data.toString();        
                       if (ret == 1){		
								bootbox.alert({
											closeButton: false,
											title: "Image upload ",
											message: '<br><br><font color="green"> <b> Image uploaded... </b></font>',
											// className: "modal2"
											callback:function(result) {
												 window.location = '/cgi-bin/myorganicstore/admin.pl?pg=Product&Op=Addp';   
											}			
									});
							
					   
					   }else{
					   
							bootbox.alert({
											closeButton: false,
											title: "Image upload Failed",
											message: data,
											// className: "modal2"
											callback:function(result) {
												 window.location = '/cgi-bin/myorganicstore/admin.pl?pg=Product&Op=Addp';   
											}			
									});
							
						}
					});
            return false;
}


function updateProduct( productId) {
        var productName = document.getElementById("productName").value; 
	    var productPrice = document.getElementById("productPrice").value; 
		var productUnit = document.getElementById("productUnit").value; 
		var url = '/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=updateProduct&productId='+productId+'&productPrice='+productPrice+'&productName='+productName+'&productUnit='+productUnit;
        $.get(
			url,
			function(data, textStatus, jqXHR) {									
						var ret = data.toString();
						 if (ret == 1){								
										 window.location = '/cgi-bin/myorganicstore/admin.pl?pg=Product&Op=View';   								
						 }else{					
								bootbox.alert({
										closeButton: false,
										title: "Product Modifying..",
										message: data,
										// className: "modal2"
										callback:function(result) {
												 window.location = '/cgi-bin/myorganicstore/admin.pl?pg=Product&Op=View';   
										}			
								});
					    }
			},
			"html"
	);    
}

function reSetPwd() {
    var email = document.getElementById("email").value; 
    var url = '/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=reSetPwd&email='+email;
	$.get(
			url,
			function(data, textStatus, jqXHR) {									
						$("#pwd_reset").html(data);
			},
			"html"
	);    
	
}

function addCategory (){
    var category = document.getElementById("category").value;
    var lurl = '/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=ADD_CATEGORY&category='+category;    
	$.get(
			lurl,
			function(data, textStatus, jqXHR) {									
						var ret = data.toString();
						 if (ret == 1){								
										 window.location = '/cgi-bin/myorganicstore/admin.pl?pg=Category&Op=View';   								
						 }else{					
								bootbox.alert({
										closeButton: false,
										title: "Adding Category..",
										message: data,
										// className: "modal2"
										callback:function(result) {
												 window.location = '/cgi-bin/myorganicstore/admin.pl?pg=Category&Op=View';   
										}			
								});
					    }
			},
			"html"
	);    
}


function addSubCategory ( categoryId){
	var subcategory = document.getElementById("subcategory").value;
	var lurl = '/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=ADD_SUB_CATEGORY&categoryId='+categoryId+'&subcategory='+subcategory;
    $.get(
			lurl,
			function(data, textStatus, jqXHR) {									
						var ret = data.toString();
						 if (ret == 1){								
										 window.location = '/cgi-bin/myorganicstore/admin.pl?pg=sCategory&Op=View';   								
						 }else{					
								bootbox.alert({
										closeButton: false,
										title: "Adding Subcategory..",
										message: data,
										// className: "modal2"
										callback:function(result) {
												 window.location = '/cgi-bin/myorganicstore/admin.pl?pg=sCategory&Op=View';   
										}			
								});
					    }
			},
			"html"
	);        
}
 
function modifyCategory (){
    var myForm = document.getElementById("categoriess");
    var params ='';
	
    for (var i = 0; i < myForm.elements.length; i++) {
		var v = myForm.elements[i].value;
		var n = myForm.elements[i].name;
		params = params + n+ '=' + v + '&';
    }
	params = params+'FLAG=MOD_CATEGORY'
	var url = '/cgi-bin/myorganicstore/AjaxCalls.pl?' + params;
	
	$.get(
			url,
			function(data, textStatus, jqXHR) {									
						var ret = data.toString();
						 if (ret == 1){								
										 window.location = '/cgi-bin/myorganicstore/admin.pl?pg=Category&Op=View';   								
						 }else{					
								bootbox.alert({
										closeButton: false,
										title: "Modifying Category..",
										message: data,
										// className: "modal2"
										callback:function(result) {
												 window.location = '/cgi-bin/myorganicstore/admin.pl?pg=Category&Op=View';   
										}			
								});
					    }
			},
			"html"
	);
}

function modifySubCategory (){
    var myForm = document.getElementById("subcategoriess");
    var params ='';
	
    for (var i = 0; i < myForm.elements.length; i++) {
		var v = myForm.elements[i].value;
		var n = myForm.elements[i].name;
		params = params + n+ '=' + v + '&';
    }
	params = params+'FLAG=MOD_SUB_CATEGORY'
	var url = '/cgi-bin/myorganicstore/AjaxCalls.pl?' + params;
	$.get(
			url,
			function(data, textStatus, jqXHR) {									
						var ret = data.toString();
						 if (ret == 1){								
										 window.location = '/cgi-bin/myorganicstore/admin.pl?pg=sCategory&Op=View';     								
						 }else{					
								bootbox.alert({
										closeButton: false,
										title: "Modifying Sub category..",
										message: data,
										// className: "modal2"
										callback:function(result) {
												 window.location = '/cgi-bin/myorganicstore/admin.pl?pg=sCategory&Op=View';   
										}			
								});
					    }
			},
			"html"
	);
}

function deleteCategory (){
	var myForm = document.getElementById("categoriess");
    var params ='';
    for (var i = 0; i < myForm.elements.length; i++) {
		if (myForm.elements[i].checked == true ){
			var v = myForm.elements[i].value;
			var n = myForm.elements[i].name;
			params = params + n+ '=' + v + '&';
		}
	}
	params = params+'FLAG=DEL_CATEGORY'
	var url = '/cgi-bin/myorganicstore/AjaxCalls.pl?' + params;
	$.get(
			url,
			function(data, textStatus, jqXHR) {									
						var ret = data.toString();
						 if (ret == 1){								
										 window.location = '/cgi-bin/myorganicstore/admin.pl?pg=Category&Op=View';   								
						 }else{					
								bootbox.alert({
										closeButton: false,
										title: "Delete Category..",
										message: data,
										// className: "modal2"
										callback:function(result) {
												 window.location = '/cgi-bin/myorganicstore/admin.pl?pg=Category&Op=View';   
										}			
								});
					    }
			},
			"html"
	);
}
function deleteSubCategory (){
   var myForm = document.getElementById("subcategoriess");
    var params ='';
    for (var i = 0; i < myForm.elements.length; i++) {
		if (myForm.elements[i].checked == true ){
			var v = myForm.elements[i].value;
			var n = myForm.elements[i].name;
			params = params + n+ '=' + v + '&';
		}
	}
	params = params+'FLAG=DEL_SUB_CATEGORY'
	var url = '/cgi-bin/myorganicstore/AjaxCalls.pl?' + params;
	$.get(
			url,
			function(data, textStatus, jqXHR) {									
						var ret = data.toString();
						 if (ret == 1){								
										 window.location = '/cgi-bin/myorganicstore/admin.pl?pg=sCategory&Op=View'; 							
						 }else{					
								bootbox.alert({
										closeButton: false,
										title: "Delete Category..",
										message: data,
										// className: "modal2"
										callback:function(result) {
												 window.location = '/cgi-bin/myorganicstore/admin.pl?pg=sCategory&Op=View'; 
										}			
								});
					    }
			},
			"html"
	);
}


function deleteProduct (){
   var myForm = document.getElementById("Formproduct");
    var params ='';
    for (var i = 0; i < myForm.elements.length; i++) {
		if (myForm.elements[i].checked == true ){
			var v = myForm.elements[i].value;
			var n = myForm.elements[i].name;
			params = params + n+ '=' + v + '&';
		}
	}
	params = params+'FLAG=deleteProduct'
	var url = '/cgi-bin/myorganicstore/AjaxCalls.pl?' + params;
	$.get(
			url,
			function(data, textStatus, jqXHR) {									
						var ret = data.toString();
						 if (ret == 1){								
										 window.location =  '/cgi-bin/myorganicstore/admin.pl?pg=Product&Op=View'; 							
						 }else{					
								bootbox.alert({
										closeButton: false,
										title: "Delete Product..",
										message: data,
										// className: "modal2"
										callback:function(result) {
												 window.location =  '/cgi-bin/myorganicstore/admin.pl?pg=Product&Op=View'; 
										}			
								});
					    }
			},
			"html"
	);
}



function verify_email_exist (email, lurl){

		var url = '/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=CHK_UID&UID=' + email;
		$.get(
                 url,
                 function(data, textStatus, jqXHR) {									
	                     var ret = data.toString();
						 if (ret == 1){
								bootbox.alert({
								    closeButton: false,
									title: "Email Status",
									message: '<b><font color="red"> EMail already Exisist.. </font></b>',
									// className: "modal2"
								     callback:function(result) {
															 window.location = '/cgi-bin/myorganicstore/new_user.pl';    
												}			
								});
						 }else{
						         $.get(
										lurl,
										function(data, textStatus, jqXHR) {									
																			bootbox.alert({
																							closeButton: false,
																							title: "New User",
																							message: data,
																							// className: "modal2"
																							 callback:function(result) {
																										 window.location = '/cgi-bin/myorganicstore/login.pl';    
																							}			
																				});
					
										},
										"html"
								);  
						 
						 }
                 },
                 "html"
         );
}


function validatePricel(price){
        var reg =  /^[0-9]+$/;

        if (reg.test(price.value) == false) 
        {
            return false;
        }
        return true;

}

function validateEmail(emailField){
        var reg =  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (reg.test(emailField.value) == false) 
        {
            return false;
        }
        return true;

}

function ShowProdInDialogBox ( ProdId){
   var url ='/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=GET_PROD_DETAIL&ProdId=' + ProdId ;
	$.get(
                 url,
                 function(data, textStatus, jqXHR) {									
									bootbox.dialog({
                title: "Product Details",
                message: data,
				 className: "modal2"
            });
                    },
                 "html"
            ); 
}

function ProdNameSelected (){
             $("#load_icon").html('<img src="/static/images/myorganicstore/ajax-loader.gif" />');
             var ProdName = document.getElementById("typeahead").value;
			 //alert (ProdName);
			 var url ='/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=GET_PROD_LIST&ProdName=' + ProdName ;
			 $.get(
                 url,
                 function(data, textStatus, jqXHR) {									
									$("#load_icon").html(data);
                    },
                 "html"
            );
			 
			 

}	
    

function ModProd ( ProdId){
			var url ='/cgi-bin/myorganicstore/index.pl?pg=ModProd&i=' + ProdId ;
		window.location = url;

}

function DelProd ( ProdId){
       var uname = document.getElementById("user_name").value; 
	   var ProductGrpName = document.getElementById("ProductGrpName").value; 
        bootbox.alert("Do you want Delete this Product ..?", function(result) {
		if (result === null) {
			window.location = '/cgi-bin/myorganicstore/index.pl?pg=ProdView';	
       } else {
        var url ='/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=DEL_PROD&ProdId=' + ProdId + '&uname=' + uname + '&ProductName=' + ProductGrpName;
		$.get(
                 url,
                 function(data, textStatus, jqXHR) {									
									$("#load_icon").html('');
									bootbox.alert({
												title: "Product Deletion",
												message: data,
										        callback: function(result){
																window.location = '/cgi-bin/myorganicstore/index.pl?pg=ProdView';
												 },		
									});
                    },
                 "html"
            );												
    }
}); 
												
}

function ModPodSubmit ( ProdId){
		 $("#load_icon").html('<img src="/static/images/myorganicstore/ajax-loader.gif" />');
        var ProductGrpName = document.getElementById("ProductGrpName").value;
		var ProductManufacturer = document.getElementById("ProductManufacturer").value;
		var ProductShortDesc = document.getElementById("ProductShortDesc").value;
		var ProductDesc = document.getElementById("ProductDesc").value;
		var ProductLongDesc = document.getElementById("ProductLongDesc").value; 
		var uname = document.getElementById("user_name").value;
		var CategoryId = document.getElementById("Category").value;
		var SubCategoryId = document.getElementById("SubCategory").value;
		var LogDescription  = document.getElementById("LogDescription").value;
	
	if ( ProductGrpName == ''   ){
		    $("#load_icon").html( '<b><font color="red">** Product Name Not Specified</font></b><br><br>');   
	}else if (ProductManufacturer ==''){
		     $("#load_icon").html( '<b><font color="red">** Product Manufacturer Name Not Specified</font></b><br><br>');   
	}else if (ProductShortDesc ==''){
		      $("#load_icon").html( '<b><font color="red">** Product Short Description Not Specified</font></b><br><br>');   
	}else if (ProductLongDesc ==''){
		      $("#load_icon").html( '<b><font color="red">** Product Long Description Not Specified</font></b><br><br>');   
	}else if (LogDescription ==''){
		       $("#load_icon").html( '<b><font color="red">**  Remarks Not Specified</font></b><br><br>');   
	}else if (ProductDesc ==''){
		       $("#load_icon").html( '<b><font color="red">** Product Description Not Specified</font></b><br><br>');   
	}else{
			var url ='/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=MOD_PROD&ProductGrpName=' + ProductGrpName+ 
															'&ProductManufacturer=' +ProductManufacturer +
															'&ProductShortDesc=' +ProductShortDesc +
															'&ProductDesc=' +ProductDesc +
															'&ProductLongDesc=' +ProductLongDesc +
															'&uname=' +uname +
															'&CategoryId=' +CategoryId +
															'&SubCategoryId=' +SubCategoryId +
															'&LogDescription=' +LogDescription +
															'&ProdId=' + ProdId;	
	       $.get(
                 url,
                 function(data, textStatus, jqXHR) {									
									ProductGrpName = document.getElementById("ProductGrpName").value='';
									document.getElementById("ProductManufacturer").value='';
									document.getElementById("ProductShortDesc").value= '';
									document.getElementById("ProductDesc").value='';
									document.getElementById("ProductLongDesc").value='';
									document.getElementById("LogDescription").value='';
									$("#load_icon").html('');
									bootbox.alert({
												title: "Product Modification",
												message: data,
										        callback: function(result){
																window.location = '/cgi-bin/myorganicstore/index.pl?pg=ProdView';
												 },				
									});
									
                    },
                 "html"
            );
	}
    	
}
function AddProd( ){

		$("#load_icon").html('<img src="/static/images/myorganicstore/ajax-loader.gif" />');
        var ProductGrpName = document.getElementById("ProductGrpName").value;
		var ProductManufacturer = document.getElementById("ProductManufacturer").value;
		var ProductShortDesc = document.getElementById("ProductShortDesc").value;
		var ProductDesc = document.getElementById("ProductDesc").value;
		var ProductLongDesc = document.getElementById("ProductLongDesc").value; 
		var uname = document.getElementById("user_name").value;
		var CategoryId = document.getElementById("Category").value;
		var SubCategoryId = document.getElementById("SubCategory").value;
		var LogDescription  = document.getElementById("LogDescription").value;
	
	if ( ProductGrpName == ''   ){
		    $("#load_icon").html( '<b><font color="red">** Product Name Not Specified</font></b><br><br>');   
	}else if (ProductManufacturer ==''){
		     $("#load_icon").html( '<b><font color="red">** Product Manufacturer Name Not Specified</font></b><br><br>');   
	}else if (ProductShortDesc ==''){
		      $("#load_icon").html( '<b><font color="red">** Product Short Description Not Specified</font></b><br><br>');   
	}else if (ProductLongDesc ==''){
		      $("#load_icon").html( '<b><font color="red">** Product Long Description Not Specified</font></b><br><br>');   
	}else if (LogDescription ==''){
		       $("#load_icon").html( '<b><font color="red">**  Remarks Not Specified</font></b><br><br>');   
	}else if (ProductDesc ==''){
		       $("#load_icon").html( '<b><font color="red">** Product Description Not Specified</font></b><br><br>');   
	}else{
			var url ='/cgi-bin/myorganicstore/AjaxCalls.pl?FLAG=ADD_PROD&ProductGrpName=' + ProductGrpName+ 
															'&ProductManufacturer=' +ProductManufacturer +
															'&ProductShortDesc=' +ProductShortDesc +
															'&ProductDesc=' +ProductDesc +
															'&ProductLongDesc=' +ProductLongDesc +
															'&uname=' +uname +
															'&CategoryId=' +CategoryId +
															'&SubCategoryId=' +SubCategoryId +
															'&LogDescription=' +LogDescription ;	
	       $.get(
                 url,
                 function(data, textStatus, jqXHR) {									
									ProductGrpName = document.getElementById("ProductGrpName").value='';
									document.getElementById("ProductManufacturer").value='';
									document.getElementById("ProductShortDesc").value= '';
									document.getElementById("ProductDesc").value='';
									document.getElementById("ProductLongDesc").value='';
									document.getElementById("LogDescription").value='';
									$("#load_icon").html('');
									bootbox.alert({
												title: "Product Addition",
												message: data,
										        callback: function(result){
																window.location = '/cgi-bin/myorganicstore/index.pl?pg=ProdAdd';
												 },				
									});
                    },
                 "html"
            );
	}

}