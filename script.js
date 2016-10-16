$(document).ready(function () {
    $(".contact").hover(function () {
        $("#bodycopy p").animate({
        		color: '#b5b5b5'},
        		300);
        $("#myCanvas").animate({
        	opacity: 0},
        	300);
    });
    $(".contact").mouseleave(function () {
        $("#bodycopy p").animate({
        		color: '#ffffff'},
        		200);
        $("#myCanvas").animate({
        		opacity: 1},
        		200);
    });
});

// ~~~~~~~~~~~~~~~~~~~~~Color Spheres~~~~~~~~~~~~~~~~~~~~~~~~

function dynamicCircle(anchor_x, anchor_y, range_x, range_y, start_color, end_color, fade_start_radius, radius, squish_factor, deg_rotate_ctr_clockwise, movement_speed) {
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

    this.draw = function (x_percent, y_percent) {
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        radius_canvas_cord = this.radius*canvas.width

        x_center = canvas.width/2 + anchor_x*canvas.width
        y_center = canvas.height/2 + anchor_y*canvas.height
        x = x_center + this.range_x*x_percent*canvas.width
        y = y_center + this.range_y*y_percent*canvas.height

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
        // ctx.setTransform(2,0,0,1,0,0);

        ctx.fillStyle = grd;
        ctx.fillRect(-radius_canvas_cord,-radius_canvas_cord,2*radius_canvas_cord,2*radius_canvas_cord);
        ctx.restore()
    }
}

// function dynamicCircle(anchor_x, anchor_y, range_x, range_y, start_color, end_color, fade_start_radius, radius, squish_factor, deg_rotate_ctr_clockwise, movement_speed) {
var circles_to_draw = []
circles_to_draw.push(new dynamicCircle(-.1,-.1,.3,.3,'rgba(0,0,255,.8', 'rgba(0,0,255,0', 0, .1, .5, 20, 0))
circles_to_draw.push(new dynamicCircle(.1,.1,.1,.1,'rgba(0,255,0,.8', 'rgba(0,255,0,0', 0, .2, .8, 45, 0))
circles_to_draw.push(new dynamicCircle(.2,0,.08,.08,'rgba(255,0,0,.8', 'rgba(255,0,0,0', .1, .15, 1, 0, 0))


function draw_circle(x_percent, y_percent) {

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (i = 0; i < circles_to_draw.length; i++) {
        circles_to_draw[i].draw(x_percent, y_percent);
    }

}

function getMousePosPercent(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: (2*evt.clientX - (2*rect.left+rect.width))/rect.width,
      y: (2*evt.clientY - (2*rect.top+rect.height))/rect.height
    };
  }

var canvas = document.getElementById("myCanvas");
document.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePosPercent(canvas, evt);
        draw_circle(mousePos.x, mousePos.y)
}, false);