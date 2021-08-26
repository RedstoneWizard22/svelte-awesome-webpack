module.exports = () => ({
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    // Use cssnano for css compression
    require("cssnano")({
      preset: ["default", { discardComments: { removeAll: true } }],
    }),
  ],
});
