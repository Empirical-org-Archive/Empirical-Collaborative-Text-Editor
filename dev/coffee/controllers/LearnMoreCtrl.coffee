Ctrl = require('../framework/Ctrl')
DocumentManagerService = require('../services/DocumentManagerService')

module.exports = class LearnMoreCtrl extends Ctrl
	constructor: (app, params) ->
		super(app, params)
		@services.documentManager = new DocumentManagerService(new Github({}))
		Handlebars.registerPartial "docList", """
			<ul class="nav nav-pills nav-stacked">
				{{#each this}}
					{{#isFileTest}}
						<li><a href="#/learn-more/{{url}}">{{name}}</a></li>
					{{else}}
						<li>
							<h3>{{name}}</h3>
							{{> docList docs}}
						</li>
					{{/isFileTest}}
			  {{/each}}
			</ul>
			"""

		ctx = { parents: [] }
		Handlebars.registerHelper 'isFileTest', (block) ->
			if block.data.key.match(/.*\.md$/)
				this.url = ((set = ctx.parents.slice(0)).push(block.data.key) and set).join('/')
				block.fn(this)
			else
				ctx.parents.push(block.data.key)
				block.inverse(name: block.data.key, docs: this)

	initialize: (callback) ->
		@services.documentManager.list @params.foldername, (err, data, doc) =>
			if err == 'not found'
				debugger
			@app.documents = data

			callback documents: doc if callback

	do: ->
		contentify.initialize 'empirical-org', 'Documentation', 'release'

		doc = 'Compass/Installation'
		doc = @params.doc if @params.doc

		# $('#menu-' + doc).addClass 'active'
		$('#learn-content').includeContent doc, (elem) ->
			elem.find('img').addClass 'img-responsive'
			elem.find('pre').each (i,e) ->
				hljs.highlightBlock(e)
