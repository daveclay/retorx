function Vec2(x_, y_) {
    this.x = x_;
    this.y = y_;

    this.set = function(vector) {
        this.x = vector.x;
        this.y = vector.y;
    };

    this.multiplyScalar = function (value) {
        this.x = this.x * value;
        this.y = this.y * value;
    };

    this.multiplyVector = function (vec) {
       this.x = this.x * vec.x;
       this.y = this.y * vec.y;
    };

    /* vector / scalar */
    this.divScalar = function (value) {
        this.x = this.x / value;
        this.y = this.y / value;
    };

    /* vector + scalar */
    this.addScalar = function (value) {
        this.x = this.x + value;
        this.y = this.y + value;
    };

    /* vector + vector */
    this.addVector = function (vec) {
        this.x = this.x + vec.x;
        this.y = this.y + vec.y
    };
    /* vector - scalar */
    this.subScalar = function (value) {
        this.x = this.x - value;
        this.y = this.y - value;
    };
    /* vector - vector */
    this.subVector = function (vector) {
        this.x = this.x - vector.x;
        this.y = this.y - vector.y;
    };

    this.abs = function () {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
    };

    this.dot = function (vec_) {
        return (this.x * vec_.x + this.y * vec_.y);
    };

    this.length = function () {
        return Math.sqrt(this.dot(this));
    };

    /* distance between vectors */
    this.dist = function (vec_) {
        return (vec_.subV(this)).length();
    };

    /* vector length, squared */
    this.lengthSqr = function () {
        return this.dot(this);
    };

    /*
     vector linear interpolation
     interpolate between two vectors.
     value should be in 0.0f - 1.0f space
     */
    this.lerp = function (vec_, value) {
        this.x = this.x + (vec_.x - this.x) * value;
        this.y = this.y + (vec_.y - this.y) * value;
    };

    this.copy = function () {
        return new Vec2(this.x, this.y);
    };

    /* normalize this vector */
    this.normalize = function () {
        var vlen = this.length();
        if (vlen != 0) {
            this.x = this.x / vlen;
            this.y = this.y / vlen;
        }
    };


    this.min = function (limit) {
        this.x = Math.max(limit, this.x);
        this.y = Math.max(limit, this.y);
    };

    this.max = function (limit) {
        this.x = Math.min(limit, this.x);
        this.y = Math.min(limit, this.y);
    };
}