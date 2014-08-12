Package.describe({
  summary: 'it extratz teh code from gitbuh'
});

Npm.depends({
    'estraverse': '1.5.1',
    'escodegen': '1.3.3',
    'esprima': '1.2.2',
    'highlight.js': '8.1.0'
});

Package.on_use(function (api) {

  api.use('underscore', 'server');
  api.add_files('lib/extract.js', 'server');
  api.add_files('lib/scoper.js', 'server');
  api.add_files('lib/sourcer.js', 'server');
  
  if (typeof api.export !== 'undefined') {
    api.export('Extractor', 'server');
    api.export('Scoper', 'server');
    api.export('Sourcer', 'server');
  }
  
});

