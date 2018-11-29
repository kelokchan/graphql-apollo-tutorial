const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema } = require('graphql');
const axios = require('axios');
const { API_URL } = require('./config');

// Launch type
const LaunchType = new GraphQLObjectType({
  name: 'Launch',
  fields: () => ({
    flight_number: { type: GraphQLInt },
    mission_name: { type: GraphQLString },
    launch_year: { type: GraphQLString },
    launch_date_local: { type: GraphQLString },
    launch_success: { type: GraphQLBoolean },
    rocket: { type: RocketType }
  })
});

// Rocket Type
const RocketType = new GraphQLObjectType({
  name: 'Rocket',
  fields: () => ({
    rocket_id: { type: GraphQLString },
    rocket_name: { type: GraphQLString },
    rocket_type: { type: GraphQLString }
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    launches: {
      type: GraphQLList(LaunchType),
      async resolve(parent, args) {
        const res = await axios.get(`${API_URL}/launches`);
        return res.data;
      }
    },
    launch: {
      type: LaunchType,
      args: {
        flight_number: { type: GraphQLInt }
      },
      async resolve(parent, args) {
        const res = await axios.get(`${API_URL}/launches/${args.flight_number}`);
        return res.data;
      }
    },
    rockets: {
      type: GraphQLList(RocketType),
      async resolve(parent, args) {
        const res = await axios.get(`${API_URL}/rockets`);
        return res.data;
      }
    },
    rocket: {
      type: RocketType,
      args: {
        id: { type: GraphQLString }
      },
      async resolve(parent, args) {
        const res = await axios.get(`${API_URL}/rockets/${args.id}`);
        return res.data;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
