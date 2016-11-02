

// ~~~~~~~~~~~~~~~~~~~~~Color Spheres~~~~~~~~~~~~~~~~~~~~~~~~

function dynamicCircle(anchor_x, anchor_y, range_x, range_y, start_color, end_color, fade_start_radius, radius, squish_factor, deg_rotate_ctr_clockwise, movement_speed) {
    this.x = anchor_x;
    this.y = anchor_y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;

    this.anchor_x = anchor_x;
    this.anchor_y = anchor_y;
    this.range_x = range_x;
    this.range_y = range_y;
    this.start_color = start_color;
    this.end_color = end_color;
    this.fade_start_radius = fade_start_radius;
    this.radius = radius;
    this.squish_factor = squish_factor;
    this.deg_rotate_ctr_clockwise = deg_rotate_ctr_clockwise;
    this.movement_speed = movement_speed;

    this.update = function(x_percent, y_percent) {
        // position is in screen_percent
        // v is in s%/second
        // a is in s%/second**2

        // animate_interval_ms = ms/refresh
        // update_interval_s = s/update
        updates_per_refresh = 3
        animate_interval_s = animate_interval_ms/1000
        update_interval_s = animate_interval_s*this.movement_speed/updates_per_refresh

        for(j = 0; j < updates_per_refresh; j++) {



            // drag
            drag_constant = 2;
            fx_drag = -drag_constant * this.vx;
            fx_drag = (isNaN(fx_drag) ? 0 : fx_drag);

            fy_drag = -drag_constant * this.vy;
            fy_drag = (isNaN(fy_drag) ? 0 : fy_drag);

            // spring
            kx = 1
            fx_spring = -kx*(this.x - this.anchor_x);

            ky = 1
            fy_spring = -ky*(this.y - this.anchor_y);

            // variable gravity
            fx_gravity = kx*this.range_x*x_percent
            fy_gravity = ky*this.range_y*y_percent

            mass = 1;

            this.x += this.vx*update_interval_s;
            this.vx += this.ax*update_interval_s;
            this.ax = (isNaN(this.ax) ? 0 : this.ax);
            this.ax = (fx_drag + fx_spring + fx_gravity)/mass;

            this.y += this.vy*update_interval_s;
            this.vy += this.ay*update_interval_s;
            this.ay = (isNaN(this.ay) ? 0 : this.ay);
            this.ay = (fy_drag + fy_spring + fy_gravity)/mass;
        }
    }

    this.draw = function () {
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        radius_canvas_cord = this.radius*canvas.width

        x_center = canvas.width/2
        y_center = canvas.height/2

        x = x_center + this.x * canvas.width
        y = y_center + this.y * canvas.height

        var grd = ctx.createRadialGradient(0,0,this.fade_start_radius*canvas.width,0,0,radius_canvas_cord);
        grd.addColorStop(0,this.start_color);
        grd.addColorStop(1,this.end_color);

        // time to do some transforming
        ctx.save()

        scale_mat = math.matrix([[1,0,0],
                                 [0,this.squish_factor,0],
                                 [0,0,1]])
        rot_deg = deg_rotate_ctr_clockwise
        rot_rad = rot_deg*Math.PI/180
        rot_mat = math.matrix([[math.cos(rot_rad),-math.sin(rot_rad),0],
                                 [math.sin(rot_rad),math.cos(rot_rad),0],
                                 [0,0,1]])
        trans_mat = math.matrix([[1,0,x],
                                 [0,1,y],
                                 [0,0,1]])
        final_mat = math.multiply(trans_mat, math.multiply(rot_mat, scale_mat))
        trans = final_mat.valueOf()
        ctx.setTransform(trans[0][0], trans[1][0], trans[0][1], trans[1][1], trans[0][2], trans[1][2]);

        ctx.fillStyle = grd;
        ctx.fillRect(-radius_canvas_cord,-radius_canvas_cord,2*radius_canvas_cord,2*radius_canvas_cord);
        ctx.restore()
    }
    this.draw_janky = function(){
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        radius_canvas_cord = .1*canvas.width

        x_center = canvas.width/2
        y_center = canvas.height/2
        // x = x_center + this.range_x*x_percent*canvas.width
        // y = y_center + this.range_y*y_percent*canvas.height

        x = x_center + (mouse_pos_percent_x*this.range_x + this.anchor_x) * canvas.width
        y = y_center + (mouse_pos_percent_y*this.range_y + this.anchor_y) * canvas.height

        var grd = ctx.createRadialGradient(0,0,0,0,0,radius_canvas_cord);
        grd.addColorStop(0,'black');
        grd.addColorStop(1,'rgba(255,255,255,0)');

        // time to do some transforming
        ctx.save()

        scale_mat = math.matrix([[1,0,0],
                                 [0,this.squish_factor,0],
                                 [0,0,1]])
        rot_deg = deg_rotate_ctr_clockwise
        rot_rad = rot_deg*Math.PI/180
        rot_mat = math.matrix([[math.cos(rot_rad),-math.sin(rot_rad),0],
                                 [math.sin(rot_rad),math.cos(rot_rad),0],
                                 [0,0,1]])
        trans_mat = math.matrix([[1,0,x],
                                 [0,1,y],
                                 [0,0,1]])
        final_mat = math.multiply(trans_mat, math.multiply(rot_mat, scale_mat))
        trans = final_mat.valueOf()
        ctx.setTransform(trans[0][0], trans[1][0], trans[0][1], trans[1][1], trans[0][2], trans[1][2]);
        // ctx.setTransform(2,0,0,1,0,0);

        ctx.fillStyle = grd;
        ctx.fillRect(-radius_canvas_cord,-radius_canvas_cord,2*radius_canvas_cord,2*radius_canvas_cord);
        ctx.restore()
    }
}

// function dynamicCircle(anchor_x, anchor_y, range_x, range_y, start_color, end_color, fade_start_radius, radius, squish_factor, deg_rotate_ctr_clockwise, movement_speed) {
// circles_to_draw.push(new dynamicCircle(.2,-.2,.3,.3,'rgba(29,255,203,.8', 'rgba(29,255,203,0', 0, .7, .5, 20, 0))
// circles_to_draw.push(new dynamicCircle(.3,-.1,-.2,.1,'rgba(255,208,72,.8', 'rgba(255,208,72,0', 0, .6, 0, 0, 0))
// circles_to_draw.push(new dynamicCircle(-.5,-.1,.1,.08,'rgba(255,0,0,.8', 'rgba(255,0,0,0', .1, .7, 1, 0, 0))
circles_options = [[]]
main_color_options = []
circles_options[0].push(new dynamicCircle(.4,-.4,.3,.3,'rgba(29,255,203,.8)', 'rgba(29,255,203,0)', 0, .7, .5, 0, 3))
circles_options[0].push(new dynamicCircle(.6,.2,-.2,.1,'rgba(255,208,72,.8)', 'rgba(255,208,72,0)', 0, .6, .9, 0, 4))
circles_options[0].push(new dynamicCircle(-.8,-.2,.1,.1,'rgba(231,37,104,.8)', 'rgba(231,37,104,0)', 0, .6, 1, 1, 2))
circles_options[0].push(new dynamicCircle(-.2,.2,1,1,'rgba(255,0,0,.8)', 'rgba(255,0,0,0)', 0, .7, 1, 1, 1))
main_color_options.push('rgba(29,255,203,1)')

circles_options.push([])
circles_options[1].push(new dynamicCircle(.4,-.4,.3,.3,'rgba(106,255,218,.8)', 'rgba(106,255,218,0)', 0, .7, .5, 0, 3))
circles_options[1].push(new dynamicCircle(.6,.2,-.2,.1,'rgba(209,23,66,.8)', 'rgba(209,23,66,0)', 0, .6, .9, 0, 4))
circles_options[1].push(new dynamicCircle(-.8,-.2,.1,.1,'rgba(241,160,195,.8)', 'rgba(241,160,195,0)', 0, .6, 1, 1, 2))
circles_options[1].push(new dynamicCircle(-.2,.2,1,1,'rgba(0,0,230,.8)', 'rgba(0,0,230,0)', 0, .7, 1, 1, 1))
main_color_options.push('rgba(106,255,218,1)')

circles_options.push([])
circles_options[2].push(new dynamicCircle(.4,-.4,.3,.3,'rgba(255,86,23,.9)', 'rgba(255,86,23,0)', 0, .7, .5, 0, 3))
circles_options[2].push(new dynamicCircle(.6,.2,-.2,.1,'rgba(251,204,0,.9)', 'rgba(251,204,0,0)', 0, .6, .9, 0, 4))
circles_options[2].push(new dynamicCircle(-.8,-.2,.1,.1,'rgba(0,79,77,.8)', 'rgba(0,79,77,0)', 0, .6, 1, 1, 2))
circles_options[2].push(new dynamicCircle(-.2,.2,1,1,'rgba(82,0,47,.8)', 'rgba(82,0,47,0)', 0, .7, 1, 1, 1))
main_color_options.push('rgba(82,0,47,1)')

circles_options.push([])
circles_options[3].push(new dynamicCircle(.4,-.4,.3,.3,'rgba(168,165,230,.9)', 'rgba(168,165,230,0)', 0, .7, .5, 0, 3))
circles_options[3].push(new dynamicCircle(.6,.2,-.2,.1,'rgba(255,223,0,.9)', 'rgba(255,223,0,0)', 0, .6, .9, 0, 4))
circles_options[3].push(new dynamicCircle(-.8,-.2,.1,.1,'rgba(49,200,201,.8)', 'rgba(49,200,201,0)', 0, .6, 1, 1, 2))
circles_options[3].push(new dynamicCircle(-.2,.2,1,1,'rgba(30,160,89,.8)', 'rgba(30,160,89,0)', 0, .7, 1, 1, 1))
main_color_options.push('rgba(30,160,89,1)')

index_to_use = Math.floor((Math.random()*circles_options.length))

// index_to_use = 3

var circles_to_draw = circles_options[index_to_use]
main_color = main_color_options[index_to_use]
// document.getElementById("holler").style.color = main_color;

var mouse_pos_percent_x = 0;
var mouse_pos_percent_y = 0;

function draw_circle() {

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (i = 0; i < circles_to_draw.length; i++) {
        circles_to_draw[i].update(mouse_pos_percent_x, mouse_pos_percent_y);
        circles_to_draw[i].draw();
        // this line draws the black circles for debugging
        // circles_to_draw[i].draw_janky();
    }

}

function setMousePosPercent(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    mouse_pos_percent_x = (2*evt.clientX - (2*rect.left+rect.width))/rect.width
    mouse_pos_percent_y = (2*evt.clientY - (2*rect.top+rect.height))/rect.height
  }

var canvas = document.getElementById("myCanvas");
document.addEventListener('mousemove', function(evt) {
        setMousePosPercent(canvas, evt);
}, false);

animate_interval_ms = 33;
setInterval(draw_circle, animate_interval_ms);


$(document).ready(function () {
    $(".contact").hover(function () {
        $("#bodycopy p, #socialmedia a").stop().animate({
                color: '#d1d1d1'},
                750);
        $("#myCanvas").stop().animate({
            opacity: 0},
            750);
        $("#holler").stop().animate({
            color: main_color
        }, 750);

        $('svg').find('.cls-1').stop()
            .animate({'stroke-dashoffset': 0}, 750)
            .css({'fill': main_color, 'transition': 'fill 1s'});
    console.log('on');

    }
,
function () {
        $("#bodycopy p, #socialmedia a").stop().animate({
                color: '#ffffff'},
                200);
        $("#myCanvas").stop().animate({
                opacity: 1},
                200);
        $("#holler").stop().animate({
            color: "#ffffff"}, 200);

        $('svg').find('.cls-1').stop()
          .animate({'stroke-dashoffset': 900}, 200)
          .css({'fill': "#ffffff", 'transition': 'fill 1s'});
    });
 $(".icon").hover(function(){
        $(this).animate({
            color: "#d1d1d1"
        }, 300)
    }, function() {
        $(this).animate({
            color: "#ffffff"
        }, 300)
    });
});
