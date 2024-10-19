import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Rename Keys',
  key: 'renameKeys',
  description: 'Rename keys in a given object',
  arguments: [
    {
      label: 'Object',
      key: 'obj',
      type: 'string',
      required: true,
      variables: true,
    },
    {
      label: 'Inputs',
      key: 'inputs',
      type: 'dynamic',
      required: false,
      fields: [
        {
          label: 'Old Key',
          key: 'old_key',
          type: 'string',
          required: true,
          variables: true,
        },
        {
          label: 'New Key',
          key: 'new_key',
          type: 'string',
          required: true,
          variables: true,
          valueType: 'parse',
        },
      ],
    },
  ],
  async run($) {
    const { obj, inputs } = $.step.parameters;
    const parsedObjs = JSON.parse(obj);
    const newObjects = [];

    for (const parsedObj of parsedObjs) {
      let newObject = {};
      for (const key in parsedObj) {
        let found = false;
        for (const input of inputs) {
          if (key === input.old_key) {
            newObject[input.new_key] = parsedObj[key];
            found = true;
            break;
          }
        }
        if (!found) {
          newObject[key] = parsedObj[key];
        }
      }
      newObjects.push(newObject);
    }

    $.setActionItem({ raw: { output: newObjects } });
  },
});
