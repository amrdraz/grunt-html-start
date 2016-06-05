'use strict';


module.exports = function(grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required grunt tasks
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
    });

    // Configurable paths
    var config = {
        app: 'src',
        dist: 'dist',
        img: 'assets/img',
        scripts: 'assets/js',
        styles: 'assets/css',
        fonts: 'assets/fonts',
        media: 'assets/media'
    };


    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: config,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            gruntfile: {
                files: ['Gruntfile.js']
            },
            styles: {
                files: ['<%= config.app %>/<%= config.styles %>/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'postcss']
            }
        },

        browserSync: {
            options: {
                notify: false,
                background: true,
                watchOptions: {
                    ignored: ''
                }
            },
            livereload: {
                options: {
                    files: [
                        '<%= config.app %>/{,*/}*.html',
                        '.tmp/<%= config.styles %>/{,*/}*.css',
                        '<%= config.app %>/<%= config.img %>/{,*/}*',
                        '<%= config.app %>/<%= config.scripts %>/{,*/,**/}*.js'
                    ],
                    port: 9000,
                    server: {
                        baseDir: ['.tmp', config.app],
                        routes: {
                            '/bower_components': './bower_components'
                        }
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    open: false,
                    logLevel: 'silent',
                    host: 'localhost',
                    server: {
                        baseDir: ['.tmp', './test', config.app],
                        routes: {
                            '/bower_components': './bower_components'
                        }
                    }
                }
            },
            dist: {
                options: {
                    background: false,
                    server: '<%= config.dist %>'
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        eslint: {
            target: [
                'Gruntfile.js',
                '<%= config.app %>/<%= config.scripts %>/{,*/}*.js',
                '!<%= config.app %>/<%= config.scripts %>/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },

        // Mocha testing framework configuration options
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://<%= browserSync.test.options.host %>:<%= browserSync.test.options.port %>/index.html']
                }
            }
        },



        postcss: {
            options: {
                map: true,
                processors: [
                    // Add vendor prefixed styles
                    require('autoprefixer')({
                        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
                    })
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/<%= config.styles %>/',
                    src: '{,*/}*.css',
                    dest: '.tmp/<%= config.styles %>/'
                }]
            }
        },

        // Automatically inject Bower components into the HTML file
        wiredep: {
            app: {
                src: ['<%= config.app %>/index.html'],
                ignorePath: /^(\.\.\/)*\.\./
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= config.dist %>/<%= config.scripts %>/{,*/}*.js',
                    '<%= config.dist %>/<%= config.styles %>/{,*/}*.css',
                    // '<%= config.dist %>/<%= config.img %>/{,*/}*.*',
                    // '<%= config.dist %>/<%= config.fonts %>/{,*/,*/*/}*.*',
                    // '<%= config.dist %>/<%= config.media %>/{,*/}*.*',
                    '<%= config.dist %>/*.{ico,png}'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            options: {
                dest: '<%= config.dist %>'
            },
            html: '<%= config.app %>/index.html'
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: [
                    '<%= config.dist %>',
                    '<%= config.dist %>/<%= config.img %>',
                    '<%= config.dist %>/<%= styles %>'
                    // '<%= config.dist %>/<%= scripts %>'
                ]
            },
            html: ['<%= config.dist %>/{,*/}*.html'],
            css: ['<%= config.dist %>/<%= config.styles %>/{,*/}*.css']
            // js: ['<%= config.dist %>/<%= config.scripts %>/{,*/}*.js']
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            static: {
                options: {
                    optipng: false,
                    advpng: true,
                    jpegRecompress: false,
                    jpegoptim: true,
                    mozjpeg: true,
                    svgo: true
                }
            },
            dynamic: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/<%= config.img %>',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: '<%= config.dist %>/<%= config.img %>'
                }]
            }
        },
        
        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    // true would impact styles with attribute selectors
                    removeRedundantAttributes: false,
                    useShortDoctype: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.dist %>',
                    src: '{,*/}*.html',
                    dest: '<%= config.dist %>'
                }]
            }
        },

        // By default, your `index.html`'s <!-- Usemin block --> will take care
        // of minification. These next options are pre-configured if you do not
        // wish to use the Usemin blocks.
        // cssmin: {
        //   dist: {
        //     files: {
        //       '<%= config.dist %>/<%= config.styles %>/main.css': [
        //         '.tmp/<%= config.styles %>/{,*/}*.css',
        //         '<%= config.app %>/<%= config.styles %>/{,*/}*.css'
        //       ]
        //     }
        //   }
        // },
        // uglify: {
        //   dist: {
        //     files: {
        //       '<%= config.dist %>/<%= config.scripts %>/scripts.js': [
        //         '<%= config.dist %>/<%= config.scripts %>/scripts.js'
        //       ]
        //     }
        //   }
        // },
        // concat: {
        //   dist: {}
        // },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.txt',
                        '<%= config.img %>/{,*/}*.{webp,svg,jpg,png}',
                        '{,*/}*.html',
                        '<%= config.fonts %>/{,*/,*/*/}*.*',
                        '<%= config.media %>/{,*/}*.*',
                        'svg/*.svg'
                    ]
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>/<%= styles %>',
                dest: '.tmp/<%= config.styles %>/',
                src: '{,*/}*.css'
            }
        },

        // Run some tasks in parallel to speed up build process
        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles'
                // 'imagemin',
            ]
        }

    });


    grunt.registerTask('serve', 'start the server and preview your app', function(target) {

        if (target === 'dist') {
            return grunt.task.run(['build', 'browserSync:dist']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'postcss',
            'browserSync:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function(target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run([target ? ('serve:' + target) : 'serve']);
    });

    grunt.registerTask('test', function(target) {
        if (target !== 'watch') {
            grunt.task.run([
                'clean:server',
                'concurrent:test',
                'postcss'
            ]);
        }

        grunt.task.run([
            'browserSync:test',
            'mocha'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'postcss',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        'filerev',
        'usemin',
    ]);

    grunt.registerTask('default', [
        'newer:eslint',
        'test',
        'build'
    ]);
};