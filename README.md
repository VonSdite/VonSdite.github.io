# 备份

## Usage
- ```npm install hexo```
- ```npm install```


## 修改的第三方插件代码

- ~[hexo-admin](#hexo-admin)~ **已经不使用这个插件了**
- [hexo-helper-live2d](#hexo-helper-live2d)

### hexo-admin
- 修改了其中 `Image pasting`时，生成的图片markdown地址(原本是错误的(Ｔ▽Ｔ))

`/node_modules/hexo-admin/api.js`

<details>
<summary>展开代码</summary>

```javascript
var path = require('path')
var fs = require('hexo-fs')
var yml = require('js-yaml')
var deepAssign = require('deep-assign')
var extend = require('extend')
var updateAny = require('./update')
  , updatePage = updateAny.bind(null, 'Page')
  , update = updateAny.bind(null, 'Post')
  , deploy = require('./deploy')

module.exports = function (app, hexo) {

  function addIsDraft(post) {
    post.isDraft = post.source.indexOf('_draft') === 0
    post.isDiscarded = post.source.indexOf('_discarded') === 0
    return post
  }

  function tagsCategoriesAndMetadata() {
    var cats = {}
      , tags = {}
    hexo.model('Category').forEach(function (cat) {
      cats[cat._id] = cat.name
    })
    hexo.model('Tag').forEach(function (tag) {
      tags[tag._id] = tag.name
    })
    return {
      categories: cats,
      tags: tags,
      metadata: Object.keys(hexo.config.metadata || {})
    }
  }

  // reads admin panel settings from _admin-config.yml
  // or writes it if it does not exist
  function getSettings() {
    var path = hexo.base_dir + '_admin-config.yml'
    if (!fs.existsSync(path)) {
      hexo.log.d('admin config not found, creating one')
      fs.writeFile(hexo.base_dir+'_admin-config.yml', '')
      return {}
    } else {
      var settings = yml.safeLoad(fs.readFileSync(path))

      if (!settings) return {}
      return settings
    }
  }

  function remove(id, body, res) {
    var post = hexo.model('Post').get(id)
    if (!post) return res.send(404, "Post not found")
    var newSource = '_discarded/' + post.source.slice('_drafts'.length)
    update(id, {source: newSource}, function (err, post) {
      if (err) {
        return res.send(400, err);
      }
      res.done(addIsDraft(post))
    }, hexo)
  }

  function publish(id, body, res) {
    var post = hexo.model('Post').get(id)
    if (!post) return res.send(404, "Post not found")
    var newSource = '_posts/' + post.source.slice('_drafts/'.length)
    update(id, {source: newSource}, function (err, post) {
      if (err) {
        return res.send(400, err);
      }
      res.done(addIsDraft(post))
    }, hexo)
  }

  function unpublish(id, body, res) {
    var post = hexo.model('Post').get(id)
    if (!post) return res.send(404, "Post not found")
    var newSource = '_drafts/' + post.source.slice('_posts/'.length)
    update(id, {source: newSource}, function (err, post) {
      if (err) {
        return res.send(400, err);
      }
      res.done(addIsDraft(post))
    }, hexo)
  }

  function rename(id, body, res) {
    var model = 'Post'
    var post = hexo.model('Post').get(id)
    if (!post) {
      model = 'Page'
      post = hexo.model('Page').get(id)
      if (!post) return res.send(404, "Post not found")
    }
    // remember old path w/o index.md
    var oldPath = post.full_source
    oldPath = oldPath.slice(0, oldPath.indexOf('index.md'))

    updateAny(model, id, {source: body.filename}, function (err, post) {
      if (err) {
        return res.send(400, err);
      }
      hexo.log.d(`renamed ${model.toLowerCase()} to ${body.filename}`)

      // remove old folder if empty
      if (model === 'Page' && fs.existsSync(oldPath)) {
        if (fs.readdirSync(oldPath).length === 0) {
          fs.rmdirSync(oldPath)
          hexo.log.d('removed old page\'s empty directory')
        }
      }

      res.done(addIsDraft(post))
    }, hexo)
  }

  var use = function (path, fn) {
    app.use(hexo.config.root + 'admin/api/' + path, function (req, res) {
      var done = function (val) {
        if (!val) {
          res.statusCode = 204
          return res.end('');
        }
        res.setHeader('Content-type', 'application/json')
        res.end(JSON.stringify(val, function(k, v) {
          // tags and cats have posts reference resulting in circular json..
          if ( k == 'tags' || k == 'categories' ) {
            // convert object to simple array
            return v.toArray ? v.toArray().map(function(obj) {
              return obj.name
            }) : v
          }
          return v;
        }))
      }
      res.done = done
      res.send = function (num, data) {
        res.statusCode = num
        res.end(data)
      }
      fn(req, res)
    })
  }

  use('tags-categories-and-metadata', function (req, res) {
    res.done(tagsCategoriesAndMetadata())
  });

  use('settings/list', function (req, res) {
    res.done(getSettings())
  });

  use('settings/set', function (req, res, next) {
    if (req.method !== 'POST') return next()
    if (!req.body.name) {
      console.log('no name')
      hexo.log.d('no name')
      return res.send(400, 'No name given')
    }
    // value is capable of being false
    if (typeof req.body.value === 'undefined') {
      console.log('no value')
      hexo.log.d('no value')
      return res.send(400, 'No value given')
    }

    var name = req.body.name
    var value = req.body.value

    // no addOptions means we just want to set a single value in the admin options
    // usually for text-based option setting
    var addedOptsExist = !!req.body.addedOptions

    settings = getSettings()
    // create options section if it doesn't exist, ie. first time changing settings
    if (!settings.options) {
      settings.options = {}
    }

    settings.options[name] = value

    var addedOptions = addedOptsExist ? req.body.addedOptions : 'no additional options'
    if (addedOptsExist) {
      settings = deepAssign(settings, addedOptions)
    }
    hexo.log.d('set', name, '=', value, 'with', JSON.stringify(addedOptions))

    fs.writeFileSync(hexo.base_dir + '_admin-config.yml', yml.safeDump(settings))
    res.done({
      updated: 'Successfully updated ' + name + ' = ' + value,
      settings: settings
    })
  });

  use('pages/list', function (req, res) {
   var page = hexo.model('Page')
   res.done(page.toArray().map(addIsDraft));
  });

  use('pages/new', function (req, res, next) {
    if (req.method !== 'POST') return next()
    if (!req.body) {
      return res.send(400, 'No page body given');
    }
    if (!req.body.title) {
      return res.send(400, 'No title given');
    }

    hexo.post.create({title: req.body.title, layout: 'page', date: new Date()})
    .error(function(err) {
      console.error(err, err.stack)
      return res.send(500, 'Failed to create page')
    })
    .then(function (file) {
      var source = file.path.slice(hexo.source_dir.length)

      hexo.source.process([source]).then(function () {
        var page = hexo.model('Page').findOne({source: source})
        res.done(addIsDraft(page));
      });
    });
  });


  use('pages/', function (req, res, next) {
    var url = req.url
    console.log('in pages', url)
    if (url[url.length - 1] === '/') {
      url = url.slice(0, -1)
    }
    var parts = url.split('/')
    var last = parts[parts.length-1]
    // not currently used?
    if (last === 'remove') {
      return remove(parts[parts.length-2], req.body, res)
    }
    if (last === 'rename') {
      return remove(parts[parts.length-2], req.body, res)
    }

    var id = last
    if (id === 'pages' || !id) return next()
    if (req.method === 'GET') {
      var page = hexo.model('Page').get(id)
      if (!page) return next()
      return res.done(addIsDraft(page))
    }

    if (!req.body) {
      return res.send(400, 'No page body given');
    }

    updatePage(id, req.body, function (err, page) {
      if (err) {
        return res.send(400, err);
      }
      res.done({
        page: addIsDraft(page),
        tagsCategoriesAndMetadata: tagsCategoriesAndMetadata()
      })
    }, hexo);
  });

  use('posts/list', function (req, res) {
   var post = hexo.model('Post')
   res.done(post.toArray().map(addIsDraft));
  });

  use('posts/new', function (req, res, next) {
    if (req.method !== 'POST') return next()
    if (!req.body) {
      return res.send(400, 'No post body given');
    }
    if (!req.body.title) {
      return res.send(400, 'No title given');
    }

    var postParameters = {title: req.body.title, layout: 'draft', date: new Date(), author: hexo.config.author};
    extend(postParameters, hexo.config.metadata || {});
    hexo.post.create(postParameters)
    .error(function(err) {
      console.error(err, err.stack)
      return res.send(500, 'Failed to create post')
    })
    .then(function (file) {
      var source = file.path.slice(hexo.source_dir.length)
      hexo.source.process([source]).then(function () {
        var post = hexo.model('Post').findOne({source: source.replace(/\\/g, '\/')})
        res.done(addIsDraft(post));
      });
    });
  });

  use('posts/', function (req, res, next) {
    var url = req.url
    if (url[url.length - 1] === '/') {
      url = url.slice(0, -1)
    }
    var parts = url.split('/')
    var last = parts[parts.length-1]
    if (last === 'publish') {
      return publish(parts[parts.length-2], req.body, res)
    }
    if (last === 'unpublish') {
      return unpublish(parts[parts.length-2], req.body, res)
    }
    if (last === 'remove') {
      return remove(parts[parts.length-2], req.body, res)
    }
    if (last === 'rename') {
      return rename(parts[parts.length-2], req.body, res)
    }

    var id = last
    if (id === 'posts' || !id) return next()
    if (req.method === 'GET') {
      var post = hexo.model('Post').get(id)
      if (!post) return next()
      return res.done(addIsDraft(post))
    }

    if (!req.body) {
      return res.send(400, 'No post body given');
    }

    update(id, req.body, function (err, post) {
      if (err) {
        return res.send(400, err);
      }
      res.done({
        post: addIsDraft(post),
        tagsCategoriesAndMetadata: tagsCategoriesAndMetadata()
      })
    }, hexo);
  });

  use('images/upload', function (req, res, next) {
    hexo.log.d('uploading image')
    if (req.method !== 'POST') return next()
    if (!req.body) {
      return res.send(400, 'No post body given');
    }
    if (!req.body.data) {
      return res.send(400, 'No data given');
    }
    var settings = getSettings()

    var imagePath = '/images'
    var imagePrefix = 'pasted-'
    var askImageFilename = false
    var overwriteImages = false
    // check for image settings and set them if they exist
    if (settings.options) {
      askImageFilename = !!settings.options.askImageFilename
      overwriteImages = !!settings.options.overwriteImages
      imagePath = settings.options.imagePath ? settings.options.imagePath : imagePath
      imagePrefix = settings.options.imagePrefix ? settings.options.imagePrefix : imagePrefix
    }

    var msg = 'upload successful'
    var i = 0
    while (fs.existsSync(path.join(hexo.source_dir, imagePath, imagePrefix + i +'.png'))) {
      i +=1
    }
    var filename = path.join(imagePrefix + i +'.png')
    if (req.body.filename) {
      var givenFilename = req.body.filename
      // check for png ending, add it if not there
      var index = givenFilename.toLowerCase().indexOf('.png')
      if (index < 0 || index != givenFilename.length - 4) {
        givenFilename += '.png'
      }
      hexo.log.d('trying custom filename', givenFilename)
      if (fs.existsSync(path.join(hexo.source_dir, imagePath, givenFilename))){
        if (overwriteImages) {
          hexo.log.d('file already exists, overwriting')
          msg = 'overwrote existing file'
          filename = givenFilename
        } else {
          hexo.log.d('file already exists, using', filename)
          msg = 'filename already exists, renamed'
        }
      } else {
        filename = givenFilename
      }
    }

    filename = path.join(imagePath, filename)
    var outpath = path.join(hexo.source_dir, filename)

    var dataURI = req.body.data.slice('data:image/png;base64,'.length)
    var buf = new Buffer(dataURI, 'base64')
    hexo.log.d(`saving image to ${outpath}`)

    if (filename[filename.length - 1] == "/")
      filename.slice(0, -1)

    var markdownImagePath = hexo.config.root + filename
    markdownImagePath = markdownImagePath.replace(/\/\\/g, "\\")

    fs.writeFile(outpath, buf, function (err) {
      if (err) {
        console.log(err)
      }
      hexo.source.process().then(function () {
        res.done({
          src: markdownImagePath,
          msg: msg
        })
      });
    })
  });

  use('deploy', function(req, res, next) {
    if (req.method !== 'POST') return next()
    if (!hexo.config.admin || !hexo.config.admin.deployCommand) {
      return res.done({error: 'Config value "admin.deployCommand" not found'});
    }
    try {
      deploy(hexo.config.admin.deployCommand, req.body.message, function(err, result) {
        console.log('res', err, result);
        if (err) {
          return res.done({error: err.message || err})
        }
        res.done(result);
      });
    } catch (e) {
      console.log('EEE', e);
      res.done({error: e.message})
    }
  });
}


```

</details>


### hexo-helper-live2d
- 增加了给自定义页面中 加入 `no_live2d`不显示`live2d`的功能
- 增加了让自定义页面手机端强制使用live2d， 即时配置填了mobile.show = false

`/node_modules/hexo-helper-live2d/index.js`

<details>
<summary>展开代码</summary>
```javascript
/**
 * @description The live2d-widget generator for hexo
 */
/* global hexo */


const _ = require('lodash');
const fs = require('hexo-fs');
const path = require('path');
const url = require('url');

const buildGeneratorsFromManifest = require('./lib/buildGeneratorsFromManifest');
const getFileMD5 = require('./lib/getFileMD5');
const getNodeModulePath = require('./lib/getNodeModulePath');
const loadModelFrom = require('./lib/loadModelFrom');
const print = require('./lib/print');

const generators = [];

const manifest = require('live2d-widget/lib/manifest');
const mainfestPath = require.resolve('live2d-widget/lib/manifest');
const coreScriptName = manifest['main.js'];
const thisPkgInfo = require('./package');
const widgetVer = thisPkgInfo.dependencies['live2d-widget'];
const localWidgetVer = require(path.resolve(require.resolve('live2d-widget'), '../../', 'package')).version;

const blogRoot = hexo.config.root || '/';

const defaultConfig = {
  'enable': true,
  'log': false,
  'pluginJsPath': 'lib/',
  'pluginModelPath': 'assets/',
  'pluginRootPath': 'live2dw/',
  'scriptFrom': 'local',
  'tagMode': false,
};

// Apply options with default
let config = _.defaultsDeep({
}, hexo.config.live2d, hexo.theme.config.live2d, defaultConfig);

/**
 * Get entry point script URL according to type of source
 * @param  {String} scriptFrom The type of source
 * @return {String}            URL of entry point
 */
function getScriptURL (scriptFrom) { // eslint-disable-line max-lines-per-function

  if (config.log) {

    print.log(`hexo-helper-live2d@${thisPkgInfo.version}, using live2d-widget@${widgetVer}.`);

  }

  switch (scriptFrom) {

  case 'local': {

    /*
     * Is local(1)
     * Use local
     */
    if (config.log) {

      print.log(`use local live2d-widget@${localWidgetVer}`);

    }
    const scriptGenerators = buildGeneratorsFromManifest(manifest, path.dirname(mainfestPath), `${config.pluginRootPath}${config.pluginJsPath}`);
    const useHash = getFileMD5(path.resolve(path.dirname(mainfestPath), coreScriptName));
    generators.push(...scriptGenerators);
    return `${blogRoot}${url.resolve(`${config.pluginRootPath}${config.pluginJsPath}`, coreScriptName)}?${useHash}`;

  }
  case 'jsdelivr':

    /*
     * Is jsdelivr online CDN(2)
     * Use jsdelivr
     */
    return `https://cdn.jsdelivr.net/npm/live2d-widget@${widgetVer}/lib/${coreScriptName}`;
  case 'unpkg':

    /*
     * Is unpkg online CDN(3)
     * Use unpkg
     */
    return `https://unpkg.com/live2d-widget@${widgetVer}/lib/${coreScriptName}`;
  default:

    /*
     * Is custom(4)
     * Use custom
     */
    return scriptFrom;

  }

}

if (config.enable) {

  _.unset(config, 'enable');
  if (_.hasIn(config, 'model.use')) {

    let modelJsonUrl = null;
    let tryPath = path.resolve(hexo.base_dir, './live2d_models/', config.model.use);
    if (fs.existsSync(tryPath)) { // eslint-disable-line no-sync

      /*
       * Is in live2d_models(2)
       * LoadModelFrom
       */
      const {
        modelGenerators,
        'modelJsonUrl': pkgModelJsonUrl,
      } = loadModelFrom(tryPath, `${config.pluginRootPath}${config.pluginModelPath}`);
      modelJsonUrl = `${blogRoot}${pkgModelJsonUrl}`;
      generators.push(...modelGenerators);
      if (config.log) {

        print.log(`Loaded model from live2d_models folder(2), '${url.parse(modelJsonUrl).pathname}' from '${tryPath}'`);

      }

    } else {

      tryPath = path.resolve(hexo.base_dir, config.model.use);
      if (fs.existsSync(tryPath)) { // eslint-disable-line no-sync

        /*
         * Is in hexo base releated path(3)
         * LoadModelFrom
         */
        const {
          modelGenerators,
          'modelJsonUrl': pkgModelJsonUrl,
        } = loadModelFrom(tryPath, `${config.pluginRootPath}${config.pluginModelPath}`);
        modelJsonUrl = `${blogRoot}${pkgModelJsonUrl}`;
        generators.push(...modelGenerators);
        if (config.log) { // eslint-disable-line max-depth

          print.log(`Loaded model from hexo base releated path(3), '${url.parse(modelJsonUrl).pathname}' from '${tryPath}'`);

        }

      } else if (getNodeModulePath(config.model.use) === null) {

        /*
         * Is custom(4)
         * Use custom
         */
        modelJsonUrl = config.model.use;
        if (config.log) { // eslint-disable-line max-depth

          print.log(`Loaded Model from custom(4), at '${modelJsonUrl}'`);

        }

      } else {

        /*
         * Is npm-module(1)
         * Convert path to assets folder
         * LoadModelFrom
         */
        const packageJsonPath = path.resolve(getNodeModulePath(config.model.use), 'package.json');
        const packageJsonObj = require(packageJsonPath); // eslint-disable-line global-require
        const assetsDir = path.resolve(getNodeModulePath(config.model.use), './assets/');
        const {
          modelGenerators,
          'modelJsonUrl': pkgModelJsonUrl,
        } = loadModelFrom(assetsDir, `${config.pluginRootPath}${config.pluginModelPath}`);
        modelJsonUrl = `${blogRoot}${pkgModelJsonUrl}`;
        generators.push(...modelGenerators);
        if (config.log) { // eslint-disable-line max-depth

          print.log(`Loaded model from npm-module(1), ${packageJsonObj.name}@${packageJsonObj.version} from '${assetsDir}'`);

        }

      }

    }
    if (modelJsonUrl === null) {

      print.error('Did not found model json');

    }
    _.unset(config, 'model.use');
    config = _.set(config, 'model.jsonPath', modelJsonUrl);

  }

  const scriptUrlToInject = getScriptURL(config.scriptFrom);
  _.unset(config, 'scriptFrom');

  if (config.tagMode) {

    hexo.extend.helper.register('live2d', () => {

      if (config.log) {

        print.log('live2d tag detected, use tagMode.');

      }
      const scriptToInject = `L2Dwidget.init(${JSON.stringify(config)});`;
      const contentToInject = `<script src="${scriptUrlToInject}"></script><script>${scriptToInject}</script>`;
      return contentToInject;

    });

  } else {

    hexo.extend.helper.register('live2d', () => {

      print.warn('live2d tag detected, but won\'t be use. Make sure \'tagMode\' config is expected. See #36, #122.');

    });

  }

  /*
   * Injector borrowed form here:
   * https://github.com/Troy-Yang/hexo-lazyload-image/blob/master/lib/addscripts.js
   */
  if (!config.tagMod) {

    hexo.extend.filter.register('after_render:html', (htmlContent) => {

      if ((/mobile_force_show/i).test(htmlContent)) {
        config.mobile.show = true;
      }
      else {
        config.mobile.show = false;
      }

      const scriptToInject = `L2Dwidget.init(${JSON.stringify(config)});`;
      const contentToInject = `<script src="${scriptUrlToInject}"></script><script>${scriptToInject}</script>`;
      let newHtmlContent = htmlContent;

      if ((/(no_live2d)/i).test(htmlContent)) {
        return newHtmlContent;
      }

      if ((/([\n\r\s\t]*<\/body>)/i).test(htmlContent)) {

        const lastIndex = htmlContent.lastIndexOf('</body>');
        newHtmlContent = `${htmlContent.substring(0, lastIndex)}${contentToInject}${htmlContent.substring(lastIndex, htmlContent.length)}`; // eslint-disable-line no-magic-numbers

      }
      return newHtmlContent;

    });

  }

  hexo.extend.generator.register('live2d', () => generators);

}
```
</details>