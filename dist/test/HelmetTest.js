"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

var _reactAddons = require("react/addons");

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _indexJsx = require("../index.jsx");

var _indexJsx2 = _interopRequireDefault(_indexJsx);

var HELMET_ATTRIBUTE = "data-react-helmet";

describe("Helmet", function () {
    var headElement;

    var TestUtils = _reactAddons2["default"].addons.TestUtils;

    var HelmetRendered = undefined;

    beforeEach(function () {
        headElement = headElement || document.head || document.querySelector("head");

        if (HelmetRendered) {
            HelmetRendered.constructor.dispose();
        }
    });

    it("can update page title", function () {
        HelmetRendered = TestUtils.renderIntoDocument(_reactAddons2["default"].createElement(_indexJsx2["default"], {
            title: "Test Title"
        }));

        expect(document.title).to.equal("Test Title");
    });

    it("can update page title with multiple children", function () {
        HelmetRendered = TestUtils.renderIntoDocument(_reactAddons2["default"].createElement(
            _indexJsx2["default"],
            {
                title: "Test Title"
            },
            _reactAddons2["default"].createElement(_indexJsx2["default"], {
                title: "Child One Title"
            }),
            _reactAddons2["default"].createElement(_indexJsx2["default"], {
                title: "Child Two Title"
            })
        ));

        expect(document.title).to.equal("Child Two Title");
    });

    it("will set blank title if none is specified", function () {
        HelmetRendered = TestUtils.renderIntoDocument(_reactAddons2["default"].createElement(_indexJsx2["default"], null));

        expect(document.title).to.equal("");
    });

    it("will set title based on deepest nested component", function () {
        HelmetRendered = TestUtils.renderIntoDocument(_reactAddons2["default"].createElement(
            _indexJsx2["default"],
            { title: "Main Title" },
            _reactAddons2["default"].createElement(_indexJsx2["default"], { title: "Nested Title" })
        ));

        expect(document.title).to.equal("Nested Title");
    });

    it("can update meta tags", function () {
        HelmetRendered = TestUtils.renderIntoDocument(_reactAddons2["default"].createElement(_indexJsx2["default"], {
            meta: [{ "charset": "utf-8" }, { "name": "description", "content": "Test description" }, { "http-equiv": "content-type", "content": "text/html" }, { "property": "og:type", "content": "article" }]
        }));

        var existingTags = headElement.querySelectorAll("meta[" + HELMET_ATTRIBUTE + "]");

        expect(existingTags).to.not.equal(undefined);

        var filteredTags = [].slice.call(existingTags).filter(function (tag) {
            return Object.is(tag.getAttribute("charset"), "utf-8") || Object.is(tag.getAttribute("name"), "description") && Object.is(tag.getAttribute("content"), "Test description") || Object.is(tag.getAttribute("http-equiv"), "content-type") && Object.is(tag.getAttribute("content"), "text/html");
        });

        expect(filteredTags.length).to.be.at.least(3);
    });

    it("will clear all meta tags if none are specified", function () {
        HelmetRendered = TestUtils.renderIntoDocument(_reactAddons2["default"].createElement(_indexJsx2["default"], null));

        var existingTags = headElement.querySelectorAll("meta[" + HELMET_ATTRIBUTE + "]");

        expect(existingTags).to.not.equal(undefined);
        expect(existingTags.length).to.equal(0);
    });

    it("tags without 'name', 'http-equiv', 'property', or 'charset' will not be accepted", function () {
        HelmetRendered = TestUtils.renderIntoDocument(_reactAddons2["default"].createElement(_indexJsx2["default"], {
            meta: ["content", "won't work"]
        }));

        var existingTags = headElement.querySelectorAll("meta[" + HELMET_ATTRIBUTE + "]");

        expect(existingTags).to.not.equal(undefined);
        expect(existingTags.length).to.equal(0);
    });

    it("will set meta tags based on deepest nested component", function () {
        HelmetRendered = TestUtils.renderIntoDocument(_reactAddons2["default"].createElement(
            _indexJsx2["default"],
            {
                meta: [{ "charset": "utf-8" }, { "name": "description", "content": "Test description" }]
            },
            _reactAddons2["default"].createElement(_indexJsx2["default"], {
                meta: [{ "name": "description", "content": "Inner description" }, { "name": "keywords", "content": "test,meta,tags" }]
            })
        ));

        var existingTags = headElement.querySelectorAll("meta[" + HELMET_ATTRIBUTE + "]");

        var _existingTags = _slicedToArray(existingTags, 3);

        var firstTag = _existingTags[0];
        var secondTag = _existingTags[1];
        var thirdTag = _existingTags[2];

        expect(existingTags).to.not.equal(undefined);

        expect(existingTags.length).to.be.equal(3);

        expect(existingTags).to.have.deep.property("[0]").that.is.an["instanceof"](Element);
        expect(firstTag).to.have.property("getAttribute");
        expect(firstTag.getAttribute("charset")).to.equal("utf-8");
        expect(firstTag.outerHTML).to.equal("<meta charset=\"utf-8\" " + HELMET_ATTRIBUTE + "=\"true\">");

        expect(existingTags).to.have.deep.property("[1]").that.is.an["instanceof"](Element);
        expect(secondTag).to.have.property("getAttribute");
        expect(secondTag.getAttribute("name")).to.equal("description");
        expect(secondTag.getAttribute("content")).to.equal("Inner description");
        expect(secondTag.outerHTML).to.equal("<meta name=\"description\" content=\"Inner description\" " + HELMET_ATTRIBUTE + "=\"true\">");

        expect(existingTags).to.have.deep.property("[2]").that.is.an["instanceof"](Element);
        expect(thirdTag).to.have.property("getAttribute");
        expect(thirdTag.getAttribute("name")).to.equal("keywords");
        expect(thirdTag.getAttribute("content")).to.equal("test,meta,tags");
        expect(thirdTag.outerHTML).to.equal("<meta name=\"keywords\" content=\"test,meta,tags\" " + HELMET_ATTRIBUTE + "=\"true\">");
    });

    it("will allow duplicate meta tags if specified in the same component", function () {
        HelmetRendered = TestUtils.renderIntoDocument(_reactAddons2["default"].createElement(_indexJsx2["default"], {
            meta: [{ "name": "description", "content": "Test description" }, { "name": "description", "content": "Duplicate description" }]
        }));

        var existingTags = headElement.querySelectorAll("meta[" + HELMET_ATTRIBUTE + "]");

        var _existingTags2 = _slicedToArray(existingTags, 2);

        var firstTag = _existingTags2[0];
        var secondTag = _existingTags2[1];

        expect(existingTags).to.not.equal(undefined);

        expect(existingTags.length).to.equal(2);

        expect(existingTags).to.have.deep.property("[0]").that.is.an["instanceof"](Element);
        expect(firstTag).to.have.property("getAttribute");
        expect(firstTag.getAttribute("name")).to.equal("description");
        expect(firstTag.getAttribute("content")).to.equal("Test description");
        expect(firstTag.outerHTML).to.equal("<meta name=\"description\" content=\"Test description\" " + HELMET_ATTRIBUTE + "=\"true\">");

        expect(existingTags).to.have.deep.property("[1]").that.is.an["instanceof"](Element);
        expect(secondTag).to.have.property("getAttribute");
        expect(secondTag.getAttribute("name")).to.equal("description");
        expect(secondTag.getAttribute("content")).to.equal("Duplicate description");
        expect(secondTag.outerHTML).to.equal("<meta name=\"description\" content=\"Duplicate description\" " + HELMET_ATTRIBUTE + "=\"true\">");
    });

    it("will override duplicate meta tags with single meta tag in a nested component", function () {
        HelmetRendered = TestUtils.renderIntoDocument(_reactAddons2["default"].createElement(
            _indexJsx2["default"],
            {
                meta: [{ "name": "description", "content": "Test description" }, { "name": "description", "content": "Duplicate description" }]
            },
            _reactAddons2["default"].createElement(_indexJsx2["default"], {
                meta: [{ "name": "description", "content": "Inner description" }]
            })
        ));

        var existingTags = headElement.querySelectorAll("meta[" + HELMET_ATTRIBUTE + "]");

        var _existingTags3 = _slicedToArray(existingTags, 1);

        var firstTag = _existingTags3[0];

        expect(existingTags).to.not.equal(undefined);

        expect(existingTags.length).to.equal(1);

        expect(existingTags).to.have.deep.property("[0]").that.is.an["instanceof"](Element);
        expect(firstTag).to.have.property("getAttribute");
        expect(firstTag.getAttribute("name")).to.equal("description");
        expect(firstTag.getAttribute("content")).to.equal("Inner description");
        expect(firstTag.outerHTML).to.equal("<meta name=\"description\" content=\"Inner description\" " + HELMET_ATTRIBUTE + "=\"true\">");
    });

    it("will override single meta tag with duplicate meta tags in a nested component", function () {
        HelmetRendered = TestUtils.renderIntoDocument(_reactAddons2["default"].createElement(
            _indexJsx2["default"],
            {
                meta: [{ "name": "description", "content": "Test description" }]
            },
            _reactAddons2["default"].createElement(_indexJsx2["default"], {
                meta: [{ "name": "description", "content": "Inner description" }, { "name": "description", "content": "Inner duplicate description" }]
            })
        ));

        var existingTags = headElement.querySelectorAll("meta[" + HELMET_ATTRIBUTE + "]");

        var _existingTags4 = _slicedToArray(existingTags, 2);

        var firstTag = _existingTags4[0];
        var secondTag = _existingTags4[1];

        expect(existingTags).to.not.equal(undefined);

        expect(existingTags.length).to.equal(2);

        expect(existingTags).to.have.deep.property("[0]").that.is.an["instanceof"](Element);
        expect(firstTag).to.have.property("getAttribute");
        expect(firstTag.getAttribute("name")).to.equal("description");
        expect(firstTag.getAttribute("content")).to.equal("Inner description");
        expect(firstTag.outerHTML).to.equal("<meta name=\"description\" content=\"Inner description\" " + HELMET_ATTRIBUTE + "=\"true\">");

        expect(existingTags).to.have.deep.property("[1]").that.is.an["instanceof"](Element);
        expect(secondTag).to.have.property("getAttribute");
        expect(secondTag.getAttribute("name")).to.equal("description");
        expect(secondTag.getAttribute("content")).to.equal("Inner duplicate description");
        expect(secondTag.outerHTML).to.equal("<meta name=\"description\" content=\"Inner duplicate description\" " + HELMET_ATTRIBUTE + "=\"true\">");
    });

    it("can update link tags", function () {
        HelmetRendered = TestUtils.renderIntoDocument(_reactAddons2["default"].createElement(_indexJsx2["default"], {
            link: [{ "href": "http://localhost/helmet", "rel": "canonical" }, { "href": "http://localhost/style.css", "rel": "stylesheet", "type": "text/css" }]
        }));

        var existingTags = headElement.getElementsByTagName("link");

        expect(existingTags).to.not.equal(undefined);

        var filteredTags = [].slice.call(existingTags).filter(function (tag) {
            return Object.is(tag.getAttribute("href"), "http://localhost/style.css") && Object.is(tag.getAttribute("rel"), "stylesheet") && Object.is(tag.getAttribute("type"), "text/css") || Object.is(tag.getAttribute("href"), "http://localhost/helmet") && Object.is(tag.getAttribute("rel"), "canonical");
        });

        expect(filteredTags.length).to.be.at.least(2);
    });

    it("will clear all link tags if none are specified", function () {
        HelmetRendered = TestUtils.renderIntoDocument(_reactAddons2["default"].createElement(_indexJsx2["default"], null));

        var existingTags = headElement.querySelectorAll("link[" + HELMET_ATTRIBUTE + "]");

        expect(existingTags).to.not.equal(undefined);
        expect(existingTags.length).to.equal(0);
    });

    it("will set link tags based on deepest nested component", function () {
        HelmetRendered = TestUtils.renderIntoDocument(_reactAddons2["default"].createElement(
            _indexJsx2["default"],
            {
                link: [{ "rel": "canonical", "href": "http://localhost/helmet" }, { "href": "http://localhost/style.css", "rel": "stylesheet", "type": "text/css", "media": "all" }]
            },
            _reactAddons2["default"].createElement(_indexJsx2["default"], {
                link: [{ "rel": "canonical", "href": "http://localhost/helmet/innercomponent" }, { "href": "http://localhost/inner.css", "rel": "stylesheet", "type": "text/css", "media": "all" }]
            })
        ));

        var existingTags = headElement.querySelectorAll("link[" + HELMET_ATTRIBUTE + "]");

        var _existingTags5 = _slicedToArray(existingTags, 3);

        var firstTag = _existingTags5[0];
        var secondTag = _existingTags5[1];
        var thirdTag = _existingTags5[2];

        expect(existingTags).to.not.equal(undefined);

        expect(existingTags.length).to.be.at.least(2);

        expect(existingTags).to.have.deep.property("[0]").that.is.an["instanceof"](Element);
        expect(firstTag).to.have.property("getAttribute");
        expect(firstTag.getAttribute("href")).to.equal("http://localhost/style.css");
        expect(firstTag.getAttribute("rel")).to.equal("stylesheet");
        expect(firstTag.getAttribute("type")).to.equal("text/css");
        expect(firstTag.getAttribute("media")).to.equal("all");
        expect(firstTag.outerHTML).to.equal("<link href=\"http://localhost/style.css\" rel=\"stylesheet\" type=\"text/css\" media=\"all\" " + HELMET_ATTRIBUTE + "=\"true\">");

        expect(existingTags).to.have.deep.property("[1]").that.is.an["instanceof"](Element);
        expect(secondTag).to.have.property("getAttribute");
        expect(secondTag.getAttribute("href")).to.equal("http://localhost/helmet/innercomponent");
        expect(secondTag.getAttribute("rel")).to.equal("canonical");
        expect(secondTag.outerHTML).to.equal("<link rel=\"canonical\" href=\"http://localhost/helmet/innercomponent\" " + HELMET_ATTRIBUTE + "=\"true\">");

        expect(existingTags).to.have.deep.property("[2]").that.is.an["instanceof"](Element);
        expect(thirdTag).to.have.property("getAttribute");
        expect(thirdTag.getAttribute("href")).to.equal("http://localhost/inner.css");
        expect(thirdTag.getAttribute("rel")).to.equal("stylesheet");
        expect(thirdTag.getAttribute("type")).to.equal("text/css");
        expect(thirdTag.getAttribute("media")).to.equal("all");
        expect(thirdTag.outerHTML).to.equal("<link href=\"http://localhost/inner.css\" rel=\"stylesheet\" type=\"text/css\" media=\"all\" " + HELMET_ATTRIBUTE + "=\"true\">");
    });

    it("will allow duplicate link tags if specified in the same component", function () {
        HelmetRendered = TestUtils.renderIntoDocument(_reactAddons2["default"].createElement(_indexJsx2["default"], {
            link: [{ "rel": "canonical", "href": "http://localhost/helmet" }, { "rel": "canonical", "href": "http://localhost/helmet/component" }]
        }));

        var existingTags = headElement.querySelectorAll("link[" + HELMET_ATTRIBUTE + "]");

        var _existingTags6 = _slicedToArray(existingTags, 2);

        var firstTag = _existingTags6[0];
        var secondTag = _existingTags6[1];

        expect(existingTags).to.not.equal(undefined);

        expect(existingTags.length).to.be.at.least(2);

        expect(existingTags).to.have.deep.property("[0]").that.is.an["instanceof"](Element);
        expect(firstTag).to.have.property("getAttribute");
        expect(firstTag.getAttribute("rel")).to.equal("canonical");
        expect(firstTag.getAttribute("href")).to.equal("http://localhost/helmet");
        expect(firstTag.outerHTML).to.equal("<link rel=\"canonical\" href=\"http://localhost/helmet\" " + HELMET_ATTRIBUTE + "=\"true\">");

        expect(existingTags).to.have.deep.property("[1]").that.is.an["instanceof"](Element);
        expect(secondTag).to.have.property("getAttribute");
        expect(secondTag.getAttribute("rel")).to.equal("canonical");
        expect(secondTag.getAttribute("href")).to.equal("http://localhost/helmet/component");
        expect(secondTag.outerHTML).to.equal("<link rel=\"canonical\" href=\"http://localhost/helmet/component\" " + HELMET_ATTRIBUTE + "=\"true\">");
    });

    it("will override duplicate link tags with a single link tag in a nested component", function () {
        HelmetRendered = TestUtils.renderIntoDocument(_reactAddons2["default"].createElement(
            _indexJsx2["default"],
            {
                link: [{ "rel": "canonical", "href": "http://localhost/helmet" }, { "rel": "canonical", "href": "http://localhost/helmet/component" }]
            },
            _reactAddons2["default"].createElement(_indexJsx2["default"], {
                link: [{ "rel": "canonical", "href": "http://localhost/helmet/innercomponent" }]
            })
        ));

        var existingTags = headElement.querySelectorAll("link[" + HELMET_ATTRIBUTE + "]");

        var _existingTags7 = _slicedToArray(existingTags, 1);

        var firstTag = _existingTags7[0];

        expect(existingTags).to.not.equal(undefined);

        expect(existingTags.length).to.be.equal(1);

        expect(existingTags).to.have.deep.property("[0]").that.is.an["instanceof"](Element);
        expect(firstTag).to.have.property("getAttribute");
        expect(firstTag.getAttribute("rel")).to.equal("canonical");
        expect(firstTag.getAttribute("href")).to.equal("http://localhost/helmet/innercomponent");
        expect(firstTag.outerHTML).to.equal("<link rel=\"canonical\" href=\"http://localhost/helmet/innercomponent\" " + HELMET_ATTRIBUTE + "=\"true\">");
    });

    it("will override single link tag with duplicate link tags in a nested component", function () {
        HelmetRendered = TestUtils.renderIntoDocument(_reactAddons2["default"].createElement(
            _indexJsx2["default"],
            {
                link: [{ "rel": "canonical", "href": "http://localhost/helmet" }]
            },
            _reactAddons2["default"].createElement(_indexJsx2["default"], {
                link: [{ "rel": "canonical", "href": "http://localhost/helmet/component" }, { "rel": "canonical", "href": "http://localhost/helmet/innercomponent" }]
            })
        ));

        var existingTags = headElement.querySelectorAll("link[" + HELMET_ATTRIBUTE + "]");

        var _existingTags8 = _slicedToArray(existingTags, 2);

        var firstTag = _existingTags8[0];
        var secondTag = _existingTags8[1];

        expect(existingTags).to.not.equal(undefined);

        expect(existingTags.length).to.be.equal(2);

        expect(existingTags).to.have.deep.property("[0]").that.is.an["instanceof"](Element);
        expect(firstTag).to.have.property("getAttribute");
        expect(firstTag.getAttribute("rel")).to.equal("canonical");
        expect(firstTag.getAttribute("href")).to.equal("http://localhost/helmet/component");
        expect(firstTag.outerHTML).to.equal("<link rel=\"canonical\" href=\"http://localhost/helmet/component\" " + HELMET_ATTRIBUTE + "=\"true\">");

        expect(existingTags).to.have.deep.property("[1]").that.is.an["instanceof"](Element);
        expect(secondTag).to.have.property("getAttribute");
        expect(secondTag.getAttribute("rel")).to.equal("canonical");
        expect(secondTag.getAttribute("href")).to.equal("http://localhost/helmet/innercomponent");
        expect(secondTag.outerHTML).to.equal("<link rel=\"canonical\" href=\"http://localhost/helmet/innercomponent\" " + HELMET_ATTRIBUTE + "=\"true\">");
    });

    it("without prerender will return default head values when a DOM is present", function () {
        HelmetRendered = TestUtils.renderIntoDocument(_reactAddons2["default"].createElement(_indexJsx2["default"], {
            title: "Title that won't be recorded",
            meta: [{ "charset": "utf-8" }, { "name": "description", "content": "Test description" }, { "http-equiv": "content-type", "content": "text/html" }, { "property": "og:type", "content": "article" }],
            link: [{ "href": "http://localhost/helmet/innercomponent", "rel": "canonical" }, { "href": "http://localhost/inner.css", "rel": "stylesheet", "type": "text/css", "media": "all" }]
        }));

        var head = HelmetRendered.constructor.rewind();
        expect(head.title).to.be.equal("");
        expect(head.meta).to.be.equal("");
        expect(head.link).to.be.equal("");
    });

    it("will html encode string", function () {
        HelmetRendered = TestUtils.renderIntoDocument(_reactAddons2["default"].createElement(_indexJsx2["default"], {
            meta: [{ "name": "description", "content": "This is \"quoted\" text and & and '." }]
        }));

        var existingTags = headElement.querySelectorAll("meta[" + HELMET_ATTRIBUTE + "]");
        var existingTag = existingTags[0];

        expect(existingTags).to.not.equal(undefined);

        expect(existingTags.length).to.be.equal(1);

        expect(existingTags).to.have.deep.property("[0]").that.is.an["instanceof"](Element);
        expect(existingTag).to.have.property("getAttribute");
        expect(existingTag.getAttribute("name")).to.equal("description");
        expect(existingTag.getAttribute("content")).to.equal("This is \"quoted\" text and & and '.");
        expect(existingTag.outerHTML).to.equal("<meta name=\"description\" content=\"This is &quot;quoted&quot; text and &amp; and '.\" " + HELMET_ATTRIBUTE + "=\"true\">");
    });
});