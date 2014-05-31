var Ctrl, DocumentManagerService, LearnMoreCtrl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Ctrl = require('../framework/Ctrl');

DocumentManagerService = require('../services/DocumentManagerService');

module.exports = LearnMoreCtrl = (function(_super) {
  __extends(LearnMoreCtrl, _super);

  function LearnMoreCtrl(app, params) {
    var ctx;
    LearnMoreCtrl.__super__.constructor.call(this, app, params);
    this.services.documentManager = new DocumentManagerService(new Github({}));
    Handlebars.registerPartial("docList", "<ul class=\"nav nav-pills nav-stacked\">\n	{{#each this}}\n		{{#isFileTest}}\n			<li><a href=\"#/learn-more/{{url}}\">{{name}}</a></li>\n		{{else}}\n			<li>\n				<h3>{{name}}</h3>\n				{{> docList docs}}\n			</li>\n		{{/isFileTest}}\n  {{/each}}\n</ul>");
    ctx = {
      parents: []
    };
    Handlebars.registerHelper('isFileTest', function(block) {
      var set;
      if (block.data.key.match(/.*\.md$/)) {
        this.url = ((set = ctx.parents.slice(0)).push(block.data.key) && set).join('/');
        return block.fn(this);
      } else {
        ctx.parents.push(block.data.key);
        return block.inverse({
          name: block.data.key,
          docs: this
        });
      }
    });
  }

  LearnMoreCtrl.prototype.initialize = function(callback) {
    return this.services.documentManager.list(this.params.foldername, (function(_this) {
      return function(err, data, doc) {
        if (err === 'not found') {
          debugger;
        }
        _this.app.documents = data;
        if (callback) {
          return callback({
            documents: doc
          });
        }
      };
    })(this));
  };

  LearnMoreCtrl.prototype["do"] = function() {
    var doc;
    contentify.initialize('empirical-org', 'Documentation', 'release');
    doc = 'Compass/Installation';
    if (this.params.doc) {
      doc = this.params.doc;
    }
    return $('#learn-content').includeContent(doc, function(elem) {
      elem.find('img').addClass('img-responsive');
      return elem.find('pre').each(function(i, e) {
        return hljs.highlightBlock(e);
      });
    });
  };

  return LearnMoreCtrl;

})(Ctrl);
