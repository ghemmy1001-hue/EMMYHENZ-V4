const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const file = path.join(dataDir, 'security.json');

const defaults = {
  antilink: {},
  antibadword: {},
  antitag: {},
  antibot: {},
  antiviewonce: {},
  antitaggroup: {}
};

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function load() {
  ensureDataDir();

  if (!fs.existsSync(file)) {
    fs.writeFileSync(
      file,
      JSON.stringify(defaults, null, 2)
    );

    return { ...defaults };
  }

  try {
    const data = JSON.parse(
      fs.readFileSync(file, 'utf8')
    );

    // Preserve existing settings while adding
    // any new security categories.
    for (const type of Object.keys(defaults)) {
      if (!data[type]) {
        data[type] = {};
      }
    }

    return data;

  } catch (error) {
    console.log(
      '⚠️ Could not read security.json:',
      error.message
    );

    return {
      ...defaults
    };
  }
}

function save(data) {
  ensureDataDir();

  fs.writeFileSync(
    file,
    JSON.stringify(data, null, 2)
  );
}

function get(groupId, type) {
  const data = load();

  return Boolean(
    data[type]?.[groupId]
  );
}

function set(groupId, type, enabled) {
  const data = load();

  if (!data[type]) {
    data[type] = {};
  }

  data[type][groupId] = Boolean(enabled);

  save(data);
}

module.exports = {
  get,
  set
};
