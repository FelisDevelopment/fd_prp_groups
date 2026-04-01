export default {
  plugins: {
    "@tailwindcss/postcss": {},

    "./plugins/variable-opacity-plugin.cjs": {},

    "postcss-preset-env": {
      stage: 1,
      browsers: "Chrome 103",
      features: {
        "color-functional-notation": true,
        "custom-properties": {
          preserve: true,
          disableDeprecationNotice: true,
        },
        "color-mix": false,
        "oklab-function": false,
      },
      preserve: false,
      autoprefixer: false,
    },

    autoprefixer: {
      overrideBrowserslist: ["Chrome 103"],
      remove: false,
    },
  },
};
