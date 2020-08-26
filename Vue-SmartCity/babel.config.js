module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  "plugins": [
    ["import", {
      "libraryName": "axios",
      "libraryDirectory": "src/components"
    }]
  ]
}
