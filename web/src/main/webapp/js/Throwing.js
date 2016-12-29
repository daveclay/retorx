function Throwing() {
    var self = $.extend(this, new Animated(5));
    var container = div('throwing-container');

    var sprite = new Sprite();
    container.append(sprite.getElement());

    this.getElement = function() {
        return container;
    };

    this.update = function () {
        sprite.update();
    };

    this.init = function() {
        container.hammer({
        }).on("release dragup dragdown dragleft dragright swipeup swipedown swipeleft swiperight", function(event) {
                event.preventDefault();
                event.gesture.preventDefault();
                self.handleHammer(event);
            });

        var width = container.width();
        var height = container.height();
        sprite.setLocationConstraints({
            w: width,
            h: height
        });
        sprite.setLocation(new Vec2(width / 2, height / 2));
        this.animate();
    };

    this.throwLeft = function(gesture) {
        this.throwRight(gesture);
    };

    this.throwRight = function(gesture) {
        var mouseDelta = new Vec2(gesture.deltaX, gesture.deltaY);
        mouseDelta.normalize();
        mouseDelta.multiplyScalar(.5);
        sprite.setAcceleration(mouseDelta);
    };

    this.handleHammer = function(ev) {
        ev.gesture.preventDefault();
        switch (ev.type) {
            case 'dragup':
                this.throwLeft(ev.gesture);
                break;
            case 'dragdown':
                this.throwLeft(ev.gesture);
                break;
            case 'dragright':
                this.throwLeft(ev.gesture);
                break;
            case 'dragleft':
                this.throwLeft(ev.gesture);
                break;
            /*
            case 'swipeup':
                ev.gesture.stopDetect();
                this.throwLeft(ev.gesture);
                break;
            case 'swipedown':
                ev.gesture.stopDetect();
                this.throwRight(ev.gesture);
                break;
            case 'swipeleft':
                ev.gesture.stopDetect();
                this.throwLeft(ev.gesture);
                break;
            case 'swiperight':
                ev.gesture.stopDetect();
                this.throwRight(ev.gesture);
                break;
                */
            case 'release':
                break;
        }
    };
}

function Sprite() {
    var self = this;

    var elem = div('throwing-sprite');
    var location = new Vec2(0, 0);
    var velocity = new Vec2(0, 0);
    var acceleration = new Vec2(0, 0);
    var constantForces = [];
    var maxVelocity = 20;
    var friction = .1;
    var constraintDimensions;

    this.getElement = function() {
        return elem;
    };

    this.setFriction = function(_friction) {
        friction = _friction;
    };

    this.setLocationConstraints = function(dimensions) {
        constraintDimensions = dimensions;
    };

    this.addForce = function(vector) {
        acceleration.add(vector);
    };

    this.addConstantForce = function(vector) {
        constantForces.push(vector);
    };

    this.setMaxVelocity = function(max) {
        maxVelocity = max;
    };

    this.getLocation = function() {
        return location;
    };

    this.setLocation = function(_location) {
        location = _location;
    };

    this.setVelocity = function(_velocity) {
        velocity = _velocity;
    };

    this.setAcceleration = function(_acceleration) {
        acceleration = _acceleration;
    };

    this.constrainLocation = function(dimensions) {
        var width = dimensions.w;
        var height = dimensions.h;

        if (location.x > width) {
            location.x = 0;
        } else if (location.x < 0) {
            location.x = width;
        }

        if (location.y > height) {
            location.y = 0;
        } else if (location.y < 0) {
            location.y = height;
        }
    };

    this.update = function() {
        constantForces.forEach(function(vector) {
            velocity.addVector(vector);
        });

        if (friction != 0) {
            var frictionVector = velocity.copy();
            frictionVector.normalize();
            frictionVector.multiplyScalar(-1);
            frictionVector.multiplyScalar(friction);

            velocity.addVector(frictionVector);
        }

        velocity.addVector(acceleration);
        velocity.min(-1 * maxVelocity);
        velocity.max(maxVelocity);

        location.addVector(velocity);

        if (constraintDimensions) {
            this.constrainLocation(constraintDimensions);
        }

        elem.css({
            top: location.y,
            left: location.x
        });

        acceleration = new Vec2(0, 0);
    };
}

function logVector(vec) {
    console.log(vec.x + " " + vec.y);
};

$(document).ready(function () {
    var throwing = new Throwing();
    var elem = throwing.getElement();
    $('body').append(elem);

    throwing.init();
});

