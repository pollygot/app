// Apps:
//  HUMMINGBIRD: a full functional admin interface for PostgREST
//  PIDGEON: for managing PostGREST instance
//  SQUIRREL: for storing files and images
//  CHIMP: for managing Kong
//  BUMBLEBEE: for regular task using Kue/etc
//  QUOKKA: interface for KueJS
//  PLAYTPUS

module.exports = {
  apps: {
    HUMMINGBIRD: {
      key: "HUMMINGBIRD",
      name: 'Hummingbird',
      description: 'Admin interface for Postgres',
    },
    PIDGEON: {
      key: "PIDGEON",
      name: 'Pidgeon',
      description: 'API interface for PostgREST',
    },
    SQUIRREL: {
      key: "SQUIRREL",
      name: 'Squirrel',
      description: 'For storing files in all the main ',
    },
    BUMBLEBEE: {
      key: "BUMBLEBEE",
      name: 'BumbleBee',
      description: 'For regular task using Kue',
    },
    QUOKKA: {
      key: "QUOKKA",
      name: 'Quokka',
      description: 'Interface for KueJS ',
    },
  }
}
