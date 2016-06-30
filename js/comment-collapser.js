
var colours = [
    'blue',
    'red',
    'green',
    'navy',
    'orange',
    'pink',
    'brown',
    'dark_green',
    'lilac',
    'army',
];


function make_collapser(colour, width, height) {
    var collapser = $('<div class="collapser ' + colour + '"></div>');
    collapser.click(toggle_collapse);
    collapser.css({
        'height': '-webkit-calc(100% - ' + height + 'px)',
        'width': width
    });
    return collapser;
}


function make_expander(collapsed) {
    var expander;
    if (collapsed) {
        expander = $('<a href="javascript:void(0)" class="expander">[+]</a>');
    } else {
        expander = $('<a href="javascript:void(0)" class="expander">[–]</a>');
    }
    expander.click(toggle_collapse);
    return expander;
}


function add_collapser(comment) {
	var num_child_comments;
    var anchor_ele;
    var depth;
    var colour;
    var collapser;
    var expander;
    var tagline;
    var width;
    var height;
    var deleted;
    var collapsed;

    num_child_comments = comment.find('> .child .comment').length;

	if (num_child_comments > 0) {
        depth = comment.parents('.comment').length;
        colour = colours[depth % 10];

        anchor_ele = comment.children('.midcol');

        deleted = comment.hasClass('deleted');
        collapsed = comment.hasClass('collapsed');

        width = anchor_ele.width();
        height = anchor_ele.height();
        if (deleted) {
            height = '30';
        }

        collapser = make_collapser(colour, width, height);
		anchor_ele.append(collapser);

        expander = make_expander(collapsed);
        tagline = comment.find('> .entry .tagline');
        tagline.prepend(expander);

        comment.find('> .entry .tagline .expand').remove();
	}

}


function toggle_collapse(event) {
	var comment = $($(this).parents('.comment')[0]);

    if (comment.hasClass('collapsed')) {
        uncollapse(comment);
    }
    else {
        collapse(comment);
    }
}


function uncollapse(comment) {
    comment.children('.child').show();
    comment.children('.midcol').show();
    comment.removeClass('collapsed');
    comment.addClass('noncollapsed');
    $(comment.find('.expander')[0]).html('[–]');
}


function collapse(comment) {

    if (!elementInViewport(comment)) {
        $('html, body').animate({
            scrollTop: comment.offset().top
        }, 300);
    }

    comment.children('.child').hide(300);

    window.setTimeout(function() {
        comment.children('.midcol').hide();
        $(comment.find('.expander')[0]).html('[+]');
        comment.removeClass('noncollapsed');
        comment.addClass('collapsed');
    }, 200);
}


// Test whether a given element is visible in the viewport
function elementInViewport(element) {
	return (element.offset().top > window.pageYOffset);
}


// Watch for any new comments that are loaded and add collapsers to them too
var observer = new WebKitMutationObserver(function(mutations) {
    var once = false;
    $.each(mutations, function(index, mutation) {
        if (mutation.type === 'childList') {
            $.each(mutation.addedNodes, function(index, node) {
                if ($(node).hasClass('comment')) {
                    console.log(once);
                    if (!once) {
                        once = true;
                        add_collapser($(node.parentNode.parentNode.parentNode));
                    }
                    add_collapser($(node));
                }
            });
        }
    });
});

observer.observe(document, {
    subtree: true,
    childList: true
});


// Add a collapser div to every non-deleted comment
var comments = $.makeArray($('.comment')).reverse();

function create_collapsers() {
    var comment = comments.pop();

    if (!comment) {
        return false;
    }

    add_collapser($(comment));

    requestAnimationFrame(function() {
        create_collapsers();
    });
}

create_collapsers();
