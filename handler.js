// 
//  handler.js
//  iCal Templater
//  
//  Created by Christian Tietze on 2012-06-16.
// 


var Templates = {
    selector: $('#template_overview .templates'),
    items: [],
    add: function(itemTitle) {
        if (!itemTitle) {
            throw new StupidError("no title");
        }
        
        var item = {
            title: itemTitle
        };
        
        this.items.push(item);
        
        var itemId = this.items.length;
        
        this.selector.append('<li><a href="#" class="template" data-itemid="' + itemId + '">' + itemTitle + '</a></li>');
        
        // Bind events on template entries
        var $a = this.selector.find('li').last().find('a');
        
        $a.bind('tap', function(event) {
            var id = $(this).data('itemid');
            Templates.assign_template_item(id);
        });
        
        // re-apply JQ styling to list elements if list exists
        if (this.selector.hasClass('ui-listview')) {
            this.selector.listview("refresh"); 
        }
    },
    assign_template_item: function(id) {
        if (!id) {
            throw new StupidError("no id");
        }
        
        var index = id - 1;
        var item = this.items[index];
        
        $.mobile.changePage($('#assign'), { transition: 'slideup' });
        $('#assign .event_title').text(item.title);
    }
};

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
