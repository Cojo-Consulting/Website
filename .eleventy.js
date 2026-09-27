module.exports = function (eleventyConfig) {
  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

  // "+41 79 935 65 06" -> "41799356506", for tel: and wa.me links
  eleventyConfig.addFilter("digits", (value) => String(value).replace(/\D/g, ""));

  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/downloads": "downloads" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  // Pages with `draft: true` are skipped entirely: no output, no collections, no sitemap.
  eleventyConfig.addPreprocessor("drafts", "*", (data) => {
    if (data.draft) return false;
  });

  // Wissen articles for the overview cards, sorted alphabetically by heading.
  eleventyConfig.addCollection("wissen", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("./src/wissen/*.md")
      .sort((a, b) =>
        (a.data.heading || a.data.title).localeCompare(b.data.heading || b.data.title, "de")
      )
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
