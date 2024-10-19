import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'List events',
  key: 'listEvents',
  description: 'List all events',
  arguments: [
    {
      label: 'Calendar',
      key: 'calendarId',
      type: 'dropdown',
      required: true,
      description: '',
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listCalendars',
          },
        ],
      },
    },
    {
      label: 'Start Date Time',
      key: 'startDateTime',
      type: 'string',
      required: false,
      description:
        'The start date time of the events to list. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z.',
      variables: true,
    },
    {
      label: 'End Date Time',
      key: 'endDateTime',
      type: 'string',
      required: false,
      description:
        'The end date time of the events to list. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z.',
      variables: true,
    },
  ],

  async run($) {
    const calendarId = $.step.parameters.calendarId;
    const startDateTime = $.step.parameters.startDateTime;
    const endDateTime = $.step.parameters.endDateTime;

    const params = {
      timeMin: startDateTime,
      timeMax: endDateTime,
    };

    const { data } = await $.http.get(`/v3/calendars/${calendarId}/events`, {
      params,
    });

    $.setActionItem({
      raw: data,
    });
  },
});

