// 
//  handler.js
//  iCal Templater
//  
//  Created by Christian Tietze on 2012-06-16.
// 

(function() {
    var Templates = {
        selector: $('#template_overview .templates'),
        items: [],
        add: function(title) {
            if (!title) {
                throw new StupidError("no title");
            }
            
            this.items.push(title);
            
            this.selector.append('<li><a href="#" class="template">' + title + '</a></li>');
            
            // Bind events on template entries
            var $a = this.selector.find('li').last().find('a');
            
            $a.bind('tap', function(event) {
                console.log('test');
                $.mobile.changePage($('#assign'), { transition: 'slideup' });
            });
            
            // re-apply JQ styling to list elements if list exists
            if (this.selector.hasClass('ui-listview')) {
                this.selector.listview("refresh"); 
            }
        }
    };
    
    // global initializer
    init = function() {
        Templates.add("Work shift");

        $('#new_entry .done').tap(function(event) {
            var isValid = true;
            // TODO validate values

            if (isValid) {
                var item = 'New Entry';
                // TODO read values

                Templates.add(item);

                // TODO reset values

                $.mobile.changePage($('#template_overview'), { reverse: true, transition: 'slideup' });
            }
        });
        $('#new_entry .details :text').bind("change", function(event) {
            console.log(":"+ $(this).val());
        });
        $('#assign .event_title').text('test!!');
//        $('#assign .event_time')
    };
    // Programmatical errors
    function StupidError(message) {
        this.name = "StupidError";
        this.message = (message || "");
    }
    StupidError.prototype = new Error();
    StupidError.prototype.constructor = StupidError;
})();
