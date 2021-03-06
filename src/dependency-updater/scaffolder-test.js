import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';
import * as prompt from './prompt';
import scaffoldUpdater from './scaffolder';
import {questionNames} from '../prompts/question-names';
import {promptForDependencyUpdaterChoice} from './prompt';

suite('dependency-updater scaffolder', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(prompt, 'promptForDependencyUpdaterChoice');
  });

  teardown(() => sandbox.restore());

  test('that the chosen scaffolder is executed with the appropriate options', async () => {
    const decisions = any.simpleObject();
    const options = any.simpleObject();
    const chosenUpdater = any.word();
    const chosenUpdaterScaffolder = sinon.stub();
    const scaffolders = {...any.simpleObject(), [chosenUpdater]: {scaffolder: chosenUpdaterScaffolder}};
    const scaffolderResult = any.simpleObject();
    promptForDependencyUpdaterChoice
      .withArgs(scaffolders, decisions)
      .resolves({[questionNames.DEPENDENCY_UPDATER]: chosenUpdater});
    chosenUpdaterScaffolder.withArgs(options).resolves(scaffolderResult);

    assert.equal(await scaffoldUpdater(scaffolders, decisions, options), scaffolderResult);
  });

  test('that no prompt is presented if no updaters are registered', async () => {
    assert.isUndefined(await scaffoldUpdater({}, any.simpleObject(), any.simpleObject()));
    assert.notCalled(promptForDependencyUpdaterChoice);
  });

  test('that that choosing an updater without a defined scaffolder does not result in an error', async () => {
    promptForDependencyUpdaterChoice.resolves({[questionNames.DEPENDENCY_UPDATER]: any.word()});

    assert.isUndefined(await scaffoldUpdater(any.simpleObject(), any.simpleObject(), any.simpleObject()));
  });
});
