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
        
        selector.append('<li><a href="#" class="template" data-itemid="' + item.id + '">' + item.title + '</a></li>');

        // Bind events on template entries
        var $a = selector.find('li').last().find('a');

        $a.bind('tap', function(event) {
            var id = $(this).data('itemid');
            template_item_clicked(id);
        });

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

        $.mobile.changePage($('#new_entry'), { transition: 'slideup' });
        $('#new_entry h1').text(item.title);
        $('#new_entry #title').attr('value', item.title);
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
        
        // remove Gear icon and add Arrow icon
        selector.find('li').each(function(index) {
            $(this).find('.ui-icon').addClass('ui-icon-arrow-r').removeClass('ui-icon-gear');
        });
        
        editing = false;
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
       $('#assign .datetime input').focus();
    });
    $('#assign .datetime').bind("vclick", function(event) {
       $('#assign .datetime input').focus();
    });
    $('#template_overview .edit_templates').toggle(
        function() {
            Templates.enable_edit();
        }, function() {
            Templates.disable_edit();
        });
    $('#template_overview .add_template').bind('tap', function(event) {
        $.mobile.changePage($('#new_entry'), { transition: 'slideup' }); 

        // reset values
        $('#new_entry h1').text('New Entry');
        $('#new_entry input').attr('value', '');
    });
    
    $('#new_entry .done').tap(function(event) {
        if (Templates.is_editing()) {
            Templates.disable_edit();
        } else {
            var entryTitle = $('#new_entry [name="title"]').val().trim();
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
