
function show_pic_in_dialog ( pic_name ) {
  
    $("#load").html('<img src="/static/images/myorganicstore/load.gif" />');
    var tag = $('<div  style="overflow:scroll"> </div>'); 
    var pic_path = '/static/images/myorganicstore/awards/' + pic_name;
    var ImG = '<img src="' + pic_path + '" width="790" height="600" alt="picture not fount" id="pic" \
                                                style=" margin:10px; padding:10px; border-image:blue;">' ;
            
            tag.html(ImG).dialog(
                                {
                                   modal: true,
                                   title:'Awards',
                                  hide:"explode",
                                  position: "top",
                                  open: function(event, ui) {  
                                        $('.ui-dialog-titlebar-close')
                                        .removeClass("ui-dialog-titlebar-close")
                                        .html('<img style="float:right" src="/static/images/myorganicstore/closebutton.png" width="25" height="25">');
                                        $('.ui-widget-overlay').css('width','100%');
                                 },  
                                draggable: true,  
                                show  : { effect: 'drop', direction: "up" },
                                autoOpen: false,
				width: 890,
                                height: 650,
				resizable: false,                  
                                close: function(event, ui){
				                     $('body').css('overflow','auto');
					             $("#load").html('');
					} 
                               
                              }).dialog('open');
                	        $("#load").html('');
                        
            
}
