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

var _reactLibInvariant = require("react/lib/invariant");

var _reactLibInvariant2 = _interopRequireDefault(_reactLibInvariant);

var _reactLibShallowEqual = require("react/lib/shallowEqual");

var _reactLibShallowEqual2 = _interopRequireDefault(_reactLibShallowEqual);

var RESERVED_PROPS = {
    arguments: true,
    caller: true,
    key: true,
    length: true,
    name: true,
    prototype: true,
    ref: true,
    type: true
};

exports["default"] = function (Component) {
    (0, _reactLibInvariant2["default"])(typeof Object.is(Component.handleChange, "function"), "handleChange(propsList) is not a function.");

    var mountedInstances = [];
    var emitChange = function emitChange() {
        Component.handleChange(mountedInstances.map(function (instance) {
            return instance.props;
        }));
    };

    var CreateSideEffect = (function (_React$Component) {
        function CreateSideEffect() {
            _classCallCheck(this, CreateSideEffect);

            if (_React$Component != null) {
                _React$Component.apply(this, arguments);
            }
        }

        _inherits(CreateSideEffect, _React$Component);

        _createClass(CreateSideEffect, [{
            key: "componentWillMount",
            value: function componentWillMount() {
                mountedInstances.push(this);
                emitChange();
            }
        }, {
            key: "shouldComponentUpdate",
            value: function shouldComponentUpdate(nextProps) {
                return !(0, _reactLibShallowEqual2["default"])(nextProps, this.props);
            }
        }, {
            key: "componentDidUpdate",
            value: function componentDidUpdate() {
                emitChange();
            }
        }, {
            key: "componentWillUnmount",
            value: function componentWillUnmount() {
                var index = mountedInstances.indexOf(this);
                mountedInstances.splice(index, 1);
                emitChange();
            }
        }, {
            key: "render",
            value: function render() {
                return _react2["default"].createElement(Component, this.props);
            }
        }], [{
            key: "dispose",
            value: function dispose() {
                mountedInstances = [];
                emitChange();
            }
        }, {
            key: "displayName",
            value: "CreateSideEffect",
            enumerable: true
        }]);

        return CreateSideEffect;
    })(_react2["default"].Component);

    Object.getOwnPropertyNames(Component).filter(function (componentKey) {
        return Component.hasOwnProperty(componentKey) && !RESERVED_PROPS[componentKey];
    }).forEach(function (componentKey) {
        CreateSideEffect[componentKey] = Component[componentKey];
    });

    return CreateSideEffect;
};

module.exports = exports["default"];