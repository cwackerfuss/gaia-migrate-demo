import * as blockstack from 'blockstack'

export const fetchManifest = () => {
  return blockstack.getFile('/manifest.json')
    .then( fileData => {
      return JSON.parse(fileData) || {}
    })
    .catch( error => {
      throw new Error(error)
    })
}

export const setManifestLastUpdatedToNow = () => {
  return fetchManifest()
    .then(manifest => ({ ...manifest, lastUpdated: Date.now() }))
    .then(updated => (
      blockstack.putFile('/manifest.json', JSON.stringify(updated))
    ))
}

const getLastUpdated = manifest => manifest.lastUpdated || Date.now();

const parseMigrationNameForTimestamp = name => name.split('_')[1];

const getNewMigrationsSinceLastUpdated = (migrations, lastUpdated) => (
  Object.keys(migrations)
    .filter(key => {
      const timestamp = parseMigrationNameForTimestamp(key)
      return timestamp < lastUpdated
    })
    .sort( (a, b) => a - b )
    .map( key => migrations[key] )
)

const performUpdates = migrations => {
  migrations.forEach(migration => {
    migration();
  });
  return;
};

const filterByNewMigrations = migrations => manifest => {
  const lastUpdated = getLastUpdated(manifest);
  const newMigrations = getNewMigrationsSinceLastUpdated(migrations, lastUpdated);
  return newMigrations;
}

export function checkForUpdates(migrations) {
  return fetchManifest()
    .then(filterByNewMigrations(migrations))
    .then(performUpdates)
    .then(setManifestLastUpdatedToNow)
}
