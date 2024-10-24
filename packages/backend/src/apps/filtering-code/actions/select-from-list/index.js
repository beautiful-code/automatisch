import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Select From List',
  key: 'selectFromList',
  description: 'Select items from a given List based on a condition',
  arguments: [
    {
      label: 'List',
      key: 'inputList',
      type: 'string',
      required: true,
      variables: true,
    },
    {
      label: 'Code Snippet',
      key: 'codeSnippet',
      type: 'code',
      required: true,
      variables: false,
      value:
        '// You have access the variable "item", which is an item in the List.\n// Write a condition for the filter function here.\n// Return true if the item should be included in the filtered list, false otherwise.\n return true;',
    },
  ],
  async run($) {
    const { inputList, codeSnippet } = $.step.parameters;
    console.log("inputList ", inputList);
    const parsedInputList = JSON.parse(inputList);

    const ivm = (await import('isolated-vm')).default;
    const isolate = new ivm.Isolate({ memoryLimit: 128 });

    try {
      const context = await isolate.createContext();
      await context.global.set(
        'inputs',
        new ivm.ExternalCopy(parsedInputList).copyInto()
      );

      const completeCodeSnippet = `const code = async (inputs) => { filterInputs = inputs.filter(item => {${codeSnippet}}); return filterInputs; }; code(inputs);`;
      const compiledCodeSnippet = await isolate.compileScript(completeCodeSnippet);
      const codeFunction = await compiledCodeSnippet.run(context, {
        reference: true,
        promise: true,
      });

      $.setActionItem({ raw: { output: await codeFunction.copy() } });
    } finally {
      isolate.dispose();
    }
  },
});
