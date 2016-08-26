module.exports = function (grunt) {

require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks 
 
grunt.initConfig({
    babel: {
        options: {
            sourceMap: false,
            presets: ['es2015']
        },
        dist: {
            files: [{
                expand: true,
                cwd: 'babel',
                src: ['*.js'],
                dest: 'js',
                ext: '.js',
                exDot: 'first'
            }]
        }
    },
    watch: {
        babel: {
            files: 'babel/*.js',
            tasks: ['babel']
        }
    }
});
 
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.registerTask('default', ['babel']);

};