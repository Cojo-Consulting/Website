module.exports = function (eleventyConfig) {
  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

  // "+41 79 935 65 06" -> "41799356506", for tel: and wa.me links
  eleventyConfig.addFilter("digits", (value) => String(value).replace(/\D/g, ""));

  // Soft hyphens (U+00AD) at compound boundaries of long words, so phones break
  // "Berufshaftpflichtversicherung" as "Berufs-haftpflicht-versicherung" and nowhere else.
  // Parts live in src/_data/hyphenation.json. Only text between tags in <body> is touched
  // (no attributes, <head>, <script> or <style>).
  const { minWordLength, parts } = require("./src/_data/hyphenation.json");
  const sortedParts = [...parts].sort((a, b) => b.length - a.length);
  const hyphenateWord = (word) => {
    if (word.length < minWordLength) return word;
    const lower = word.toLowerCase();
    let out = "";
    let i = 0;
    while (i < word.length) {
      const part = sortedParts.find((p) => lower.startsWith(p, i));
      if (part) {
        if (i >= 3) out += "­";
        out += word.slice(i, i + part.length);
        i += part.length;
      } else {
        out += word[i++];
      }
    }
    return out;
  };
  eleventyConfig.addTransform("hyphenate", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    const bodyStart = content.indexOf("<body");
    if (bodyStart === -1) return content;
    const head = content.slice(0, bodyStart);
    const body = content
      .slice(bodyStart)
      .replace(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]*>)|([^<]+)/g, (m, tag, text) =>
        tag
          ? tag
          : text
              .replace(/[A-Za-zÄÖÜäöüß]+/g, hyphenateWord)
              // keep shortened compounds together ("und -vermittlung"): no break after the hyphen
              .replace(/(^|\s)-(?=[A-Za-zÄÖÜäöüß])/g, "$1-⁠")
      );
    return head + body;
  });

  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/downloads": "downloads" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

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
