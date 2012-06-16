// 
//  handler.js
//  iCal Templater
//  
//  Created by Christian Tietze on 2012-06-16.
// 


var Templates = (function() {
    var selector = $('#template_overview .templates');
    var items = [];
    
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
            assign_template_item(id);
        });

        // re-apply JQ styling to list elements if list exists
        if (selector.hasClass('ui-listview')) {
            selector.listview("refresh"); 
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
    
    return {
        selector: selector,
        add: add_item,
        assign_template_item: assign_template_item
    };
})();

// global initializer
init = function() {
    Templates.add("Work shift");

    // Focus datetime picker automatically
    $('#assign').bind("pageshow", function(event) {
       $('#assign .datetime input').focus();
    });
    $('#assign .datetime').bind("vclick", function(event) {
       $('#assign .datetime input').focus();
    });
    $('#template_overview .add_template').bind('tap', function(event) {
        $.mobile.changePage($('#new_entry'), { transition: 'slideup' }); 
    });
    $('#new_entry .done').tap(function(event) {
        var isValid = true;
        // TODO validate values

        if (isValid) {
            var entryTitle = $('#new_entry [name="title"]').val().trim();
            if (entryTitle === "") {
                entryTitle = 'New Entry';
            }
            
            // TODO read values

            Templates.add(entryTitle);

            // TODO reset values

            $.mobile.changePage($('#template_overview'), { reverse: true, transition: 'slideup' });
        }
    });
};


// Programmatical errors
function StupidError(message) {
    this.name = "StupidError";
    this.message = (message || "");
}
StupidError.prototype = new Error();
StupidError.prototype.constructor = StupidError;
