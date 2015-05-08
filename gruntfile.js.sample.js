module.exports = function(grunt) {
  var path = require('path');
  var requirejsOptions = {};

  // create requirejs options
  ['main'].forEach(function(main, i) {
    var name = 'compile' + i;
    var all = main.replace(/^main/, "all");
    requirejsOptions[name] = {
      options: {
        include: [ 'lib/almond', main ],
        baseUrl: './source/js',
        paths: {
          'mod' : 'mod',
          'knockout': 'lib/knockout',
          'knockout.mapping': 'lib/knockout.mapping'
        },
        shims: {
          'knockout.mapping': ['knockout']
        },
        out: './source/js/' + all + '.js',
        optimize: 'none',
        wrap: true
      }
    };
  });
 
  grunt.initConfig({
    // bowerでインストールしたライブラリをsource以下に置く
    bower: {
      install: {
        options: {
          targetDir: './source/js/lib',
          layout: function(type, component, source) {
            return path.join();
          },
          install: true,
          verbose: false,
          cleanTargetDir: false,
          cleanBowerDir: false
        }
      }
    },

    // 監視用の設定
    watch: {
      files: [
        './source/js/main.js',
        './source/js/main-*.js'
      ],
      tasks: ['requirejs']
    },

    // requirejs用の設定
    requirejs: requirejsOptions,

    // middlemanの設定
    middleman: {
      options: {
        useBundle: true
      },
      server: {
        options: {
          command: "server",
          useBundle: true,
          environment: "development",
          host: "192.168.1.11",
          port: 4567,
          clean: true,
        }
      },
      build: {
        options: {
          command: 'build'
        }
      }
    }
  });

  //matchdepでpackage.jsonから"grunt-*"で始まる設定を読み込む
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('i', ['bower:install']);
  grunt.registerTask('s', ['middleman:server']);
  grunt.registerTask('b', ['requirejs', 'middleman:build']);
};
