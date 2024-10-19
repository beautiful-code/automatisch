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
  ],

  async run($) {
    const taskListId = $.step.parameters.taskListId;

    const params = {
      showCompleted: true,
      showHidden: true,
    };

    const { data } = await $.http.get(`/tasks/v1/lists/${taskListId}/tasks`, {
      params,
    });

    $.setActionItem({
      raw: data,
      dataOutput: {
        tasks: data.items,
      },
    });
  },
});
