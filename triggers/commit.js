const uid = require('uid')

// triggers on a new commit with a certain tag
const perform = async (z, bundle) => {
  const baseUrl = 'https://api.github.com/repos/'
  const profile = bundle.inputData.profile_name + '/'
  const repo = bundle.inputData.repo_name
  const url = baseUrl + profile + repo + '/commits'

  const response = await z.request({
    url,
    params: {
      tag: bundle.inputData.tagName
    }
  });
  // this should return an array of objects
  const res = response.data
  
  const res_with_id = res.map((obj) => {
    const idNum = uid(100)
    obj.id = idNum
    return obj
  })
  
  return res_with_id
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/master/packages/schema/docs/build/schema.md#triggerschema
  key: 'commit',
  noun: 'Commit',

  display: {
    label: 'New Commit',
    description: 'Triggers when a new commit is created.'
  },

  operation: {
    perform,

    // `inputFields` defines the fields a user could provide
    // Zapier will pass them in as `bundle.inputData` later. They're optional.
    inputFields: [
      {
        key: 'profile_name',
        required: true,
        label: 'Profile Name',
        helpText: 'Identify name of your Github profile',
        type: 'string',
        altersDynamicFields: true
      },
      {
        key: 'repo_name',
        required: true,
        label: 'Repo Name',
        helpText: 'Identify name of target repo',
        dynamic: 'repoList.name',
      }
    ],

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obvious placeholder values that we can show to any user.
    sample: {
      id: 1,
      name: 'Test'
    },

    // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
    // For a more complete example of using dynamic fields see
    // https://github.com/zapier/zapier-platform/tree/master/packages/cli#customdynamic-fields
    // Alternatively, a static field definition can be provided, to specify labels for the fields
    outputFields: [
      {key: 'id', type: 'number'}
      // these are placeholders to match the example `perform` above
      // {key: 'id', label: 'Person ID'},
      // {key: 'name', label: 'Person Name'}
    ]
  }
};
