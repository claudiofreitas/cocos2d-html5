/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

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
 * @constant
 * @type Number
 */
cc.SAX_NONE = 0;

/**
 * @constant
 * @type Number
 */
cc.SAX_KEY = 1;

/**
 * @constant
 * @type Number
 */
cc.SAX_DICT = 2;

/**
 * @constant
 * @type Number
 */
cc.SAX_INT = 3;

/**
 * @constant
 * @type Number
 */
cc.SAX_REAL = 4;

/**
 * @constant
 * @type Number
 */
cc.SAX_STRING = 5;

/**
 * @constant
 * @type Number
 */
cc.SAX_ARRAY = 6;

/**
 * @namespace
 */
cc.FileUtils = {};

/**
 * Get resource file data
 * @param {String} fileName The resource file name which contain the path
 * @param {Number} mode mode The read mode of the file
 * @param {Number} size If get the file data succeed the it will be the data size,or it will be 0
 * @warning If you get the file data succeed,you must delete it after used.
 * @deprecated
 */
cc.FileUtils.getFileData = function (fileName, mode, size) {
};

/**
 * Get resource file data from zip file
 * @param {String} pszZipFilePath
 * @param {String} fileName fileName The resource file name which contain the relative path of zip file
 * @param {Number} size size If get the file data succeed the it will be the data size,or it will be 0
 * @warning If you get the file data succeed,you must delete it after used.
 * @deprecated
 */
cc.FileUtils.getFileDataFromZip = function (pszZipFilePath, fileName, size) {
};

/**
 * removes the HD suffix from a path
 * @param {String} path
 * @deprecated
 */
cc.FileUtils.ccRemoveHDSuffixFromFile = function (path) {
};

//////////////////////////////////////////////////////////////////////////
// Notification support when getFileData from invalid file path.
//////////////////////////////////////////////////////////////////////////
/**
 * Notification support when getFileData from invalid file path.
 * @type {Boolean}
 */
cc.popupNotify = true;

/**
 * Generate the absolute path of the file.
 * @param {String} pszRelativePath
 * @return {String} The absolute path of the file.
 * @warning We only add the ResourcePath before the relative path of the file. <br/>
 * If you have not set the ResourcePath,the function add "/NEWPLUS/TDA_DATA/UserData/" as default.<br/>
 * You can set ResourcePath by function void setResourcePath(const char *resourcePath);
 */
cc.FileUtils.fullPathFromRelativePath = function (pszRelativePath) {
    return pszRelativePath;
};

/**
 * Generate the relative path of the file.
 * @param {String} filename
 * @param {String} relativeFile
 * @return {String}
 */
cc.FileUtils.fullPathFromRelativeFile = function (filename, relativeFile) {
    var tmpPath;
    if (filename) {
        tmpPath = relativeFile.substring(0, relativeFile.lastIndexOf("/") + 1);
        return tmpPath + filename;
    }
    else{
        tmpPath = relativeFile.substring(0, relativeFile.lastIndexOf("."));
        tmpPath = tmpPath + ".png";
        return tmpPath;
    }
};

/**
 * Set the ResourcePath,we will find resource in this path
 * @param {String} resourcePath The absolute resource path
 * @warning Don't call this function in android and iOS, it has not effect.<br/>
 * In android, if you want to read file other than apk, you shoud use invoke getFileData(), and pass the<br/>
 * absolute path.
 * @deprecated
 */
cc.FileUtils.setResourcePath = function (resourcePath) {
};

/**
 * Generate an Dictionary of object by file
 * @param fileName The file name of *.plist file
 * @return {object} The Dictionary of object generated from the file
 */
cc.FileUtils.dictionaryWithContentsOfFile = function (fileName) {
    var parser = cc.SAXParser.shareParser();
    this.rootDict = parser.parse(fileName);
    return this.rootDict;
};

/**
 * The same meaning as dictionaryWithContentsOfFile(), but it doesn't call autorelease, so the invoker should call release().
 * @param {String} fileName
 * @return {object} The Dictionary of object generated from the file
 */
cc.FileUtils.dictionaryWithContentsOfFileThreadSafe = function (fileName) {
    var tMaker = new cc.DictMaker();
    return tMaker.dictionaryWithContentsOfFile(fileName);
};

/**
 * Get the writeable path
 * @return  The path that can write/read file
 * @deprecated
 */
cc.FileUtils.getWriteablePath = function () {
};

/**
 * Set whether pop-up a message box when the image load failed
 * @param {Boolean} notify
 */
cc.FileUtils.setIsPopupNotify = function (notify) {
    cc.popupNotify = notify;
};

/**
 * Get whether pop-up a message box when the image load failed
 * @return {Boolean}
 */
cc.FileUtils.getIsPopupNotify = function () {
    return cc.popupNotify;
};

/**
 * plist Dictionary Maker
 * @class
 * @extends cc.Class
 * @example
 * //create a DictMaker
 * var tMaker = new cc.DictMaker();
 * tMaker.dictionaryWithContentsOfFile(fileName);
 */
cc.DictMaker = cc.Class.extend(/** @lends cc.DictMaker# */{
    rootDict:[],
    /**
     * Generate dictionary with contents of file
     * @param {String} fileName
     * @return {Array}
     */
    dictionaryWithContentsOfFile:function (fileName) {
        var parser = cc.SAXParser.shareParser();
        this.rootDict = parser.parse(fileName);
        return this.rootDict;
    }
});