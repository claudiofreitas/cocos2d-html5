/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * @class
 * @extends cc.Class
 */
cc.PointObject = cc.Class.extend(/** @lends cc.PointObject# */{
    _ratio:null,
    _offset:null,
    _child:null,

    /**
     * @return  {cc.Point}
     */
    getRatio:function () {
        return this._ratio;
    },

    /**
     * @param  {cc.Point} value
     */
    setRatio:function (value) {
        this._ratio = value;
    },

    /**
     * @return  {cc.Point}
     */
    getOffset:function () {
        return this._offset;
    },

    /**
     * @param {cc.Point} value
     */
    setOffset:function (value) {
        this._offset = value;
    },

    /**
     * @return {cc.Node}
     */
    getChild:function () {
        return this._child;
    },

    /**
     * @param  {cc.Node} value
     */
    setChild:function (value) {
        this._child = value;
    },

    /**
     * @param  {cc.Point} ratio
     * @param  {cc.Point} offset
     * @return {Boolean}
     */
    initWithCCPoint:function (ratio, offset) {
        this._ratio = ratio;
        this._offset = offset;
        this._child = null;
        return true;
    }
});

/**
 * @param {cc.Point} ratio
 * @param {cc.Point} offset
 * @return {cc.PointObject}
 */
cc.PointObject.create = function (ratio, offset) {
    var ret = new cc.PointObject();
    ret.initWithCCPoint(ratio, offset);
    return ret;
};

/**
 * <p>cc.ParallaxNode: A node that simulates a parallax scroller<br />
 * The children will be moved faster / slower than the parent according the the parallax ratio. </p>
 * @class
 * @extends cc.Node
 *
 * @property {Array}    parallaxArray   - Parallax nodes array
 */
cc.ParallaxNode = cc.NodeRGBA.extend(/** @lends cc.ParallaxNode# */{
	parallaxArray:null,

    _lastPosition:null,
    _className:"ParallaxNode",

    /**
     * @return {Array}
     */
    getParallaxArray:function () {
        return this.parallaxArray;
    },

    /**
     * @param {Array} value
     */
    setParallaxArray:function (value) {
        this.parallaxArray = value;
    },

    /**
     * Constructor
     */
    ctor:function () {
        cc.NodeRGBA.prototype.ctor.call(this);
        this.parallaxArray = [];
        this._lastPosition = cc.p(-100, -100);
    },

    /**
     * Adds a child to the container with a z-order, a parallax ratio and a position offset
     * It returns self, so you can chain several addChilds.
     * @param {cc.Node} child
     * @param {Number} z
     * @param {cc.Point} ratio
     * @param {cc.Point} offset
     * @example
     * //example
     * voidNode.addChild(background, -1, cc.p(0.4, 0.5), cc.p(0,0));
     */
    addChild:function (child, z, ratio, offset) {
        if (arguments.length === 3) {
            cc.log("ParallaxNode: use addChild(child, z, ratio, offset) instead")
            return;
        }
        if(!child)
            throw "cc.ParallaxNode.addChild(): child should be non-null";
        var obj = cc.PointObject.create(ratio, offset);
        obj.setChild(child);
        this.parallaxArray.push(obj);

	    child.setPosition(this._position.x * ratio.x + offset.x, this._position.y * ratio.y + offset.y);

        cc.NodeRGBA.prototype.addChild.call(this, child, z, child.tag);
    },

    /**
     *  Remove Child
     * @param {cc.Node} child
     * @param {Boolean} cleanup
     * @example
     * //example
     * voidNode.removeChild(background,true);
     */
    removeChild:function (child, cleanup) {
        var locParallaxArray = this.parallaxArray;
        for (var i = 0; i < locParallaxArray.length; i++) {
            var point = locParallaxArray[i];
            if (point.getChild() == child) {
                locParallaxArray.splice(i, 1);
                break;
            }
        }
        cc.NodeRGBA.prototype.removeChild.call(this, child, cleanup);
    },

    /**
     *  Remove all children with cleanup
     * @param {Boolean} cleanup
     */
    removeAllChildren:function (cleanup) {
        this.parallaxArray.length = 0;
        cc.NodeRGBA.prototype.removeAllChildren.call(this, cleanup);
    },

    /**
     * Visit
     */
    visit:function () {
        var pos = this._absolutePosition();
        if (!cc.pointEqualToPoint(pos, this._lastPosition)) {
            var locParallaxArray = this.parallaxArray;
            for (var i = 0, len = locParallaxArray.length; i < len; i++) {
                var point = locParallaxArray[i];
	            var child = point.getChild();
	            child.setPosition(-pos.x + pos.x * point.getRatio().x + point.getOffset().x,
	                               -pos.y + pos.y * point.getRatio().y + point.getOffset().y);
            }
            this._lastPosition = pos;
        }
        cc.NodeRGBA.prototype.visit.call(this);
    },

    _absolutePosition:function () {
        var ret = this._position;
        var cn = this;
        while (cn.parent != null) {
            cn = cn.parent;
            ret = cc.pAdd(ret, cn.getPosition());
        }
        return ret;
    }
});

if(cc._renderType === cc._RENDER_TYPE_CANVAS){
    cc.ParallaxNode.prototype._transformForRenderer = function(){
        var pos = this._absolutePosition();
        if (!cc.pointEqualToPoint(pos, this._lastPosition)) {
            var locParallaxArray = this.parallaxArray;
            for (var i = 0, len = locParallaxArray.length; i < len; i++) {
                var point = locParallaxArray[i];
                var child = point.getChild();
                child.setPosition(-pos.x + pos.x * point.getRatio().x + point.getOffset().x,
                        -pos.y + pos.y * point.getRatio().y + point.getOffset().y);
            }
            this._lastPosition = pos;
        }
        cc.Node.prototype._transformForRenderer.call(this);
    };
}

/**
 * @return {cc.ParallaxNode}
 * @example
 * //example
 * var voidNode = cc.ParallaxNode.create();
 */
cc.ParallaxNode.create = function () {
    return new cc.ParallaxNode();
};
