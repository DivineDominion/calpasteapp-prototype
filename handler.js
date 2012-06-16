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
        
        // remove Arrow icon and add Gear icon
        selector.find('li').each(function(index) {
            $(this).find('.ui-icon').removeClass('ui-icon-arrow-r').addClass('ui-icon-gear');
        });
        
        editing = true;
    };

    var disable_edit = function() {
        // toggle edit button
        $('#template_overview .edit_templates').removeClass('toggled');
        
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
        });
        
        editing = false;
        current_item = null;
    };
    
    return {
        selector: selector,
        add_item: add_item,
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
        $.mobile.changePage($('#edit_event'), { transition: 'slideup' }); 

        // reset values
        $('#edit_event h1').text('New Entry');
        $('#edit_event input').attr('value', '');
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
    });
};


// Programmatical errors
function StupidError(message) {
    this.name = "StupidError";
    this.message = (message || "");
}
StupidError.prototype = new Error();
StupidError.prototype.constructor = StupidError;
