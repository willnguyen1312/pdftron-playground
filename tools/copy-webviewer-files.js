const pdftronVersion = require("@pdftron/webviewer/package.json").version;
const fs = require("fs-extra");

const copyFiles = async () => {
  try {
    await fs.copy(
      "./node_modules/@pdftron/webviewer/public/core",
      `./public/webviewer/${pdftronVersion}/`
    );
    console.log("WebViewer files copied over successfully");
  } catch (err) {
    console.error(err);
  }
};

copyFiles();
