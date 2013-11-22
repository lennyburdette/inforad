'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'server.js',
        env: { PORT: 3000 }
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'src/sass',
          cssDir: 'public/stylesheets',
          environment: 'production',
          outputStyle: 'nested'
        }
      }
    },
    concat: {
      app: {
        src: [
          'src/js/vendor/ractive/build/Ractive.js',
          'src/js/demo_script.js',
          'src/js/app.js'
        ],
        dest: 'public/javascript/app.min.js'
      },
      slideshow: {
        src: [
          'src/js/external/jquery.js',
          'src/js/external/foundation.min.js',
          'src/js/slideshow.js'
        ],
        dest: 'public/javascript/slideshow.min.js'
      },
      modernizr: {
        src: ['src/js/modernizr.js'],
        dest: 'public/javascript/modernizr.min.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'public/javascript/app.min.js': ['public/javascript/app.min.js'],
          'public/javascript/slideshow.min.js': ['public/javascript/slideshow.min.js']
        }
      }
    },
    cssmin: {
      dist: {
        files: {
          'public/stylesheets/app.css': ['public/stylesheets/app.css']
        }
      }
    },
    watch: {
      options: {
        nospawn: true
      },
      server: {
        files: ['server.js'],
        tasks: ['develop']
      },
      compass: {
        files: ['src/sass/**/*'],
        tasks: ['compass']
      },
      js: {
        files: ['src/js/**/*'],
        tasks: ['concat']
      }
    },
    clean: {
      build: {
        src: ["public/stylesheets/*", "public/javascript/*"]
      }
    }
  });

  grunt.loadNpmTasks('grunt-develop');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['compass', 'concat', 'develop', 'watch']);
  grunt.registerTask('build', ['compass', 'cssmin', 'concat', 'uglify']);

};