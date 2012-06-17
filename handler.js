// 
//  handler.js
//  iCal Templater
//  
//  Created by Christian Tietze on 2012-06-16.
// 


var Templates = (function() {
    var selector = $('#template_overview .templates');
    var items = [];
    var editing = false;
    var current_item = null;
    
    var create_item = function(itemTitle) {
        if (!itemTitle) {
            throw new StupidError("no title");
        }
        
        var item = {
            title: itemTitle
        };

        items.push(item);

        var itemId = items.length - 1;
        item.id = itemId;
        
        return item;
    };
    
    var remove_item_from_list = function(item) {
        item.selector.animate({
            marginLeft: parseInt(item.selector.css('marginLeft'),10) == 0 ?
            item.selector.outerWidth() :
            0
        }, {
            complete: function() {
                item.selector.slideUp('fast');
            }
        });
        
        // TODO remove from item array
    };
    
    var add_item = function(itemTitle) {    
        var item = create_item(itemTitle);
        item.selector = $('<li data-itemid="' + item.id + '"><a href="#" class="template" data-itemid="' + item.id + '">' + item.title + '</a></li>');
        
        selector.append(item.selector);

        // Bind events on template entries
        var $a = selector.find('li').last().find('a');

        $a.bind('tap', function(event) {
            var id = $(this).data('itemid');
            template_item_clicked(id);
        });
        
        $a.bind('swipe', function(event) {
            remove_item_from_list(item);
        });

        refresh_list();
    };
    
    var refresh_list = function() {
        // re-apply JQ styling to list elements if list exists
        if (selector.hasClass('ui-listview')) {
            selector.listview("refresh"); 
        }
    };
    
    var template_item_clicked = function(id) {
        if (editing) {
            edit_template_item(id);
        } else {
            assign_template_item(id);            
        }
    };
    
    var assign_template_item = function(id) {
        if ((!id && id !== 0) || id < 0) {
            throw new StupidError("no id");
        }

        var item = items[id];

        $.mobile.changePage($('#assign'), { transition: 'slideup' });
        $('#assign .event_title').text(item.title);
    };
    var edit_template_item = function(id) {
        if ((!id && id !== 0) || id < 0) {
            throw new StupidError("no id");
        }

        var item = items[id];
        current_item = item;

        $.mobile.changePage($('#edit_event'), { transition: 'slideup' });
        $('#edit_event h1').text(item.title);
        $('#edit_event #title').attr('value', item.title);
    };
    
    var enable_edit = function() {
        // toggle edit button
        $('#template_overview .edit_templates').addClass('toggled');
        
        // display edit page delete button
        $('#edit_event .delete').css('display','block');
        
        // remove Arrow icon and add Gear icon
        selector.find('li').each(function(index) {
            var $li = $(this);
            $li.find('.ui-icon').removeClass('ui-icon-arrow-r').addClass('ui-icon-gear');
            var id = $li.data("itemid");
            
            // search delete knob
            var $rem = $li.find('.rem');
            
            // .. and add if nonexistent
            if ($rem.length == 0) {
                // adds delete knob
                var $del = $('<div class="rem"><span class="inner">&ndash;</span></div>');
                console.log(id);
                $del.bind('tap', function() {
                    console.log(id);
                    remove_item_from_list(items[id]);
                });
                $li.prepend($del);
            }
            
            $li.find('.rem').css('display','block');
            $li.find('.ui-btn-inner').css('margin-left', '40px');
        });
        
        editing = true;
    };

    var disable_edit = function() {
        // toggle edit button
        $('#template_overview .edit_templates').removeClass('toggled');
        
        // hide edit page delete button
        $('#edit_event .delete').hide();
        
        // update current item if edited
        if (current_item) {
            var entryTitle = $('#edit_event [name="title"]').val().trim();
            if (entryTitle === "") {
                entryTitle = current_item.title;
            }
            
            current_item.title = entryTitle;
            current_item.selector.find('a').text(current_item.title);
        }
        
        // remove Gear icon and add Arrow icon
        selector.find('li').each(function(index) {
            $(this).find('.ui-icon').addClass('ui-icon-arrow-r').removeClass('ui-icon-gear');
            
            $(this).find('.rem').hide();
            $(this).find('.ui-btn-inner').css('margin-left', '0px');
        });
        
        editing = false;
        current_item = null;
    };
    
    var delete_current = function() {
        if (!current_item) {
            throw StupidError("no current item");
        }
        
        selector.find('[data-itemid="'+current_item.id+'"]').remove();
        
        // routine to quit pane
        $('#edit_event .done').trigger('tap');
        
        // TODO remove from item array
    };
    
    return {
        selector: selector,
        add_item: add_item,
        delete_current: delete_current,
        enable_edit: enable_edit,
        disable_edit: disable_edit,
        is_editing: function() { 
            return editing; 
        }
    };
})();

// global initializer
init = function() {
    Templates.add_item("Work shift");
    
    var $default_calendar = null;
    var selected_calendar = null;

    $('#edit_event .delete').bind('tap', function(event) {
        Templates.delete_current();
    });
    
    // Focus datetime picker automatically
    $('#assign').bind("pageshow", function(event) {
       $('#assign .start input').focus();
    });
    $('#assign .start').bind("vclick", function(event) {
       $('#assign .start input').focus();
    });
    $('#assign .start input').bind("change", function(event) {
        var starttime = $('#assign .start input').val();
        $('#assign .end input').val(starttime);
    });

    $('#template_overview .edit_templates').bind('tap', function() {
        if (Templates.is_editing()) {
            Templates.disable_edit();
        } else {
            Templates.enable_edit();
        }
    });
    $('#template_overview .add_template').bind('tap', function(event) {
        if (Templates.is_editing()) {
            Templates.disable_edit();
        }
        
        $.mobile.changePage($('#edit_event'), { transition: 'slideup' }); 

        // reset values
        $('#edit_event h1').text('New Entry');
        $('#edit_event input').attr('value', '');
        
        selected_calendar = null;
    });
    

    $('#calendar').live('pagebeforecreate', function(event) {
        $default_calendar = $('#calendar .calendars').find('li').first();
        $default_calendar.jqmData('icon', 'check');
        $default_calendar.find('a').append('<span class="detail">Default</span>');
    });
    $('#calendar').live('pagebeforeshow', function(event) {
        $('#calendar .calendars').find('li').each(function(index) {
            var $li = $(this);
            
            // abort on second try to create divs
            if ($li.find('.mkdef').length !== 0) {
                return;
            }
            
            
            var def = $('<div class="mkdef">make default</div>');
            $li.append(def);
            
            def.bind('tap', function(event) {
               // undefault old one
               $default_calendar.find('.detail').remove();

               // default new one
               $li.find('a').append('<span class="detail">Default</span>');
               $default_calendar = $li;
            });
        });
        
        ////// reset calendar selection (here, to make anim. invisible)
        
        // TODO select currently selected calendar, no matter what new default instructions are set
        
        $('.mkdef').hide();
        // unhighlight old one
        var old = $('#calendar .calendars').find('.ui-icon-check').parent().parent();
        old.find('.ui-icon').removeClass('ui-icon-check').addClass('ui-icon-none');
        old.find('.mkdef').slideUp();
        
        // select new
        var $icon = $default_calendar.find('.ui-icon');
        $icon.removeClass('ui-icon-none').addClass('ui-icon-check');
        
    });
    $('#calendar .cancel').tap(function() {
        $.mobile.changePage($('#edit_event'), { transition: 'slide', reverse: true }); 
        
        // reset selection
        selected_calendar = null;
    });
    $('#calendar .done').tap(function() {
        if (selected_calendar) {
            $('#edit_event .calendar').data('itemcal', selected_calendar).find('.detail').text(selected_calendar);
        }
        
        $.mobile.changePage($('#edit_event'), { transition: 'slide', reverse: true });
        selected_calendar = null;
    });
    $('#calendar .calendars').find('a').each(function(index) {
        $(this).bind('tap', function() {
            var old_sel = selected_calendar;
            selected_calendar = $(this).text();
            
            if (old_sel == selected_calendar) {
                return;
            }
            
            var $li = $(this).parent().parent().parent();
            var $icon = $li.find('.ui-icon');
            
            // unhighlight old one
            var old = $('#calendar .calendars').find('.ui-icon-check').parent().parent();
            old.find('.ui-icon').removeClass('ui-icon-check').addClass('ui-icon-none');
            old.find('.mkdef').slideUp();
            
            // select new
            $icon.removeClass('ui-icon-none').addClass('ui-icon-check');
            
            //////
            
            var default_calendar_title = $default_calendar.find('a').text();
            if (selected_calendar === default_calendar_title) {
                return;
            }
            
            $li.find('.mkdef').slideDown();
        });
    });
    

    $('#edit_event .cancel').tap(function(event) {
        if (Templates.is_editing()) {
            Templates.disable_edit();
        }
        
        $.mobile.changePage($('#template_overview'), { reverse: true, transition: 'slideup' });
    });
    $('#edit_event .done').tap(function(event) {
        if (Templates.is_editing()) {
            Templates.disable_edit();
        } else {
            var entryTitle = $('#edit_event [name="title"]').val().trim();
            if (entryTitle === "") {
                entryTitle = 'New Entry';
            }
            
            Templates.add_item(entryTitle);
        }
        
        $.mobile.changePage($('#template_overview'), { reverse: true, transition: 'slideup' });
        
        showDone();
    });
    $('#edit_event .calendar').bind('tap', function(event) {
        $.mobile.changePage($('#calendar'), { transition: 'slide' }); 
    });
};


// Programmatical errors
function StupidError(message) {
    this.name = "StupidError";
    this.message = (message || "");
}
StupidError.prototype = new Error();
StupidError.prototype.constructor = StupidError;

// Show a custom message to the user (will be shown in the active page unless specified otherwise in options)
var showDone = function( message, options ) {
    $.mobile.hidePageLoadingMsg();

    var showMessageOptions = {
        delayTime: 800,
        fadeTime: 400,
        wrapperClass: 'ui-body-a',
        pageContainer: undefined
    };
    $( "<div class='overlay ui-loader ui-overlay-shadow ui-corner-all "+ showMessageOptions.wrapperClass +"'><span class='iconic check'></span></div>" )
    .css({ "display": "block", "opacity": 0.66, "top": $(window).scrollTop() + 100 })
    .appendTo( showMessageOptions.pageContainer == undefined ? $.mobile.activePage : showMessageOptions.pageContainer )
    .delay( showMessageOptions.delayTime )
    .fadeOut( showMessageOptions.fadeTime, function() {
        $( this ).remove();
    });
};
