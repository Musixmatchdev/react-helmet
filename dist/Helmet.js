"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactLibExecutionEnvironment = require("react/lib/ExecutionEnvironment");

var _reactLibExecutionEnvironment2 = _interopRequireDefault(_reactLibExecutionEnvironment);

var _CreateSideEffect = require("./CreateSideEffect");

var _CreateSideEffect2 = _interopRequireDefault(_CreateSideEffect);

var _HelmetConstantsJs = require("./HelmetConstants.js");

var _he = require("he");

var _he2 = _interopRequireDefault(_he);

var HELMET_ATTRIBUTE = "data-react-helmet";

var getTitleFromPropsList = function getTitleFromPropsList(propsList) {
    var innermostProps = propsList[propsList.length - 1];
    return innermostProps ? innermostProps.title : "";
};

var getTagsFromPropsList = function getTagsFromPropsList(tagName, uniqueTagIds, propsList) {
    // Calculate list of tags, giving priority innermost component (end of the propslist)
    var approvedSeenTags = {};
    var validTags = Object.keys(_HelmetConstantsJs.TAG_PROPERTIES).map(function (key) {
        return _HelmetConstantsJs.TAG_PROPERTIES[key];
    });

    var tagList = propsList.filter(function (props) {
        return !Object.is(typeof props[tagName], "undefined");
    }).map(function (prop) {
        return prop[tagName];
    }).reverse().reduce(function (approvedTags, instanceTags) {
        var instanceSeenTags = {};

        instanceTags.filter(function (tag) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(tag)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var attributeKey = _step.value;

                    var lowerCaseAttributeKey = attributeKey.toLowerCase();
                    var value = tag[attributeKey].toLowerCase();

                    if (Object.is(validTags.indexOf(lowerCaseAttributeKey), -1)) {
                        return false;
                    }

                    approvedSeenTags[lowerCaseAttributeKey] = approvedSeenTags[lowerCaseAttributeKey] || [];
                    instanceSeenTags[lowerCaseAttributeKey] = instanceSeenTags[lowerCaseAttributeKey] || [];

                    if (approvedSeenTags[lowerCaseAttributeKey].indexOf(value) < 0) {
                        instanceSeenTags[lowerCaseAttributeKey].push(value);
                        return true;
                    }

                    return false;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                        _iterator["return"]();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }).reverse().forEach(function (tag) {
            return approvedTags.push(tag);
        });

        // Update seen tags with tags from this instance
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = Object.keys(instanceSeenTags)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var attributeKey = _step2.value;

                approvedSeenTags[attributeKey] = approvedSeenTags[attributeKey].concat(instanceSeenTags[attributeKey]);
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                    _iterator2["return"]();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return approvedTags;
    }, []);

    return tagList;
};

var updateTags = function updateTags(type, tags) {
    var headElement = document.head || document.querySelector("head");
    var existingTags = headElement.querySelectorAll("" + type + "[" + HELMET_ATTRIBUTE + "]");

    // Remove any tags previously injected by Helmet
    Array.forEach(existingTags, function (tag) {
        return tag.parentNode.removeChild(tag);
    });

    if (tags && tags.length) {
        tags.forEach(function (tag) {
            var newElement = document.createElement(type);

            for (var attribute in tag) {
                if (tag.hasOwnProperty(attribute)) {
                    newElement.setAttribute(attribute, tag[attribute]);
                }
            }

            newElement.setAttribute(HELMET_ATTRIBUTE, "true");
            headElement.insertBefore(newElement, headElement.firstChild);
        });
    }
};

var generateTagsAsString = function generateTagsAsString(type, tags) {
    var html = tags.map(function (tag) {
        var attributeHtml = Object.keys(tag).map(function (attribute) {
            var encodedValue = _he2["default"].encode(tag[attribute], {
                useNamedReferences: true
            });
            return "" + attribute + "=\"" + encodedValue + "\"";
        }).join(" ");

        return "<" + type + " " + attributeHtml + " " + HELMET_ATTRIBUTE + "=\"true\" />";
    });

    return html.join("\n");
};

var serverTitle = "";
var serverMetaTags = [];
var serverLinkTags = [];

var Helmet = (function (_React$Component) {
    function Helmet() {
        _classCallCheck(this, Helmet);

        if (_React$Component != null) {
            _React$Component.apply(this, arguments);
        }
    }

    _inherits(Helmet, _React$Component);

    _createClass(Helmet, [{
        key: "render",
        value: function render() {
            if (Object.is(_react2["default"].Children.count(this.props.children), 1)) {
                return _react2["default"].Children.only(this.props.children);
            } else if (_react2["default"].Children.count(this.props.children) > 1) {
                return _react2["default"].createElement(
                    "span",
                    null,
                    this.props.children
                );
            }

            return null;
        }
    }], [{
        key: "handleChange",
        value: function handleChange(propsList) {
            var title = getTitleFromPropsList(propsList);
            var metaTags = getTagsFromPropsList(_HelmetConstantsJs.TAG_NAMES.META, [_HelmetConstantsJs.TAG_PROPERTIES.NAME, _HelmetConstantsJs.TAG_PROPERTIES.CHARSET, _HelmetConstantsJs.TAG_PROPERTIES.HTTPEQUIV], propsList);
            var linkTags = getTagsFromPropsList(_HelmetConstantsJs.TAG_NAMES.LINK, [_HelmetConstantsJs.TAG_PROPERTIES.REL, _HelmetConstantsJs.TAG_PROPERTIES.HREF], propsList);

            if (_reactLibExecutionEnvironment2["default"].canUseDOM) {
                document.title = title || "";
                updateTags(_HelmetConstantsJs.TAG_NAMES.LINK, linkTags);
                updateTags(_HelmetConstantsJs.TAG_NAMES.META, metaTags);
            } else {
                serverTitle = title || "";
                serverMetaTags = metaTags;
                serverLinkTags = linkTags;
            }
        }
    }, {
        key: "peek",
        value: function peek() {
            return serverTitle;
        }
    }, {
        key: "rewind",
        value: function rewind() {
            // after side-effect dispose, handle change fires again - we need to preserve variables before calling dispose.
            var _serverTitle = serverTitle;
            var _meta = generateTagsAsString(_HelmetConstantsJs.TAG_NAMES.META, serverMetaTags);
            var _link = generateTagsAsString(_HelmetConstantsJs.TAG_NAMES.LINK, serverLinkTags);
            this.dispose();

            return {
                title: _serverTitle,
                meta: _meta,
                link: _link
            };
        }
    }, {
        key: "displayName",
        value: "Helmet",
        enumerable: true
    }, {
        key: "propTypes",

        /**
         * @param {Object} title: "Title"
         * @param {Object} meta: [{"name": "description", "content": "Test description"}]
         * @param {Object} link: [{"rel": "canonical", "href": "http://mysite.com/example"}]
         */
        value: {
            title: _react2["default"].PropTypes.string,
            meta: _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.object),
            link: _react2["default"].PropTypes.arrayOf(_react2["default"].PropTypes.object),
            children: _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.object, _react2["default"].PropTypes.array])
        },
        enumerable: true
    }]);

    return Helmet;
})(_react2["default"].Component);

exports["default"] = (0, _CreateSideEffect2["default"])(Helmet);
module.exports = exports["default"];