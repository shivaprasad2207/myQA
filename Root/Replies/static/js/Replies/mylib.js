$(document).ready(function(){
    $('#password1, #password2').on('keyup', function () {
    if ($('#password1').val() == $('#password2').val()) {
        $('#message').html('<b>Password Matching</b>').css('color', 'green');
    } else 
        $('#message').html('<b>Password Not Matching</b>').css('color', 'red');
    });
   $( function() {
    $( "#datepicker1" ).datepicker();
   });
   
   $( function() {
    $( "#datepicker2" ).datepicker();
   });

});

function registerNewOrg(){
    if (document.getElementById('password1').value ==
          document.getElementById('password2').value) {
            if(document.getElementById('password1').value.length < 4){
                $('#disp').html('<b>Password should be minimum 4 characters</b>').css('color', 'red');    
            }else if (document.getElementById('password1').value == ''){
                $('#disp').html('<b>Org name Cannot be empty</b>').css('color', 'red');      
            }else{
                var url = '/replies/registerNewOrg/' ;
                paramJson = {
                        'csrfmiddlewaretoken':document.getElementById('csrfmiddlewaretoken').value,
                        'orgName' : document.getElementById('orgName').value,
                        'orgAddress' : document.getElementById('orgAddress').value,
                        'userName' : document.getElementById('userName').value,
                        'userEmail' : document.getElementById('userEmail').value,
                        'password' : document.getElementById('password1').value
                }
                $.post(url,paramJson, function(data, status,jqXHR){
                    if ( data['status'] == 'ERROR'){
                        $('#disp').html('<b>' +  data['message'] +  '</b>').css('color', 'red');
                    }else if ( data['status'] == 'SUCCESS'){
                    $('#disp').html('<b>' +  data['message'] +  '</b>').css('color', 'green');
                    }
                },
                "json"
                );
            }
    }else{
        $('#disp').html('<b>Retry..Password Not Matching</b>').css('color', 'red');
    }
}

function registerNewUser(){
    if (document.getElementById('password1').value ==
          document.getElementById('password2').value) {
            if(document.getElementById('password1').value.length < 4){
                $('#message').html('<b>Password should be minimum 4 characters</b>').css('color', 'red');    
            }else{
                var url = '/replies/registerNewUser/' ;
                paramJson = {
                        'csrfmiddlewaretoken':document.getElementById('csrfmiddlewaretoken').value,
                        'userName' : document.getElementById('userName').value,
                        'userEmail' : document.getElementById('userEmail').value,
                        'orgCode' : document.getElementById('orgCode').value,
                        'password' : document.getElementById('password1').value
                }
            
                $.post(url,paramJson, function(data, status,jqXHR){
                    if ( data['status'] == 'ERROR'){
                        $('#disp').html('<b>' +  data['message'] +  '</b>').css('color', 'red');
                    }else if ( data['status'] == 'SUCCESS'){
                    $('#disp').html('<b>' +  data['message'] +  '</b>').css('color', 'green');
                    }
                },
                "json"
                );
            }
    }else{
        $('#disp').html('<b>Retry..Password Not Matching</b>').css('color', 'red');
    }
}

function addContent (){
   paramJson = {
        'csrfmiddlewaretoken': document.getElementById('csrfmiddlewaretoken').value,
        'orgCode' : document.getElementById('orgCode').value,
        'subject' : document.getElementById('subject').value,
        'content' :  document.getElementById('content').value,
        'categoryId' :  document.getElementById('categoryId').value,
        'subCategoryId' :  document.getElementById('subCategoryId').value
    };
   
    $.post('/replies/reply/start',paramJson, function(data, status,jqXHR){
                    if ( data['status'] == 'ERROR'){
                        $('#disp').html('<b>' +  data['message'] +  '</b>').css('color', 'red');
                    }else if ( data['status'] == 'SUCCESS'){
                        window.location.href = '/replies/reply/subject/list';
                    }
                },
                "json"
    );
    
}

function postContent(){
   paramJson = {
        'csrfmiddlewaretoken': document.getElementById('csrfmiddlewaretoken').value,
        'content' :  document.getElementById('content').value,
        'subjectId' :  document.getElementById('subjectId').value,
        'messageId' :  document.getElementById('messageId').value
    };
    $.post('/replies/reply/message/add',paramJson, function(data, status,jqXHR){
                    if ( data['status'] == 'ERROR'){
                        $('#disp').html('<b>' +  data['message'] +  '</b>').css('color', 'red');
                    }else if ( data['status'] == 'SUCCESS'){
                        window.location.href = '/replies/reply/subject?messageId='+paramJson['messageId']+'&subjectId='+paramJson['subjectId'];
                    }
                },
                "json"
    );
}

function showPostTextBox(flag,subjectId){
    
    $.get('/replies/reply/subject?flag='+flag+'&subjectId='+subjectId,null, function(data, status,jqXHR){
                        
                        if (flag == 'showReplyPostBox'){
                            id ='showReplyPostBox_'+ subjectId
                            document.getElementById(id).style.display="block";
                            document.getElementById(id).innerHTML = data;
                            
                        }else{
                            document.getElementById('postTextBox').style.display="block";
                            document.getElementById('postButton').style.display="none";
                            $('#postTextBox').html(data);
                        }
                        
                
                },
                "html"
    );
}

function deleteSubject (messageId,subjectId){
            $.get('/replies/reply/subject/delete?messageId='+messageId+'&subjectId='+subjectId,null, function(data, status,jqXHR){
                    if ( data['status'] == 'ERROR'){
                        $('#disp').html('<b>' +  data['message'] +  '</b>').css('color', 'red');
                    }else if ( data['status'] == 'SUCCESS'){
                        window.location.href = '/replies/reply/subject/list';
                    }
                },
                "json"
    ); 
}

function refreshListPage(messageId,subjectId){
    window.location.href = '/replies/reply/subject?messageId='+messageId+'&subjectId='+subjectId;
}
function postBranchContent(){
    paramJson = {
        'csrfmiddlewaretoken': document.getElementById('csrfmiddlewaretoken').value,
        'pMessageId' : document.getElementById('rootMessageId').value,
        'messageId' : document.getElementById('branchRootMessageId').value,
        'content' :  document.getElementById('content').value,
        'subjectId' :  document.getElementById('subjectId').value
    };
   
    $.post('/replies/reply/branch/add',paramJson, function(data, status,jqXHR){
                    if ( data['status'] == 'ERROR'){
                        $('#disp').html('<b>' +  data['message'] +  '</b>').css('color', 'red');
                    }else if ( data['status'] == 'SUCCESS'){
                        window.location.href = '/replies/reply/subject?messageId='+paramJson['pMessageId']+'&subjectId='+paramJson['subjectId'];
                    }
                },
                "json"
    );
}

function userLogin(){
    paramJson = {
        'csrfmiddlewaretoken': document.getElementById('csrfmiddlewaretoken').value,
        'orgCode' : document.getElementById('orgCode').value,
        'userName' : document.getElementById('userName').value,
        'password' :  document.getElementById('password').value
    };
    var url = '/replies/login/' ;
    $.post(url,paramJson, function(data, status,jqXHR){
                    if ( data['status'] == 'ERROR'){
                        $('#disp').html('<b>' +  data['message'] +  '</b>').css('color', 'red');
                    }else if ( data['status'] == 'SUCCESS'){
                        window.location.href = '/replies/main/' ;
                    }
                },
                "json"
                );
}

function makeVisibleSubCategoryAdd(){
    document.getElementById('subCategoryModFromDisp').style.display="none";
    document.getElementById('subCategoryAddFromDisp').style.display="block";
}

function showCategoryAddForm(){
    $("#stalePageContent").empty();
    $.get('/showCategoryAddForm/',null, function(data, status,jqXHR){
                    $('#catShow').html(data);
                },
                "html"
    );
}

function getSubCategoryOfCategory(){
    //$("#stalePageContent").empty();
    categoryId = document.getElementById('categoryId').value;
    url = '/replies/reply/start?op=getSubCategoryFrom&categoryId=' + categoryId;
    $.get(url,null, function(data, status,jqXHR){
                        $('#showSubCategory').html(data);
                },
                "html"
                );
}

function getRemainingReplyContentFrom (){
    $("#stalePageContent").empty();
    categoryId = document.getElementById('categoryId').value;
    subCategoryId  = document.getElementById('subCategoryId').value;
    url = '/replies/reply/start?op=getContentFrom&categoryId=' + categoryId + '&subCategoryId=' + subCategoryId;
    $.get(url,null, function(data, status,jqXHR){
                        $('#showRemainings').html(data);
                },
                "html"
                );
}

function addSubCategory (){
    //document.getElementById('subCategoryModFromDisp').style.display="none";
    paramJson = {
        'csrfmiddlewaretoken': document.getElementById('csrfmiddlewaretoken').value,
        'orgCode' : document.getElementById('orgCode').value,
        'subcategory' : document.getElementById('subcategory').value,
        'categoryId' : document.getElementById('categoryId').value
    };   
    url = '/replies/categories/subcategories/add';
    $.post(url,paramJson, function(data, status,jqXHR){
                    if ( data['status'] == 'ERROR'){
                        $('#subcategoryDisp').html('<b>' +  data['message'] +  '</b>').css('color', 'red');
                    }else{
                         window.location.href = '/replies/categories/subcategories/add?'  + 'categoryId=' + paramJson['categoryId']  + '&orgCode=' + paramJson['orgCode']
                    }
                },
                "html"
                );
}


function submitCategoryAdd (){
    if (document.getElementById('category').value == ''){
         $('#message').html('<b>' +  'Nothing Entered' +  '</b>').css('color', 'red');
        return false;
    }
    paramJson = {
        'csrfmiddlewaretoken': document.getElementById('csrfmiddlewaretoken').value,
        'orgCode' : document.getElementById('orgCode').value,
        'category' : document.getElementById('category').value
    };
    var url = '/replies/categories/add' ;
    $.post(url,paramJson, function(data, status,jqXHR){
                    if ( data['status'] == 'ERROR'){
                        $('#message').html('<b>' +  data['message'] +  '</b>').css('color', 'red');
                    }else if ( data['status'] == 'SUCCESS'){
                         $('#message').html('<b>' +  data['message'] +  '</b>').css('color', 'green');
                    }
                },
                "json"
                );    
}