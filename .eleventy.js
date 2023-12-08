module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("layout.css")
  eleventyConfig.addPassthroughCopy("forgov-process-diagrams.css")
  eleventyConfig.addPassthroughCopy("forgov-process-diagrams.js")
  eleventyConfig.addPassthroughCopy("./node_modules/bootstrap/dist/css/bootstrap.min.css")
  eleventyConfig.addPassthroughCopy("./node_modules/bootstrap/dist/js/bootstrap.min.js")
  eleventyConfig.addPassthroughCopy("./node_modules/jquery/dist/jquery.min.js")

  // eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
  eleventyConfig.setServerOptions({
    watch: [
      "_site/*.css",
      "_site/*.js"
    ]
  })
}
