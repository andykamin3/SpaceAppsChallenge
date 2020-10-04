$(document).ready(function(){
    $('.datepicker').datepicker();
});

$(document).ready(function(){
    $('select').formSelect();
});


var slider = document.getElementById('test-slider');
var slider = document.getElementById('test-slider');
noUiSlider.create(slider, {
    start: [20, 80],
    connect: true,
    step: 1,
    orientation: 'horizontal', // 'horizontal' or 'vertical'
    range: {
        'min': 0,
        'max': 100
    }
});
