import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'List tasks',
  key: 'listTasks',
  description: 'List all tasks in a task list.',
  arguments: [
    {
      label: 'Task List',
      key: 'taskListId',
      type: 'dropdown',
      required: true,
      description: 'The list to list tasks from.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listTaskLists',
          },
        ],
      },
    },
    {
      label: 'Show completed tasks',
      key: 'showCompleted',
      type: 'dropdown',
      required: false,
      value: false,
      description: 'Whether to show completed tasks.',
      options: [
        {
          label: 'Yes',
          value: true,
        },
        {
          label: 'No',
          value: false,
        },
      ],
    },
  ],

  async run($) {
    const taskListId = $.step.parameters.taskListId;

    const params = {
      showCompleted: $.step.parameters.showCompleted,
      showHidden: true,
      showDeleted: false,
    };

    const { data } = await $.http.get(`/tasks/v1/lists/${taskListId}/tasks`, {
      params,
    });

    $.setActionItem({
      raw: {
        tasks: data.items,
      },
      dataOutput: {
        tasks: data.items,
      },
    });
  },
});
