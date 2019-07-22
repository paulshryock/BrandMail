const fs = require('fs');

module.exports = function(eleventyConfig) {

  // Configure BrowserSync
  eleventyConfig.setBrowserSyncConfig({
    port: 9000
  });

  // Copy static assets
  const assets = [
    'css',
    'js',
    'img',
    'fonts',
    'favicon.ico',
  ];

  assets.forEach((asset) => {
    try {
      if (fs.existsSync(`./src/${asset}`)) {
        eleventyConfig.addPassthroughCopy(`src/${asset}`);
      }
    } catch(err) {
      console.error(err)
    }
  });
  
  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
      output: "build/app"
    }
  };
};