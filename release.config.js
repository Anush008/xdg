const { execSync } = require("node:child_process");

const releaseConfig = {
  branches: ["main"],
  plugins: [
    ["@semantic-release/commit-analyzer", { preset: "conventionalcommits" }],
    ["@semantic-release/npm", { pkgRoot: "npm" }],
    [
      "@semantic-release/git",
      {
        assets: ["npm/package.json"],
      },
    ],
    "@semantic-release/github",
  ],
};

const {
  GITHUB_SHA,
  GIT_COMMITTER_NAME,
  GIT_COMMITTER_EMAIL,
  GIT_AUTHOR_NAME,
  GIT_AUTHOR_EMAIL,
} = process.env;
const addPlugin = (plugin, options) => {
  return releaseConfig.plugins.push([plugin, options]);
};

!GIT_COMMITTER_NAME && (process.env.GIT_COMMITTER_NAME = "open-sauced[bot]");
!GIT_COMMITTER_EMAIL &&
  (process.env.GIT_COMMITTER_EMAIL =
    "63161813+open-sauced[bot]@users.noreply.github.com");

try {
  const authorName = execSync(`git log -1 --pretty=format:%an ${GITHUB_SHA}`, {
    encoding: "utf8",
    stdio: "pipe",
  });
  const authorEmail = execSync(`git log -1 --pretty=format:%ae ${GITHUB_SHA}`, {
    encoding: "utf8",
    stdio: "pipe",
  });
  authorName &&
    !GIT_AUTHOR_NAME &&
    (process.env.GIT_AUTHOR_NAME = `${authorName}`);
  authorEmail &&
    !GIT_AUTHOR_EMAIL &&
    (process.env.GIT_AUTHOR_EMAIL = `${authorEmail}`);
} catch (e) {
  console.error(e);
}

if (process.env.GITHUB_ACTIONS !== undefined) {
  addPlugin("@semantic-release/exec", {
    successCmd: `echo 'RELEASE_TAG=v\${nextRelease.version}' >> $GITHUB_ENV
echo 'RELEASE_VERSION=\${nextRelease.version}' >> $GITHUB_ENV
echo 'release-tag=v\${nextRelease.version}' >> $GITHUB_OUTPUT
echo 'release-version=\${nextRelease.version}' >> $GITHUB_OUTPUT`,
  });
}

module.exports = releaseConfig;
