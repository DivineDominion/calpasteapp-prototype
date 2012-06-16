// 
//  handler.js
//  iCal Templater
//  
//  Created by Christian Tietze on 2012-06-16.
// 

(function() {
    // global initializer
    init = function() {
        // Bind events on items
        $('.template_overview .template').bind('tap', function(event) {
            console.log('test');
        });
        $('#new_entry .done').tap(function(event) {
            console.log('add');
            Templates.add('new');
        });
        $('#assign .event_title').text('test!!');
//        $('#assign .event_time')
    };
    
    var Templates = {
        selector: $('.template_overview .templates'),

        add: function(title) {
            if (!title) {
                throw new StupidError("no title");
            }
            
            var new_elem = '<li>'
                         + '    <a href="#assign" class="template" data-transition="slideup">'
                         + '        <h3 class="ui-li-heading">' + title + '</h3>'
                         + '    </a>'
                         + '</li>';
            // Insert element, then refresh list to apply style
            this.selector.append(new_elem);
            this.selector.listview("refresh"); 
            // FIXME cannot call methods on listview prior to initialization; attempted to call method 'refresh'
        }
    };
    
    // Programmatical errors
    function StupidError(message) {
      this.name = "StupidError";
      this.message = (message || "");
    }
    StupidError.prototype = new Error();
    StupidError.prototype.constructor = StupidError;
})();
