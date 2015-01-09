$(function() {
    $('.demo-name').click(function() {
        var $this = $(this),
            $demos = $(this).parents('.instance').find('.demo'),
            name = $this.attr('name');

        $this.siblings().removeClass('active');
        $this.addClass('active');

        $demos.removeClass('active');
        window.demos = $demos;
        console.log($demos, name, $demos.filter('[name='+name+']'));
        $demos.filter('[name='+name+']').addClass('active');
    });

    $('.demo-name:first-of-type').click();
});